from datetime import datetime, timezone
from typing import Optional

from fastapi import Depends
from loguru import logger

from app import schemas
from app.db.models import MessageState
from app.schemas import MessageLog
from app.service.message_log_service import MessageLogService


class LoggerService:
    def __init__(
        self, message_log_service: MessageLogService = Depends(MessageLogService)
    ):
        self._message_log_service = message_log_service

    def log_chat(
        self,
        text: str,
        uid: str,
        tag: str,
        probability: float,
        response: Optional[str],
        state: MessageState,
        threshold: float,
    ):
        message_log = MessageLog(
            text=text,
            uid=uid,
            created_on=datetime.now(timezone.utc),
            probability=probability,
            response=response,
            state=state,
            threshold=threshold,
            tag=tag,
        )

        try:
            self._message_log_service.create(message_log)
        except Exception as e:
            # TODO catch more detailed exception
            logger.error(f"Failed to save chat message log: {e}")
