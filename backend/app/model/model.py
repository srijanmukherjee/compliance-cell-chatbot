from datetime import datetime
from enum import Enum
from typing import Optional

from app.core.firestore_repository import FirestoreRepository, collection, document


class ChatbotModelStatus(str, Enum):
    INIT = "init"
    TRAINED = "trained"
    TRAINING = "training"
    ERROR = "error"

@collection("chatbot")
@document("model")
class ChatbotModelRepository(FirestoreRepository):
    buildLog: str
    storageLocation: Optional[str]
    trainedOn: datetime
    status: ChatbotModelStatus