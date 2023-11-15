import enum

from sqlalchemy import Column, DateTime, Enum, Float, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.session import Base


class Intent(Base):
    __tablename__ = "intent"

    id = Column(Integer, primary_key=True, autoincrement=True)
    tag = Column(String, index=True)
    patterns = Column(ARRAY(String))
    responses = Column(ARRAY(String))


class MessageState(str, enum.Enum):
    REPLIED = "replied"
    INTENT_NOT_FOUND = "intent_not_found"
    BELOW_THRESHOLD = "below_threshold"


class MessageLog(Base):
    __tablename__ = "message_log"

    id = Column(Integer, primary_key=True, autoincrement=True)
    uid = Column(String, index=True)
    text = Column(String)
    tag = Column(String)
    probability = Column(Float)
    response = Column(String, nullable=True)
    state = Column(Enum(MessageState))
    threshold = Column(Float)

    created_on = Column(DateTime(timezone=True), server_default=func.now())


class ChatModelStatus(str, enum.Enum):
    INIT = "init"
    TRAINED = "trained"
    TRAINING = "training"
    ERROR = "error"


class ChatModel(Base):
    __tablename__ = "chat_model"

    id = Column(Integer, primary_key=True, autoincrement=True)
    location = Column(String, nullable=True)
    build_log = Column(String, nullable=True)
    state = Column(Enum(ChatModelStatus), default=ChatModelStatus.INIT)
    created_on = Column(DateTime(timezone=True), server_default=func.now())
    updated_on = Column(DateTime(timezone=True), onupdate=func.now())


class Profile(Base):
    __tablename__ = "profile"

    id = Column(Integer, primary_key=True, autoincrement=True)
    uid = Column(String, index=True, unique=True)
    first_name = Column(String)
    last_name = Column(String)
    semester = Column(Integer)
    branch = Column(String)
