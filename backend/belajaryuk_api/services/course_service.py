# backend/belajaryuk_api/services/course_service.py

from sqlalchemy.orm import Session, joinedload, subqueryload
from typing import List
from uuid import UUID
from fastapi import HTTPException, status

from belajaryuk_api.models.user import User
from belajaryuk_api.models.course import Course
from belajaryuk_api.models.module import Module
from belajaryuk_api.models.sub_topic import SubTopic
from belajaryuk_api.models.assessment import Assessment
from belajaryuk_api.schemas.course_schema import CourseCreate
from belajaryuk_api.services import ai_service

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
        status='generating', # Set initial status
        full_blueprint={}
    )
    db.add(new_course)
    db.commit()
    db.refresh(new_course)
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
        # Re-raise the exception from the AI service to be caught by the router
        raise e

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

        # Finally, update the status to 'completed'
        course_to_populate.status = 'completed'
        
        db.commit()
        print(f"Successfully populated course ID: {course_id}")

    except Exception as e:
        db.rollback()
        db.rollback()
        # In a background task, we should log the error but not raise HTTPException
        # as it won't be caught by the client. We also update the course status to 'failed'.
        print(f"Background task failed for course ID {course_id}: {e}")
        course_to_fail = db.query(Course).filter(Course.id == course_id).first()
        if course_to_fail:
            course_to_fail.status = 'failed'
            course_to_fail.description = f"AI gagal membuat kurikulum: {e}"
            db.commit()


def get_courses_by_user(db: Session, user_id: UUID) -> List[Course]:
    """Retrieves all courses belonging to a specific user."""
    return db.query(Course).filter(Course.user_id == user_id).order_by(Course.created_at.desc()).all()


def get_course_details_by_id(db: Session, course_id: UUID, user_id: UUID) -> Course:
    """Retrieves a single course with all its details, ensuring user ownership."""
    from sqlalchemy.orm import selectinload
    
    return (
        db.query(Course)
        .options(
            # Use selectinload for better performance with PostgreSQL
            selectinload(Course.modules).selectinload(Module.sub_topics),
            selectinload(Course.assessments)
        )
        .filter(Course.id == course_id, Course.user_id == user_id)
        .first()
    )
