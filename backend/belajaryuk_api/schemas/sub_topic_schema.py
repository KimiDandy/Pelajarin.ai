# backend/belajaryuk_api/schemas/sub_topic_schema.py

from pydantic import BaseModel
from typing import Optional, Dict, Any
from uuid import UUID
import datetime

class SubTopicBase(BaseModel):
    title: str
    status: str
    sub_topic_order: int

class SubTopicDetail(SubTopicBase):
    id: UUID
    module_id: UUID
    content_blocks: Optional[Dict[str, Any]] = None
    summary_for_next_topic: Optional[Dict[str, Any]] = None
    created_at: datetime.datetime
    updated_at: datetime.datetime

    class Config:
        from_attributes = True
