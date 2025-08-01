import logging
from sqlalchemy.orm import Session, joinedload, subqueryload
from typing import List, Optional, Dict, Any
from uuid import UUID
from fastapi import HTTPException, status

from belajaryuk_api.models.user import User
from belajaryuk_api.models.course import Course
from belajaryuk_api.models.module import Module
from belajaryuk_api.models.sub_topic import SubTopic
from belajaryuk_api.models.assessment import Assessment
from belajaryuk_api.schemas.course_schema import CourseCreate
from belajaryuk_api.services import ai_service

# Setup logger
logger = logging.getLogger(__name__)

def create_initial_course(db: Session, user: User, course_create_data: CourseCreate) -> Course:
    """
    Creates an initial, placeholder course entry in the database.
    This function runs synchronously and returns immediately.

    Returns:
        The newly created placeholder Course object.
    """
    new_course = Course(
        user_id=user.id,
        title=f"Kursus tentang {course_create_data.topic}", # Placeholder title
        description="Kurikulum sedang dibuat oleh AI...", # Placeholder description
        difficulty=course_create_data.difficulty, # Save the difficulty
        status='generating', # Set initial status
        full_blueprint={}
    )
    db.add(new_course)
    db.commit()
    db.refresh(new_course)
    
    logger.info(f"Course '{new_course.title}' creation initiated. Status set to 'generating'. Course ID: {new_course.id}")
    return new_course


def generate_and_populate_course(db: Session, course_id: UUID, course_create_data: CourseCreate):
    """
    This function runs in the background. It generates the full course content
    from the AI and populates the database.
    """
    """
    Orchestrates the entire course creation process.

    1. Gets a curriculum blueprint from the AI service.
    2. Persists the entire blueprint to the database in a single atomic transaction.

    Returns:
        The newly created Course object from the database.
    """
    # Step 1: Get the curriculum blueprint from the AI service
    try:
        blueprint = ai_service.run_course_creation_flow(
            topic=course_create_data.topic,
            difficulty=course_create_data.difficulty,
            goal=course_create_data.goal
        )
    except HTTPException as e:
        # Handle AI rejection gracefully - update course status to failed
        course_to_fail = db.query(Course).filter(Course.id == course_id).first()
        if course_to_fail:
            course_to_fail.status = 'failed'
            course_to_fail.description = f"Kurikulum tidak dapat dibuat: {e.detail.get('reason', 'Topik tidak sesuai')}"
            db.commit()
            logger.error(f"Course creation failed for course ID {course_id}. Status updated to 'failed'. Error: {e.detail.get('reason', 'Topik tidak sesuai')}")
            broadcaster.publish(
                channel=f"user_{course_to_fail.user_id}_courses",
                message=json.dumps({"event": "course_creation_failed", "data": CoursePublic.from_orm(course_to_fail).model_dump_json()})
            )
        return  # Exit gracefully - don't propagate exception in background task

    # Step 2: Run an atomic database transaction to save the blueprint
    try:
        # Find the placeholder course
        course_to_populate = db.query(Course).filter(Course.id == course_id).first()
        if not course_to_populate:
            print(f"Error: Course with ID {course_id} not found for background processing.")
            return

        # Update the course with the generated content
        course_to_populate.title = blueprint.get("course_title", course_to_populate.title)
        course_to_populate.description = blueprint.get("course_description", course_to_populate.description)
        course_to_populate.learning_outcomes = blueprint.get("learning_outcomes", [])
        course_to_populate.full_blueprint = blueprint

        # Iterate through the blueprint to create modules, sub-topics, etc.
        for module_order, module_data in enumerate(blueprint.get("modules", [])):
            new_module = Module(
                course_id=course_to_populate.id,
                title=module_data.get("module_title", "Untitled Module"),
                module_order=module_order + 1
            )
            db.add(new_module)
            db.flush()

            for sub_topic_order, sub_topic_data in enumerate(module_data.get("sub_topics", [])):
                new_sub_topic = SubTopic(
                    module_id=new_module.id,
                    title=sub_topic_data.get("title"), # Adjusted key based on AI output
                    sub_topic_order=sub_topic_order + 1,
                    content_markdown=None,
                    status='pending'
                )
                db.add(new_sub_topic)

            assessment_data = module_data.get("assessment_point")
            if assessment_data:
                db.add(Assessment(
                    course_id=course_to_populate.id,
                    module_id=new_module.id,
                    title=assessment_data.get("title"),
                    type=assessment_data.get("type"),
                    status='pending'
                ))

        final_assessment_data = blueprint.get("final_assessment")
        if final_assessment_data:
            db.add(Assessment(
                course_id=course_to_populate.id,
                title=final_assessment_data.get("title"),
                type=final_assessment_data.get("type"),
                status='pending'
            ))

        # Finally, update the status to 'blueprint_completed' to indicate blueprint is ready
        course_to_populate.status = 'blueprint_completed'
        
        db.commit()
        db.refresh(course_to_populate)

        logger.info(f"Blueprint for course '{course_to_populate.id}' successfully saved. Status updated to 'blueprint_completed'.")

    except Exception as e:
        db.rollback()
        # In a background task, we should log the error but not raise HTTPException
        # as it won't be caught by the client. We also update the course status to 'failed'.
        logger.error(f"Process failed for course ID {course_id}. Status updated to 'failed'. Error: {e}")
        course_to_fail = db.query(Course).filter(Course.id == course_id).first()
        if course_to_fail:
            course_to_fail.status = 'failed'
            course_to_fail.description = f"AI gagal membuat kurikulum: {e}"
            db.commit()
            broadcaster.publish(
                channel=f"user_{course_to_fail.user_id}_courses",
                message=json.dumps({"event": "course_creation_failed", "data": CoursePublic.from_orm(course_to_fail).model_dump_json()})
            )


def get_courses_by_user(db: Session, user_id: UUID) -> List[Course]:
    """Retrieves all courses belonging to a specific user."""
    return db.query(Course).filter(Course.user_id == user_id).order_by(Course.created_at.desc()).all()


def get_course_details_by_id(db: Session, course_id: UUID, user_id: UUID) -> Course:
    """Retrieves a single course with all its details, ensuring user ownership."""
    from sqlalchemy.orm import selectinload
    from belajaryuk_api.services.redis_service import redis_service
    from belajaryuk_api.schemas.course_schema import CourseDetail # Import schema
    import json

    # Check Redis cache first
    cached_course_json = redis_service.get_course_detail(course_id, user_id)
    if cached_course_json:
        # If cache hit, we still need the ORM object for the function's return type contract.
        # The cache is primarily for the API response layer, but here we ensure consistency.
        # A more advanced implementation might refactor this to avoid hitting DB on cache hit.
        return (
            db.query(Course)
            .options(
                selectinload(Course.modules).selectinload(Module.sub_topics),
                selectinload(Course.assessments)
            )
            .filter(Course.id == course_id, Course.user_id == user_id)
            .first()
        )

    # Cache miss - fetch from database
    course = (
        db.query(Course)
        .options(
            selectinload(Course.modules).selectinload(Module.sub_topics),
            selectinload(Course.assessments)
        )
        .filter(Course.id == course_id, Course.user_id == user_id)
        .first()
    )

    if course:
        # Create a Pydantic model from the ORM object
        course_detail_schema = CourseDetail.from_orm(course)
        # Convert the Pydantic model to a JSON string for caching
        course_json = course_detail_schema.model_dump_json()
        # Cache the full, correct JSON data
        redis_service.set_course_detail(course_id, user_id, course_json)

    return course

def get_course_by_id_and_user(db: Session, course_id: UUID, user_id: UUID) -> Course:
    return db.query(Course).filter(Course.id == course_id, Course.user_id == user_id).first()

def update_course_status(db: Session, course: Course, new_status: str):
    course.status = new_status
    db.add(course)
    # The calling function is responsible for the commit.


def get_sub_topics_for_course(db: Session, course_id: UUID) -> List[SubTopic]:
    """Get all sub-topics for a course in correct order."""
    return (
        db.query(SubTopic)
        .join(Module)
        .filter(Module.course_id == course_id)
        .order_by(Module.module_order, SubTopic.sub_topic_order)
        .all()
    )


def get_course_by_id(db: Session, course_id: UUID) -> Optional[Course]:
    """Get course by ID."""
    return db.query(Course).filter(Course.id == course_id).first()


def get_module_by_id(db: Session, module_id: UUID) -> Optional[Module]:
    """Get module by ID."""
    return db.query(Module).filter(Module.id == module_id).first()


def get_summary_from_previous_sub_topic(db: Session, current_sub_topic: SubTopic) -> Optional[Dict[str, Any]]:
    """Get summary from previous sub-topic in the same module."""
    if current_sub_topic.sub_topic_order <= 1:
        return None

    result = (
        db.query(SubTopic.summary_for_next_topic)
        .filter(
            SubTopic.module_id == current_sub_topic.module_id,
            SubTopic.sub_topic_order == current_sub_topic.sub_topic_order - 1
        )
        .first()
    )
    return result[0] if result else None


def get_next_sub_topic_title(db: Session, current_sub_topic: SubTopic) -> Optional[str]:
    """Get title of next sub-topic in the same module."""
    result = (
        db.query(SubTopic.title)
        .filter(
            SubTopic.module_id == current_sub_topic.module_id,
            SubTopic.sub_topic_order == current_sub_topic.sub_topic_order + 1
        )
        .first()
    )
    return result[0] if result else None


def update_sub_topic_with_generated_content(
    db: Session, 
    sub_topic: SubTopic, 
    generated_content: Dict[str, Any]
) -> SubTopic:
    """Update sub-topic with generated content."""
    summary_for_next = generated_content.get("intelligent_summary_for_next_topic")
    
    sub_topic.content_blocks = generated_content
    sub_topic.summary_for_next_topic = summary_for_next
    sub_topic.status = "completed"
    
    db.add(sub_topic)


def update_course_status_by_id(db: Session, course_id: UUID, new_status: str) -> None:
    """Update course status by ID."""
    course = db.query(Course).filter(Course.id == course_id).first()
    if course:
        course.status = new_status
        db.add(course)
