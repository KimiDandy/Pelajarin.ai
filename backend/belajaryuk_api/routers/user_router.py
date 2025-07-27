import logging
from fastapi import APIRouter, Depends, Request
from fastapi.responses import StreamingResponse

from belajaryuk_api.models.user import User
from belajaryuk_api.core.security import get_current_active_user
from belajaryuk_api.utils.sse_broadcaster import broadcaster

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/users/me/course-updates")
async def course_updates_stream(request: Request, current_user: User = Depends(get_current_active_user)):
    channel = f"user_{current_user.id}_courses"
    
    async def event_generator():
        queue = await broadcaster.subscribe(channel)
        try:
            while True:
                if await request.is_disconnected():
                    logger.info(f"Client disconnected from user course stream for user {current_user.id}")
                    break
                
                message = await queue.get()
                yield f"data: {message}\n\n"
        finally:
            broadcaster.unsubscribe(channel, queue)

    return StreamingResponse(event_generator(), media_type="text/event-stream")
