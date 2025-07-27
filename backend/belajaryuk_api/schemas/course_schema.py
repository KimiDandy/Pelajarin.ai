# backend/belajaryuk_api/schemas/course_schema.py

from pydantic import BaseModel, Field, UUID4
from typing import List, Optional
from uuid import UUID
from datetime import datetime
from enum import Enum

# ====================================================================
#  ENUMS
# ====================================================================
class DifficultyLevel(str, Enum):
    pemula = "pemula"
    menengah = "menengah"
    mahir = "mahir"

# ====================================================================
#  SCHEMAS FOR USER INPUT (CREATE)
# ====================================================================

class CourseCreate(BaseModel):
    """Schema for validating user input when creating a new course."""
    topic: str = Field(..., min_length=3, max_length=150, example="Pengenalan FastAPI untuk Backend")
    difficulty: DifficultyLevel = Field(..., example=DifficultyLevel.pemula)
    goal: str = Field(..., max_length=500, example="Membangun REST API sederhana dengan Python")


# ====================================================================
#  SCHEMAS FOR API OUTPUT (READ)
# ====================================================================

# These schemas control what data is sent back to the client.
# They are configured to work with SQLAlchemy models (orm_mode=True).

class SubTopicPublic(BaseModel):
    id: UUID
    title: str
    sub_topic_order: int
    status: str

    class Config:
        orm_mode = True

class SubTopicPublicForStream(BaseModel):
    id: UUID
    title: str
    status: str
    module_id: UUID

    class Config:
        orm_mode = True

class AssessmentPublic(BaseModel):
    id: UUID
    title: str
    type: str
    status: str
    module_id: Optional[UUID] # To distinguish module quizzes from the final exam

    class Config:
        orm_mode = True

class ModulePublic(BaseModel):
    id: UUID
    title: str
    module_order: int
    sub_topics: List[SubTopicPublic]
    assessment: Optional[AssessmentPublic]

    class Config:
        orm_mode = True

class CoursePublic(BaseModel):
    """Basic representation of a course, used for lists."""
    id: UUID
    title: str
    description: str
    difficulty: DifficultyLevel
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}

class CourseDetail(CoursePublic):
    """Comprehensive representation of a single course with all its contents."""
    modules: List[ModulePublic]
    learning_outcomes: List[str] = []
    final_assessment: Optional[AssessmentPublic] = None

    model_config = {"from_attributes": True}
