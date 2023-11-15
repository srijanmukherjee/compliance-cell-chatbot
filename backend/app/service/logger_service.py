from datetime import datetime, timezone
from typing import Optional

from loguru import logger
from app.model.message import MessageRepository, MessageState


class LoggerService:
    def __init__(self):
        pass

    def log_chat(self, text: str, uid: str, tag: str, probability: float, response: Optional[str], state: MessageState, threshold: float):
        message_log = MessageRepository(
            text = text,
            uid = uid,
            created_on = datetime.now(timezone.utc),
            tag = tag,
            probability = probability,
            response = response,
            state = state,
            threshold = threshold
        )
        try:
            message_log.save()
        except Exception as e:
            # TODO catch more detailed exception
            logger.error(f"Failed to save chat message log: {e}")