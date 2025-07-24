# backend/belajaryuk_api/services/course_service.py

from sqlalchemy.orm import Session
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

def create_new_course(db: Session, user: User, course_create_data: CourseCreate) -> Course:
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
        # Create the main course entry
        new_course = Course(
            user_id=user.id,
            title=blueprint.get("course_title", "Untitled Course"),
            description=blueprint.get("course_description", ""),
            status='generating',  # Initial status
            full_blueprint=blueprint # Store the raw JSON from the AI
        )
        db.add(new_course)
        db.flush() # Flush to get the new_course.id for foreign keys

        # Iterate through the blueprint to create modules, sub-topics, and assessments
        for module_order, module_data in enumerate(blueprint.get("modules", [])):
            new_module = Module(
                course_id=new_course.id,
                title=module_data.get("module_title", "Untitled Module"),
                module_order=module_order + 1
            )
            db.add(new_module)
            db.flush() # Flush to get new_module.id

            for sub_topic_order, sub_topic_data in enumerate(module_data.get("sub_topics", [])):
                new_sub_topic = SubTopic(
                    module_id=new_module.id,
                    title=sub_topic_data.get("sub_topic_title", "Untitled Sub-Topic"),
                    sub_topic_order=sub_topic_order + 1,
                    content_markdown=None, # To be filled by another agent
                    status='pending'
                )
                db.add(new_sub_topic)

            # Create assessment point for the module
            assessment_data = module_data.get("assessment_point")
            if assessment_data:
                new_assessment = Assessment(
                    course_id=new_course.id,
                    module_id=new_module.id, # Linked to the module
                    title=assessment_data.get("title", "Module Quiz"),
                    type=assessment_data.get("type", "quiz"),
                    questions_json=None, # To be filled by another agent
                    status='pending'
                )
                db.add(new_assessment)

        # Create final assessment for the course
        final_assessment_data = blueprint.get("final_assessment")
        if final_assessment_data:
            final_assessment = Assessment(
                course_id=new_course.id,
                module_id=None, # Not linked to a specific module
                title=final_assessment_data.get("title", "Final Exam"),
                type=final_assessment_data.get("type", "final_exam"),
                questions_json=None,
                status='pending'
            )
            db.add(final_assessment)

        db.commit()
        db.refresh(new_course)
        return new_course

    except Exception as e:
        db.rollback()
        print(f"Database transaction failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save the course to the database after generation."
        )


def get_courses_by_user(db: Session, user_id: UUID) -> List[Course]:
    """Retrieves all courses belonging to a specific user."""
    return db.query(Course).filter(Course.user_id == user_id).order_by(Course.created_at.desc()).all()


def get_course_details_by_id(db: Session, course_id: UUID, user_id: UUID) -> Course:
    """Retrieves a single course with all its details, ensuring user ownership."""
    return (
        db.query(Course)
        .filter(Course.id == course_id, Course.user_id == user_id)
        .first()
    )
