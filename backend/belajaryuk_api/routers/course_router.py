# backend/belajaryuk_api/routers/course_router.py

from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from belajaryuk_api.db.session import get_db
from belajaryuk_api.models.user import User
from belajaryuk_api.core.security import get_current_active_user
from belajaryuk_api.schemas.course_schema import CourseCreate, CoursePublic, CourseDetail
from belajaryuk_api.services import course_service

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
    return course_service.create_new_course(db=db, user=current_user, course_create_data=course_in)


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


@router.get("/{course_id}", response_model=CourseDetail, summary="Get a single course by ID")
def read_course(
    *, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    course_id: UUID
):
    """
    Retrieve the full details of a single course, including its modules, 
    sub-topics, and assessments.
    
    Ensures that the user can only access their own courses.
    """
    # This function will be created in course_service.py
    course = course_service.get_course_details_by_id(db=db, course_id=course_id, user_id=current_user.id)
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found or you do not have permission to view it."
        )
    return course
