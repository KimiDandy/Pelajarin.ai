import uuid
from sqlalchemy import Column, String, text, TIMESTAMP, ForeignKey, Text, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from belajaryuk_api.db.base import Base

class SubTopic(Base):
    __tablename__ = "sub_topics"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    module_id = Column(UUID(as_uuid=True), ForeignKey('modules.id'), nullable=False)
    title = Column(String(255), nullable=False)
    content_markdown = Column(Text, nullable=True)
    status = Column(String(50), nullable=False, default='pending')
    sub_topic_order = Column(Integer, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=text('now()'), nullable=False)
    updated_at = Column(TIMESTAMP(timezone=True), server_default=text('now()'), onupdate=text('now()'))

    module = relationship("Module", back_populates="sub_topics")
