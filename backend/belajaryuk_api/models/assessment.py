import uuid
from sqlalchemy import Column, String, text, TIMESTAMP, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship

from belajaryuk_api.db.base import Base

class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    course_id = Column(UUID(as_uuid=True), ForeignKey('courses.id'), nullable=False)
    module_id = Column(UUID(as_uuid=True), ForeignKey('modules.id'), nullable=True)
    title = Column(String(255), nullable=False)
    type = Column(String(50), nullable=False)
    questions_json = Column(JSONB, nullable=True)
    status = Column(String(50), nullable=False, default='pending')
    created_at = Column(TIMESTAMP(timezone=True), server_default=text('now()'), nullable=False)
    updated_at = Column(TIMESTAMP(timezone=True), server_default=text('now()'), onupdate=text('now()'))

    course = relationship("Course", back_populates="assessments")
    module = relationship("Module", back_populates="assessments")
