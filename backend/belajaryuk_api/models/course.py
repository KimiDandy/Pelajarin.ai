import uuid
from sqlalchemy import Column, String, text, TIMESTAMP, ForeignKey, Text, Enum as SQLAlchemyEnum
from belajaryuk_api.schemas.course_schema import DifficultyLevel
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship

from belajaryuk_api.db.base import Base

class Course(Base):
    __tablename__ = "courses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    difficulty = Column(SQLAlchemyEnum(DifficultyLevel), nullable=False)
    status = Column(String(50), nullable=False, default='generating')
    full_blueprint = Column(JSONB, nullable=True)
    learning_outcomes = Column(JSONB, nullable=True)  # Store as JSON array
    created_at = Column(TIMESTAMP(timezone=True), server_default=text('now()'), nullable=False)
    updated_at = Column(TIMESTAMP(timezone=True), server_default=text('now()'), onupdate=text('now()'))

    owner = relationship("User", back_populates="courses")
    modules = relationship("Module", back_populates="course", cascade="all, delete-orphan")
    assessments = relationship("Assessment", back_populates="course", cascade="all, delete-orphan")
