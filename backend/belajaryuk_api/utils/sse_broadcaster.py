import asyncio
import logging
from collections import defaultdict
from typing import Dict, List

logger = logging.getLogger(__name__)

class SSEBroadcaster:
    def __init__(self):
        # Queues to hold messages for each channel (course_id)
        self._channels: Dict[str, List[asyncio.Queue]] = defaultdict(list)

    async def subscribe(self, channel: str) -> asyncio.Queue:
        """Subscribes a client to a specific channel and returns a queue for messages."""
        queue = asyncio.Queue()
        self._channels[channel].append(queue)
        logger.info(f"Client subscribed to SSE channel: {channel}")
        return queue

    def unsubscribe(self, channel: str, queue: asyncio.Queue):
        """Removes a client's queue from a channel."""
        if queue in self._channels.get(channel, []):
            self._channels[channel].remove(queue)
            logger.info(f"Client unsubscribed from SSE channel: {channel}")
            if not self._channels[channel]:
                del self._channels[channel]

    async def publish(self, channel: str, message: str):
        """Publishes a message to all subscribers of a channel."""
        if channel in self._channels:
            logger.info(f"Publishing to SSE channel '{channel}': {message}")
            for queue in self._channels[channel]:
                await queue.put(message)

# Singleton instance of the broadcaster
broadcaster = SSEBroadcaster()
