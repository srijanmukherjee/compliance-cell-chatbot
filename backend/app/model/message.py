
from datetime import datetime
from enum import Enum
from typing import Optional
from app.core.firestore_repository import FirestoreRepository, collection

class MessageState(str, Enum):
    REPLIED = "replied"
    INTENT_NOT_FOUND = "intent_not_found"
    BELOW_THRESHOLD = "below_threshold"

@collection("message_logs")
class MessageRepository(FirestoreRepository):
    uid: str
    text: str
    created_on: datetime
    tag: str
    probability: float
    response: Optional[str]
    state: MessageState
    threshold: float