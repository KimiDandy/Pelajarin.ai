import threading
from typing import Dict

# This dictionary will hold cancellation events for each running course generation task.
# The key is the course_id (str), and the value is a threading.Event object.
_cancellation_tokens: Dict[str, threading.Event] = {}
_lock = threading.Lock()

def create_cancellation_token(course_id: str):
    """Creates a new cancellation token for a given course ID."""
    with _lock:
        _cancellation_tokens[course_id] = threading.Event()

def cancel(course_id: str):
    """Sets the cancellation flag for a given course ID."""
    with _lock:
        if course_id in _cancellation_tokens:
            _cancellation_tokens[course_id].set() # Set the event to 'cancelled'

def is_cancelled(course_id: str) -> bool:
    """Checks if a cancellation has been requested for a given course ID."""
    with _lock:
        token = _cancellation_tokens.get(course_id)
        return token.is_set() if token else False

def remove_cancellation_token(course_id: str):
    """Removes the cancellation token once the task is complete or cancelled."""
    with _lock:
        if course_id in _cancellation_tokens:
            del _cancellation_tokens[course_id]
