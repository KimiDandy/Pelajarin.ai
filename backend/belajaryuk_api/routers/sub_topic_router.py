# backend/belajaryuk_api/routers/sub_topic_router.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

from belajaryuk_api.db.session import get_db
from belajaryuk_api.models.user import User
from belajaryuk_api.models.sub_topic import SubTopic
from belajaryuk_api.models.module import Module
from belajaryuk_api.models.course import Course
from belajaryuk_api.core.security import get_current_active_user
from belajaryuk_api.schemas.sub_topic_schema import SubTopicDetail

router = APIRouter()

@router.get(
    "/{sub_topic_id}", 
    response_model=SubTopicDetail, 
    summary="Get Sub-Topic Details"
)
def get_sub_topic_details(
    sub_topic_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Retrieve the full details of a specific sub-topic, including its rich content.
    Ensures the user has access to the course this sub-topic belongs to.
    """
    sub_topic = (
        db.query(SubTopic)
        .join(Module, SubTopic.module_id == Module.id)
        .join(Course, Module.course_id == Course.id)
        .filter(SubTopic.id == sub_topic_id, Course.user_id == current_user.id)
        .first()
    )

    if not sub_topic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sub-topic not found or you do not have permission to access it."
        )

    return sub_topic
