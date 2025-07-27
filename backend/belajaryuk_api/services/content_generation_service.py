import asyncio
import json
import logging
from uuid import UUID
from sqlalchemy.orm import Session

# Import services and helpers
from belajaryuk_api.services import course_service, ai_service, cancellation_service
from belajaryuk_api.utils.sse_broadcaster import broadcaster
from belajaryuk_api.schemas.course_schema import SubTopicPublicForStream

# Setup logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def orchestrate_content_generation(db: Session, course_id: str):
    cancellation_service.create_cancellation_token(course_id)
    try:
        logger.info(f"[Orchestrator] Starting content generation for course_id: {course_id}")

        # 1. Get all sub-topics for the course in the correct order
        sub_topics = course_service.get_sub_topics_for_course(db, course_id)
        if not sub_topics:
            logger.warning(f"[Orchestrator] No sub-topics found for course {course_id}. Aborting.")
            course_service.update_course_status_by_id(db, course_id, "failed")
            return

        # 2. Sequentially process each sub-topic
        for sub_topic in sub_topics:
            # Check for cancellation before processing each sub-topic
            if cancellation_service.is_cancelled(course_id):
                logger.warning(f"[Orchestrator] Cancellation requested for course {course_id}. Halting process.")
                # Revert status to blueprint_completed as generation was halted
                course_service.update_course_status_by_id(db, course_id, "blueprint_completed")
                await broadcaster.publish(
                    channel=str(course_id),
                    message=json.dumps({"event": "generation_cancelled"})
                )
                break

            if sub_topic.status == 'pending':
                logger.info(f"[Orchestrator] Processing sub-topic: '{sub_topic.title}' (ID: {sub_topic.id})")

                try:
                    # A. Get the necessary context for the AI prompt
                    course = course_service.get_course_by_id(db, course_id)
                    module = course_service.get_module_by_id(db, sub_topic.module_id)
                    previous_summary = course_service.get_summary_from_previous_sub_topic(db, sub_topic)
                    next_title = course_service.get_next_sub_topic_title(db, sub_topic)

                    # B. Call the AI service to generate content
                    total_subtopics_in_module = len(module.sub_topics)
                    generated_content = ai_service.generate_experience_for_sub_topic(
                        course_title=course.title,
                        course_description=course.description,
                        difficulty_level=course.difficulty.value, # Pass difficulty
                        module_title=module.title,
                        current_sub_topic_title=sub_topic.title,
                        subtopic_order=sub_topic.sub_topic_order, # Pass order
                        total_subtopics=total_subtopics_in_module, # Pass total
                        next_sub_topic_title=next_title,
                        previous_sub_topic_summary=previous_summary
                    )

                    # C. Save the result to the database
                    updated_sub_topic = course_service.update_sub_topic_with_generated_content(
                        db=db,
                        sub_topic=sub_topic,
                        generated_content=generated_content
                    )
                    db.commit()
                    db.refresh(updated_sub_topic)
                    logger.info(f"[Orchestrator] Sub-topic '{sub_topic.title}' content generated and saved successfully.")

                    # D. Broadcast the update
                    sub_topic_data = SubTopicPublicForStream.from_orm(updated_sub_topic).model_dump_json()
                    await broadcaster.publish(
                        channel=str(course_id),
                        message=json.dumps({"event": "sub_topic_completed", "data": sub_topic_data})
                    )

                except Exception as e:
                    logger.error(f"[Orchestrator] Failed to process sub-topic '{sub_topic.title}': {e}", exc_info=True)
                    # Mark sub-topic as failed and continue to the next one
                    sub_topic.status = 'failed'
                    db.add(sub_topic)
                    db.commit()
                    continue # Don't halt the entire process for one failure

        # 3. After the loop, determine and set the final status
        final_status = course_service.update_course_status_based_on_subtopics(db, course_id)
        logger.info(f"[Orchestrator] Content generation for course {course_id} finished with status: {final_status}")

        # 4. Broadcast the final status
        await broadcaster.publish(
            channel=str(course_id),
            message=json.dumps({"event": "generation_finished", "data": {"final_status": final_status}})
        )

    except Exception as e:
        logger.error(f"[Orchestrator] A critical error occurred during content orchestration for course {course_id}: {e}", exc_info=True)
        course_service.update_course_status_by_id(db, course_id, "failed")
    finally:
        # Always remove the token when the process is done
        cancellation_service.remove_cancellation_token(course_id)
