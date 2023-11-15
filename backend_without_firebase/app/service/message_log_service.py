from datetime import datetime, timedelta
from typing import Optional

from fastapi import Depends
from sqlalchemy import between, desc
from sqlalchemy.orm import Session

from app import schemas
from app.core.util import with_pagination
from app.db import models
from app.dependencies import get_db


class MessageLogService:
    DEFAULT_PAGE_SIZE = 10
    MIN_PAGE_SIZE = 1
    MAX_PAGE_SIZE = 100

    def __init__(self, db: Session = Depends(get_db)):
        self._db = db

    def fetch_all(self, page: Optional[int], page_size: Optional[int]):
        return with_pagination(
            self._db.query(models.MessageLog).order_by(
                desc(models.MessageLog.created_on)
            ),
            page,
            page_size,
            min_page_size=MessageLogService.MIN_PAGE_SIZE,
            max_page_size=MessageLogService.MAX_PAGE_SIZE,
            default_page_size=MessageLogService.DEFAULT_PAGE_SIZE,
        )

    def create(self, message_log: schemas.MessageLog):
        db_message_log = models.MessageLog(**message_log.model_dump())
        self._db.add(db_message_log)
        self._db.commit()
        self._db.refresh(db_message_log)
        return db_message_log

    def get_recent_messages_count(self):
        current_time = datetime.utcnow()
        return (
            self._db.query(models.MessageLog)
            .where(
                between(
                    models.MessageLog.created_on,
                    current_time - timedelta(minutes=1),
                    current_time,
                )
            )
            .count()
        )
