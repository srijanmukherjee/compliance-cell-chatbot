from datetime import datetime
from random import choice
from typing import List, Optional

from loguru import logger
from app.main import ChatMessage
from app.model.intent import IntentRepository
from app.model.message import MessageRepository, MessageState
from app.service.model_service import ModelService, ModelState

class ChatServiceNotLoadedException(Exception):
    pass

class ChatService:
    def __init__(self, model_service: ModelService, threshold=0.75):
        self._model_service = model_service
        self._intents = []
        self._threshold = threshold

        IntentRepository.watchCollection(self.__handle_intents__)

    def generate_response(self, message: ChatMessage):
        if self._model_service.get_state() == ModelState.NOT_AVAILABLE:
            raise ChatServiceNotLoadedException()
        
        tag, probability = self._model_service.predict(message.text)
        state: MessageState = MessageState.BELOW_THRESHOLD
        response: Optional[str] = None

        if probability > self._threshold:
            state = MessageState.INTENT_NOT_FOUND

            for intent in self._intents:
                if intent.tag == tag:
                    state = MessageState.REPLIED
                    response = choice(intent.responses)
            
        message_log = MessageRepository(
            text = message.text,
            uid = message.uid,
            created_on = datetime.now(),
            tag = tag,
            probability = probability,
            response = response,
            state = state,
            threshold = self._threshold
        )
        try:
            message_log.save()
        except Exception as e:
            # TODO catch more detailed exception
            logger.error(f"Failed to save chat message log: {e}")

        return "Sorry I don't understand..." if response is None else response
    
    def __handle_intents__(self, intents: List[IntentRepository]):
        self._intents = intents