# backend/belajaryuk_api/routers/course_router.py

from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session

from belajaryuk_api.db.session import get_db
from belajaryuk_api.models.user import User
from belajaryuk_api.core.security import get_current_active_user
from belajaryuk_api.schemas.course_schema import (
    CourseCreate, CoursePublic, CourseDetail, AssessmentPublic, SubTopicPublic
)
from belajaryuk_api.services import course_service
import json

router = APIRouter()

@router.post(
    "/", 
    response_model=CoursePublic, 
    status_code=status.HTTP_201_CREATED,
    summary="Create a new course",
    description="Triggers the full AI-driven course generation workflow."
)
def create_course(
    *, 
    db: Session = Depends(get_db),
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_active_user),
    course_in: CourseCreate
):
    """
    Create a new course for the currently authenticated user.
    
    This endpoint initiates a complex, multi-step process:
    1.  Validates the user's topic with the Gatekeeper AI.
    2.  Generates a full curriculum blueprint with the Architect AI.
    3.  Saves the entire course structure to the database.
    """
    # Create a placeholder course immediately and get its ID
    initial_course = course_service.create_initial_course(
        db=db, user=current_user, course_create_data=course_in
    )

    # Schedule the long-running AI task to run in the background
    background_tasks.add_task(
        course_service.generate_and_populate_course,
        db=db,
        course_id=initial_course.id,
        course_create_data=course_in
    )

    # Return the initial course data immediately to the user
    return initial_course


# Note: The following endpoints will require new functions in course_service.py
# We will add them in the next step.

@router.get("/", response_model=List[CoursePublic], summary="Get user's courses")
def read_courses(
    *, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Retrieve all courses created by the currently authenticated user."""
    # This function will be created in course_service.py
    return course_service.get_courses_by_user(db=db, user_id=current_user.id)


@router.get("/{course_id}", response_model=CourseDetail, summary="Get a single course by its ID")
def read_course(
    *, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    course_id: UUID
):
    """Retrieve a complete course with all its modules, sub-topics, and assessments."""
    # 1. Fetch the raw ORM object with all its relationships
    course_orm = course_service.get_course_details_by_id(
        db=db, course_id=course_id, user_id=current_user.id
    )
    if not course_orm:
        raise HTTPException(status_code=404, detail="Course not found")

    # 2. Manually and explicitly build the response dictionary from ORM objects.
    # This is the most robust way to avoid validation errors.

    # Extract learning outcomes from the JSONB field
    learning_outcomes = (course_orm.full_blueprint or {}).get('learning_outcomes', [])

    # Find and convert the final assessment
    final_assessment_orm = next((a for a in course_orm.assessments if a.module_id is None), None)
    final_assessment_data = AssessmentPublic.model_validate(final_assessment_orm, from_attributes=True) if final_assessment_orm else None

    # Build the module list with deep conversion
    modules_data = []
    for module_orm in sorted(course_orm.modules, key=lambda m: m.module_order):
        # Find and convert the assessment for this module
        module_assessment_orm = next((a for a in course_orm.assessments if a.module_id == module_orm.id), None)
        module_assessment_data = AssessmentPublic.model_validate(module_assessment_orm, from_attributes=True) if module_assessment_orm else None

        # Convert sub-topics for this module
        sub_topics_data = [
            SubTopicPublic.model_validate(st, from_attributes=True) 
            for st in sorted(module_orm.sub_topics, key=lambda s: s.sub_topic_order)
        ]

        # Assemble the dictionary for the module
        modules_data.append({
            'id': module_orm.id,
            'title': module_orm.title,
            'module_order': module_orm.module_order,
            'sub_topics': sub_topics_data,
            'assessment': module_assessment_data
        })

    # 3. Assemble the final dictionary for the entire course
    response_data = {
        'id': course_orm.id,
        'title': course_orm.title,
        'description': course_orm.description,
        'status': course_orm.status,
        'created_at': course_orm.created_at,
        'user_id': course_orm.user_id,
        'learning_outcomes': learning_outcomes,
        'final_assessment': final_assessment_data,
        'modules': modules_data
    }

    # 4. Validate the pure dictionary. This should now pass without errors.
    return CourseDetail.model_validate(response_data)
