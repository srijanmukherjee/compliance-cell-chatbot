from pydantic import BaseModel


class ChatMessage(BaseModel):
    text: str
    uid: str