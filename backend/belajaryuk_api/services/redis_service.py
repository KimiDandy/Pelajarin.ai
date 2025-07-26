"""
Redis service for Pelajarin.ai - Enterprise caching layer
Handles course detail caching with smart invalidation
"""

import json
import redis
from typing import Optional, Any
from uuid import UUID
import os
from datetime import timedelta

class RedisService:
    def __init__(self):
        self.redis_client = redis.Redis(
            host=os.getenv('REDIS_HOST', 'localhost'),
            port=int(os.getenv('REDIS_PORT', 6379)),
            db=int(os.getenv('REDIS_DB', 0)),
            decode_responses=True,
            socket_keepalive=True,
            socket_keepalive_options={}
        )
        
    def get_course_detail(self, course_id: UUID, user_id: UUID) -> Optional[dict]:
        """Get cached course detail"""
        cache_key = f"course_detail:{user_id}:{course_id}"
        cached_data = self.redis_client.get(cache_key)
        
        if cached_data:
            return json.loads(cached_data)
        return None
    
    def set_course_detail(self, course_id: UUID, user_id: UUID, data: dict, ttl: int = 300) -> bool:
        """Cache course detail with TTL (default 5 minutes)"""
        cache_key = f"course_detail:{user_id}:{course_id}"
        try:
            self.redis_client.setex(
                cache_key, 
                timedelta(seconds=ttl), 
                json.dumps(data, default=str)
            )
            return True
        except Exception as e:
            print(f"Redis cache error: {e}")
            return False
    
    def invalidate_course_detail(self, course_id: UUID, user_id: UUID) -> bool:
        """Invalidate course detail cache"""
        cache_key = f"course_detail:{user_id}:{course_id}"
        try:
            self.redis_client.delete(cache_key)
            return True
        except Exception as e:
            print(f"Redis invalidate error: {e}")
            return False
    
    def invalidate_user_courses(self, user_id: UUID) -> bool:
        """Invalidate all user's course caches"""
        pattern = f"course_detail:{user_id}:*"
        try:
            keys = self.redis_client.keys(pattern)
            if keys:
                self.redis_client.delete(*keys)
            return True
        except Exception as e:
            print(f"Redis bulk invalidate error: {e}")
            return False
    
    def get_cache_stats(self) -> dict:
        """Get Redis cache statistics"""
        try:
            info = self.redis_client.info()
            return {
                'connected': self.redis_client.ping(),
                'used_memory': info.get('used_memory_human'),
                'keys_count': self.redis_client.dbsize(),
                'hit_rate': info.get('keyspace_hits', 0) / max(info.get('keyspace_hits', 0) + info.get('keyspace_misses', 1), 1)
            }
        except Exception as e:
            return {'connected': False, 'error': str(e)}

# Global instance
redis_service = RedisService()
