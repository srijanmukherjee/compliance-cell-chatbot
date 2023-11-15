from fastapi import APIRouter, Depends

from app.schemas import MessageLog, PaginatedResult
from app.service.message_log_service import MessageLogService

router = APIRouter(prefix="/message_logs", tags=["log"])


@router.get("/", response_model=PaginatedResult[MessageLog])
async def fetch_message_logs(
    page: int = 1,
    page_size: int = MessageLogService.DEFAULT_PAGE_SIZE,
    message_log_service: MessageLogService = Depends(MessageLogService),
):
    return message_log_service.fetch_all(page, page_size)


@router.get("/recent_count")
async def recent_message_count(
    message_log_service: MessageLogService = Depends(MessageLogService),
):
    return message_log_service.get_recent_messages_count()
