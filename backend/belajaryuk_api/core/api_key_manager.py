# backend/belajaryuk_api/core/api_key_manager.py

import threading
from collections import deque
from typing import List, Optional

from .config import settings

class ApiKeyManager:
    """
    A thread-safe manager for rotating through a list of API keys.

    This manager uses a deque (a thread-safe double-ended queue) to handle
    a list of API keys. When a key is reported as failed (e.g., due to rate
    limits), it is moved to the back of the queue, and the next available
    key is provided.
    """
    _instance = None
    _lock = threading.Lock()

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            with cls._lock:
                if not cls._instance:
                    cls._instance = super(ApiKeyManager, cls).__new__(cls)
        return cls._instance

    def __init__(self, api_keys: Optional[List[str]] = None):
        if not hasattr(self, '_initialized'):
            with self._lock:
                if not hasattr(self, '_initialized'):
                    if api_keys is None:
                        api_keys = [key.strip() for key in settings.GEMINI_API_KEYS.split(',') if key.strip()]
                    
                    if not api_keys:
                        raise ValueError("No Gemini API keys found in environment. Please set GEMINI_API_KEYS in your .env file.")

                    self.keys = deque(api_keys)
                    self._initialized = True

    def get_key(self) -> Optional[str]:
        """Returns the current active API key without rotating."""
        with self._lock:
            if not self.keys:
                return None
            return self.keys[0]

    def rotate_key(self):
        """
        Rotates the key deque. This is called when the current key fails.
        The failed key is moved to the back of the queue.
        """
        with self._lock:
            if self.keys:
                self.keys.rotate(-1) # Moves the front item to the back
                print(f"API key rotated. New active key ends with: '...{self.get_key()[-4:]}'")

# Create a single, shared instance of the manager
api_key_manager = ApiKeyManager()
