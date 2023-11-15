from pydantic import BaseModel, PrivateAttr


class ChatMessage(BaseModel):
    text: str
    token: str
    _uid: str = PrivateAttr(default=None)