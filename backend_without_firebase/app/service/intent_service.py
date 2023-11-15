from typing import Optional

from fastapi import Depends
from sqlalchemy import update
from sqlalchemy.orm import Session

from app import schemas
from app.core.util import with_pagination
from app.db import models
from app.dependencies import get_db


class IntentService:
    DEFAULT_PAGE_SIZE = 10
    MIN_PAGE_SIZE = 1
    MAX_PAGE_SIZE = 50

    def __init__(self, db: Session = Depends(get_db)):
        self._db = db

    def fetch_all(self, page: Optional[int], page_size: Optional[int]):
        return with_pagination(
            self._db.query(models.Intent),
            page,
            page_size,
            min_page_size=IntentService.MIN_PAGE_SIZE,
            max_page_size=IntentService.MAX_PAGE_SIZE,
            default_page_size=IntentService.DEFAULT_PAGE_SIZE,
        )

    def fetch_one(self, tag: str):
        return (
            self._db.query(models.Intent).where(models.Intent.tag == tag).one_or_none()
        )

    def create(self, intent: schemas.Intent):
        db_intent = models.Intent(
            tag=intent.tag, patterns=intent.patterns, responses=intent.responses
        )
        with self._db.begin():
            self._db.add(db_intent)
        return db_intent

    def update(self, id: int, intent: schemas.Intent):
        query = (
            update(models.Intent)
            .where(models.Intent.id == id)
            .values(
                tag=intent.tag, patterns=intent.patterns, responses=intent.responses
            )
            .returning(
                models.Intent.id,
                models.Intent.tag,
                models.Intent.patterns,
                models.Intent.responses,
            )
        )
        result = self._db.execute(query).one_or_none()
        if result:
            self._db.commit()
        return result

    def export(self):
        return self._db.query(models.Intent).all()
