from typing import Any, Optional
from loguru import logger
from enum import Enum
import torch.nn as nn
import torch
import os
from firebase_admin import storage

from app.model.model import ChatbotModelRepository, ChatbotModelStatus
from app.core.model_build_logger import get_model_build_logger
from app.model.intent import IntentRepository
from chatbot.model import NeuralNet
from chatbot.nltk_utils import bag_of_words, tokenize
from chatbot.train import train_model

class ModelState(Enum):
    LOADED          = 1
    NOT_AVAILABLE   = 2

class ModelService:
    def __init__(self, model_directory: str) -> None:
        if not os.path.exists(model_directory) or not os.path.isdir(model_directory):
            os.makedirs(model_directory)

        self._model_directory = model_directory
        self._state: ModelState = ModelState.NOT_AVAILABLE
        self._device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self._model: Optional[NeuralNet] = None
        self._tags: Any
        self._all_words: Any
        
        self.watcher = ChatbotModelRepository.watchDocument(self.handle_model)

    def __del__(self):
        self.watcher.unsubscribe()
    
    def get_model(self) -> nn.Module:
        if self._model is None:
            raise Exception("Model is not available")
        return self._model
    
    def get_state(self) -> ModelState:
        return self._state
    
    def predict(self, text: str):
        sentence = tokenize(text)
        X = bag_of_words(sentence, self._all_words)
        X = X.reshape(1, X.shape[0])
        X = torch.from_numpy(X).to(self._device)

        output = self.get_model()(X)
        _, predicted = torch.max(output, dim=1)

        tag = self._tags[predicted.item()]
        probs = torch.softmax(output, dim=1)
        prob = probs[0][int(predicted.item())]

        return tag, prob.item()
    
    def handle_model(self, model: ChatbotModelRepository):
        match model.status:
            case ChatbotModelStatus.INIT:
                self.__train_model__(model)
            case ChatbotModelStatus.TRAINED:
                if model.storageLocation is None:
                    return
                
                download_path = os.path.join(self._model_directory, model.storageLocation)
                if not os.path.exists(download_path):
                    bucket = storage.bucket()
                    blob = bucket.blob(model.storageLocation)
                    blob.download_to_filename(download_path)
                    logger.info(f"Downloaded model in {download_path}")

                self.__load_model__(model)
                self._state = ModelState.LOADED
            case ChatbotModelStatus.TRAINING:
                pass
            case ChatbotModelStatus.ERROR:
                pass

    def __load_model__(self, model: ChatbotModelRepository):
        if model.storageLocation is None:
            logger.warning("model doesn't have storageLocation")
            return
        
        model_path = os.path.join(self._model_directory, model.storageLocation)
        data = torch.load(model_path)
        logger.info(f"loading model {model_path}")

        self._model = NeuralNet(
            data["input_size"],
            data["hidden_size"],
            data["output_size"]
        ).to(self._device)

        self._model.load_state_dict(data["model_state"])
        self._model.eval()

        self._all_words = data["all_words"]
        self._tags = data["tags"]

        logger.info(f"model loaded")

    def __train_model__(self, model: ChatbotModelRepository):
        logger.info(f"Training model, initialized at {model.trainedOn}")
        
        model.status = ChatbotModelStatus.TRAINING
        model.save()
        
        build_logger = get_model_build_logger(model)

        build_logger.info("downloading intents")
        intents = IntentRepository.fetch_all()
        build_logger.info(f"downloaded {len(intents)} intents")

        try:
            model_path = train_model(self._device, intents, 
                                     logger=build_logger,
                                     output_dir=self._model_directory)
            
            filename = os.path.basename(model_path)
            bucket = storage.bucket()
            blob = bucket.blob(filename)
            blob.upload_from_filename(model_path)

            model.storageLocation = filename
            model.status = ChatbotModelStatus.TRAINED
            model.save()
        except Exception as e:
            build_logger.error(e)
            model.status = ChatbotModelStatus.ERROR
            model.save()
