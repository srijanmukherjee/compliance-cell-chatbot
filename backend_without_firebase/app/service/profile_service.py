from fastapi import Depends
from sqlalchemy.orm import Session

from app import schemas
from app.db import models
from app.dependencies import get_db


class ProfileService:
    def __init__(self, db: Session = Depends(get_db)):
        self._db = db

    def fetch_one(self, uid: str):
        return (
            self._db.query(models.Profile)
            .where(models.Profile.uid == uid)
            .one_or_none()
        )

    def create(self, profile: schemas.Profile):
        db_profile = models.Profile(
            uid=profile.uid,
            first_name=profile.first_name,
            last_name=profile.last_name,
            semester=profile.semester,
            branch=profile.branch,
        )

        self._db.add(db_profile)
        self._db.commit()

        return db_profile
