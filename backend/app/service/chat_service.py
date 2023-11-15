from random import choice
import threading
from typing import List, Optional

from app.main import ChatMessage
from app.model.intent import IntentRepository
from app.model.message import MessageState
from app.service.logger_service import LoggerService
from app.service.model_service import ModelService, ModelState

class ChatServiceNotLoadedException(Exception):
    pass

class ChatService:
    def __init__(self, model_service: ModelService, threshold=0.75, logger_service: LoggerService = LoggerService()):
        self._model_service = model_service
        self._logger_service = logger_service
        self._intents = []
        self._threshold = threshold
        self._intents_lock = threading.Lock()

        self.watcher = IntentRepository.watchCollection(self.__handle_intents__)

    def __del__(self):
        self.watcher.unsubscribe()

    def generate_response(self, message: ChatMessage):
        if self._model_service.get_state() == ModelState.NOT_AVAILABLE:
            raise ChatServiceNotLoadedException()
        
        tag, probability = self._model_service.predict(message.text)
        state: MessageState = MessageState.BELOW_THRESHOLD
        response: Optional[str] = None

        if probability > self._threshold:
            state = MessageState.INTENT_NOT_FOUND

            with self._intents_lock:
                for intent in self._intents:
                    if intent.tag == tag:
                        state = MessageState.REPLIED
                        response = choice(intent.responses)

        self._logger_service.log_chat(
            message.text,
            message._uid,
            tag,
            probability,
            response,
            state,
            self._threshold
        )

        return "Sorry I don't understand..." if response is None else response
    
    def __handle_intents__(self, intents: List[IntentRepository]):
        with self._intents_lock:
            self._intents = intents