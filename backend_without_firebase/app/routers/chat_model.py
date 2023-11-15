from http import HTTPStatus

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import schemas
from app.dependencies import get_db
from app.service.model_service import ModelService

router = APIRouter(prefix="/model", tags=["model"])


def get_model_service(db: Session = Depends(get_db)):
    return ModelService(db=db)


@router.post("/train", response_model=schemas.ChatModel)
async def train_model(model_service: ModelService = Depends(get_model_service)):
    state, chat_model = model_service.train_model()

    if state == "training":
        raise HTTPException(HTTPStatus.BAD_REQUEST, "A training is already underway")

    if chat_model is None:
        raise HTTPException(
            HTTPStatus.INTERNAL_SERVER_ERROR, "Chat model couldn't be created"
        )

    return chat_model
