from datetime import datetime
from typing import Generic, List, Optional, TypeVar

from pydantic import BaseModel, PrivateAttr

from app.db.models import ChatModelStatus, MessageState

T = TypeVar("T")


class ChatMessage(BaseModel):
    text: str
    token: str
    _uid: Optional[str] = PrivateAttr(default=None)


class Intent(BaseModel):
    id: Optional[int] = None
    tag: str
    patterns: List[str]
    responses: List[str]

    class Config:
        from_attributes = True
        populate_by_name = True


class Profile(BaseModel):
    uid: str
    first_name: str
    last_name: str
    semester: int
    branch: str

    class config:
        from_attributes = True
        populate_by_name = True


class MessageLog(BaseModel):
    uid: str
    text: str
    probability: float
    response: Optional[str]
    state: MessageState
    tag: str
    threshold: float
    created_on: datetime

    _intent_id: Optional[int] = PrivateAttr()

    class config:
        from_attributes = True
        populate_by_name = True


class ChatModel(BaseModel):
    id: int
    location: Optional[str]
    build_log: Optional[str]
    state: ChatModelStatus
    created_on: datetime
    updated_on: Optional[datetime]

    class config:
        from_attributes = True
        populate_by_name = True


class PaginatedResult(BaseModel, Generic[T]):
    total_pages: int
    page_size: int
    page: int
    result: List[T]
