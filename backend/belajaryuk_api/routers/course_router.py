# backend/belajaryuk_api/routers/course_router.py

import logging
from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from belajaryuk_api.db.session import get_db
from belajaryuk_api.models.user import User
from belajaryuk_api.core.security import get_current_active_user
from belajaryuk_api.schemas.course_schema import (
    CourseCreate, CoursePublic, CourseDetail, AssessmentPublic, SubTopicPublic
)
from belajaryuk_api.services import course_service, content_generation_service, cancellation_service
from belajaryuk_api.utils.input_validator import validate_course_creation_input, InputValidationError

# Setup logger
logger = logging.getLogger(__name__)

router = APIRouter()

@router.post(
    "/", 
    response_model=CoursePublic, 
    status_code=status.HTTP_201_CREATED,
    summary="Create a new course",
    description="Triggers the full AI-driven course generation workflow."
)
def create_course(
    course_create_data: CourseCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_active_user)
):
    """
    Create a new course for the currently authenticated user.
    
    This endpoint initiates a complex, multi-step process:
    1.  Validates the user's topic with the Gatekeeper AI.
    2.  Generates a full curriculum blueprint with the Architect AI.
    3.  Saves the entire course structure to the database.
    """
    # Step 1: Validate input
    try:
        validate_course_creation_input(course_create_data)
    except InputValidationError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))

    # Step 2: Create an initial course entry immediately
    new_course = course_service.create_initial_course(db, current_user, course_create_data)

    # Step 3: Generate course content synchronously
    course_service.generate_and_populate_course(db, new_course.id, course_create_data)

    # Step 4: Return the course data to the user
    return new_course

@router.get("/", response_model=List[CoursePublic], summary="Get user's courses")
def read_courses(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_active_user)
):
    """Retrieve all courses created by the currently authenticated user."""
    return course_service.get_courses_by_user(db=db, user_id=current_user.id)

@router.get("/{course_id}", response_model=CourseDetail, summary="Get a single course by its ID")
def read_course(
    course_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Retrieve a single course by its ID, ensuring it belongs to the current user."""
    course = course_service.get_course_details_by_id(db=db, course_id=course_id, user_id=current_user.id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found or access denied")
    return course

@router.post(
    "/{course_id}/generate-content",
    status_code=status.HTTP_202_ACCEPTED,
    summary="Trigger content generation for a course"
)
def trigger_course_content_generation(
    course_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Trigger content generation for a specific course."""
    # Verifikasi bahwa kursus ada dan dimiliki oleh pengguna saat ini
    course = course_service.get_course_by_id_and_user(db=db, course_id=course_id, user_id=current_user.id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found or not owned by user")

    # Perbarui status kursus untuk memberikan umpan balik instan
    course_service.update_course_status(db=db, course=course, new_status="generating_content")
    db.commit()
    db.refresh(course)
    
    logger.info(f"Content generation triggered for course '{course.id}'. Status updated to 'generating_content'.")

    # Generate content synchronously
    content_generation_service.orchestrate_content_generation(db=db, course_id=str(course_id))
    
    return {"message": "Content generation process started successfully."}

@router.post("/{course_id}/cancel-generation", status_code=status.HTTP_200_OK)
def cancel_content_generation(course_id: UUID, db: Session = Depends(get_db)):
    """
    Endpoint to request cancellation of a running content generation task.
    """
    logger.info(f"Cancellation requested for course generation: {course_id}")
    
    # Check if the course is currently in 'generating_content' status
    course = course_service.get_course_by_id(db, str(course_id))
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    if course.status != 'generating_content':
        return {"message": "Course is not currently generating content. No action taken."}

    cancellation_service.cancel(str(course_id))
    
    return {"message": "Cancellation signal sent. The process will stop shortly."}
