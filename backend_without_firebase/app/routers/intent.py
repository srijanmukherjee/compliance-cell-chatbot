from http import HTTPStatus
from typing import List

from fastapi import APIRouter, Depends, HTTPException, Response

from app.schemas import Intent, PaginatedResult
from app.service.intent_service import IntentService

router = APIRouter(prefix="/intents", tags=["intents"])


@router.get("/", response_model=PaginatedResult[Intent])
async def fetch_intents(
    page: int = 1,
    page_size: int = IntentService.DEFAULT_PAGE_SIZE,
    intent_service: IntentService = Depends(IntentService),
):
    return intent_service.fetch_all(page, page_size)


@router.post("/", response_model=Intent)
async def create_intent(
    intent: Intent, intent_service: IntentService = Depends(IntentService)
):
    return intent_service.create(intent)


@router.put("/{intent_id}", response_model=Intent)
async def update_intent(
    intent_id: int,
    intent: Intent,
    intent_service: IntentService = Depends(IntentService),
):
    db_intent = intent_service.update(intent_id, intent)
    if db_intent is None:
        raise HTTPException(HTTPStatus.NOT_FOUND, "intent not found")
    return db_intent


@router.get("/export", response_model=List[Intent])
async def export_intents(
    response: Response, intent_service: IntentService = Depends(IntentService)
):
    intents = intent_service.export()
    response.headers["Content-Disposition"] = 'attachment; filename="export.json"'
    response.headers["Content-Type"] = "application/octet-stream"
    return intents
