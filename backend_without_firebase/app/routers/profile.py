from http import HTTPStatus

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError

from app import schemas
from app.service.profile_service import ProfileService

router = APIRouter(prefix="/profile", tags=["profile", "account"])


@router.get("/{uid}", response_model=schemas.Profile)
async def fetch_profile(
    uid: str, profile_service: ProfileService = Depends(ProfileService)
):
    profile = profile_service.fetch_one(uid)
    if profile is None:
        raise HTTPException(HTTPStatus.NOT_FOUND, "profile doesn't exist")
    return profile


@router.post("/", response_model=schemas.Profile)
async def create_profile(
    profile: schemas.Profile, profile_service: ProfileService = Depends(ProfileService)
):
    try:
        return profile_service.create(profile)
    except IntegrityError:
        raise HTTPException(HTTPStatus.CONFLICT, "Profile already exists")
