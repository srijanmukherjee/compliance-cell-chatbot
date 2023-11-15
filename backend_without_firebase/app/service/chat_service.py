from random import choice
from typing import Optional

from fastapi import Depends

from app.db.models import MessageState
from app.routers.chat_model import get_model_service
from app.schemas import ChatMessage
from app.service.intent_service import IntentService
from app.service.logger_service import LoggerService
from app.service.model_service import ModelService, ModelState


class ChatServiceNotLoadedException(Exception):
    pass


class ChatService:
    def __init__(
        self,
        threshold=0.75,
        model_service: ModelService = Depends(get_model_service),
        logger_service: LoggerService = Depends(LoggerService),
        intent_service: IntentService = Depends(IntentService),
    ):
        self._model_service = model_service
        self._logger_service = logger_service
        self._intent_service = intent_service
        self._threshold = threshold

    def generate_response(self, message: ChatMessage):
        if self._model_service.get_state() == ModelState.NOT_AVAILABLE:
            raise ChatServiceNotLoadedException()

        tag, probability = self._model_service.predict(message.text)
        state: MessageState = MessageState.BELOW_THRESHOLD
        response: Optional[str] = None

        if probability > self._threshold:
            state = MessageState.INTENT_NOT_FOUND

            intent = self._intent_service.fetch_one(tag)
            if intent is not None:
                state = MessageState.REPLIED
                response = choice([str(response) for response in intent.responses])

        self._logger_service.log_chat(
            message.text,
            "anonymous" if message._uid is None else message._uid,
            tag,
            probability,
            response,
            state,
            self._threshold,
        )

        return "Sorry I don't understand..." if response is None else response
