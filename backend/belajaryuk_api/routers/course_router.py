# backend/belajaryuk_api/routers/course_router.py

import asyncio
import logging
from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks, Request
from fastapi.responses import StreamingResponse
from belajaryuk_api.utils.sse_broadcaster import broadcaster
from sqlalchemy.orm import Session

from belajaryuk_api.db.session import get_db
from belajaryuk_api.services.content_generation_service import orchestrate_content_generation
from belajaryuk_api.services.cancellation_service import cancel
from belajaryuk_api.models.user import User
from belajaryuk_api.core.security import get_current_active_user
from belajaryuk_api.schemas.course_schema import (
    CourseCreate, CoursePublic, CourseDetail, AssessmentPublic, SubTopicPublic
)
from belajaryuk_api.services import course_service, content_generation_service, cancellation_service
from belajaryuk_api.utils.input_validator import validate_course_creation_input, InputValidationError
import json

# Setup logger
logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/courses/{course_id}/progress-stream")
async def progress_stream(request: Request, course_id: UUID):
    async def event_generator():
        queue = await broadcaster.subscribe(str(course_id))
        try:
            while True:
                # Check if the client is still connected
                if await request.is_disconnected():
                    logger.info(f"Client disconnected from SSE stream for course {course_id}")
                    break
                
                message = await queue.get()
                yield f"data: {message}\n\n"
        finally:
            broadcaster.unsubscribe(str(course_id), queue)

    return StreamingResponse(event_generator(), media_type="text/event-stream")

@router.post(
    "/", 
    response_model=CoursePublic, 
    status_code=status.HTTP_201_CREATED,
    summary="Create a new course",
    description="Triggers the full AI-driven course generation workflow."
)
async def create_course(
    course_create_data: CourseCreate, 
    background_tasks: BackgroundTasks,
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
    new_course = await course_service.create_initial_course(db, current_user, course_create_data)

    # Step 3: Add the intensive AI generation task to the background
    async def run_generation_in_background():
        with next(get_db()) as db_session:
            await course_service.generate_and_populate_course(db_session, new_course.id, course_create_data)

    background_tasks.add_task(asyncio.run, run_generation_in_background())

    # Step 4: Return the initial course data to the user
    return new_course

# Note: The following endpoints will require new functions in course_service.py
# We will add them in the next step.

@router.get("/", response_model=List[CoursePublic], summary="Get user's courses")
async def read_courses(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_active_user)
):
    """Retrieve all courses created by the currently authenticated user."""
    # This function will be created in course_service.py
    return await course_service.get_courses_by_user(db=db, user_id=current_user.id)


@router.get("/{course_id}", response_model=CourseDetail, summary="Get a single course by its ID")
async def read_course(
    course_id: UUID, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_active_user)
):
    """Retrieve a complete course with all its modules, sub-topics, and assessments."""
    # 1. Fetch the raw ORM object with all its relationships
    course_orm = await course_service.get_course_details_by_id(
        db=db, course_id=course_id, user_id=current_user.id
    )
    if not course_orm:
        raise HTTPException(status_code=404, detail="Course not found")

    # Optimized response building using Pydantic model validation
    learning_outcomes = (course_orm.full_blueprint or {}).get('learning_outcomes', [])
    
    # Build response using optimized approach
    response_data = CourseDetail(
        id=course_orm.id,
        title=course_orm.title,
        description=course_orm.description,
        difficulty=course_orm.difficulty,
        status=course_orm.status,
        created_at=course_orm.created_at,
        user_id=course_orm.user_id,
        learning_outcomes=learning_outcomes,
        final_assessment=AssessmentPublic.model_validate(
            next((a for a in course_orm.assessments if a.module_id is None), None), 
            from_attributes=True
        ) if any(a.module_id is None for a in course_orm.assessments) else None,
        modules=[
            {
                'id': module_orm.id,
                'title': module_orm.title,
                'module_order': module_orm.module_order,
                'sub_topics': [
                    SubTopicPublic.model_validate(st, from_attributes=True)
                    for st in sorted(module_orm.sub_topics, key=lambda s: s.sub_topic_order)
                ],
                'assessment': AssessmentPublic.model_validate(
                    next((a for a in course_orm.assessments if a.module_id == module_orm.id), None),
                    from_attributes=True
                ) if any(a.module_id == module_orm.id for a in course_orm.assessments) else None
            }
            for module_orm in sorted(course_orm.modules, key=lambda m: m.module_order)
        ]
    )

    # 4. Validate the pure dictionary. This should now pass without errors.
    return CourseDetail.model_validate(response_data)


@router.post(
    "/{course_id}/generate-content",
    status_code=status.HTTP_202_ACCEPTED,
    summary="Trigger content generation for a course"
)
async def trigger_course_content_generation(
    course_id: UUID,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Verifikasi bahwa kursus ada dan dimiliki oleh pengguna saat ini
    course = await course_service.get_course_by_id_and_user(db=db, course_id=course_id, user_id=current_user.id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found or not owned by user")

    # Perbarui status kursus untuk memberikan umpan balik instan
    course_service.update_course_status(db=db, course=course, new_status="generating_content")
    db.commit()
    db.refresh(course)
    
    logger.info(f"Content generation triggered for course '{course.id}'. Status updated to 'generating_content'.")

    # Tambahkan tugas generasi konten ke latar belakang
    async def run_orchestration_in_background():
        # Create a new session for the background task
        with next(get_db()) as db_session:
            await content_generation_service.orchestrate_content_generation(db=db_session, course_id=str(course_id))

    background_tasks.add_task(asyncio.run, run_orchestration_in_background())
    
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
