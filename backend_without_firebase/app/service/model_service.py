import os
from ast import arg
from enum import Enum
from threading import Lock, Thread
from typing import Any, Optional, Self

import torch
import torch.nn as nn
from blinker import signal
from fastapi import Depends
from loguru import logger
from sqlalchemy import Null, and_, desc, insert, update
from sqlalchemy.orm import Session

from app import schemas, settings
from app.core.model_build_logger import get_model_build_logger
from app.core.util import singleton
from app.db import models
from app.db.session import engine
from app.dependencies import get_db
from chatbot.model import NeuralNet
from chatbot.nltk_utils import bag_of_words, tokenize
from chatbot.train import train_model


class ModelState(Enum):
    LOADED = 1
    TRAINING = 2
    NOT_AVAILABLE = 3


@singleton
class ModelService:
    def __init__(
        self,
        db: Session,
        model_directory: str = settings.APPLICATION_DATA_PATH,
    ) -> None:
        if not os.path.exists(model_directory) or not os.path.isdir(model_directory):
            os.makedirs(model_directory)

        self._model_directory = model_directory
        self._state: ModelState = ModelState.NOT_AVAILABLE
        self._state_lock: Lock = Lock()
        self._device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self._model: Optional[NeuralNet] = None
        self._tags: Any
        self._all_words: Any
        self._db = db
        self._signal = signal("ModelService")
        self._train_thread: Thread | None = None

        self._signal.connect(self.receiver)

        # load latest model
        chat_model = (
            self._db.query(models.ChatModel)
            .order_by(desc(models.ChatModel.created_on))
            .filter(
                models.ChatModel.state == models.ChatModelStatus.TRAINED,
            )
            .limit(1)
            .one_or_none()
        )

        if chat_model and chat_model.location is not None:
            logger.info(
                f"Loading lastest model trained on {chat_model.created_on} - {chat_model.location}"
            )
            self.__load_model__(str(chat_model.location))
            self._state = ModelState.LOADED

    def receiver(self, sender, **kwargs):
        print(kwargs.get("log", None))

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

    def __load_model__(self, path: str):
        if path is None:
            logger.warning("model path is required")
            return

        data = torch.load(path)
        logger.info(f"loading model {path}")

        self._model = NeuralNet(
            data["input_size"], data["hidden_size"], data["output_size"]
        ).to(self._device)

        self._model.load_state_dict(data["model_state"])
        self._model.eval()

        self._all_words = data["all_words"]
        self._tags = data["tags"]

        logger.info(f"model loaded")

    def train_model(self):
        model_state: ModelState = ModelState.NOT_AVAILABLE
        with self._state_lock:
            model_state = self._state
        if model_state == ModelState.TRAINING or self._train_thread is not None:
            return ("training", None)

        db_model = models.ChatModel(state=models.ChatModelStatus.INIT)
        self._db.add(db_model)
        self._db.commit()
        self._db.refresh(db_model)

        if db_model is None:
            return ("error", None)

        self._train_thread = Thread(target=self.__training_worker, args=(db_model.id,))
        self._train_thread.start()

        return ("added", db_model)

    def update_model_status(
        self,
        session: Session,
        chat_model: models.ChatModel,
        state: models.ChatModelStatus,
    ):
        session.execute(
            update(models.ChatModel)
            .where(models.ChatModel.id == chat_model.id)
            .values(state=state)
        )
        session.refresh(chat_model)
        session.commit()
        return chat_model

    def __training_worker(self, id: int):
        with Session(engine) as session:
            chat_model = (
                session.query(models.ChatModel).where(models.ChatModel.id == id).one()
            )

            logger.info(f"Training model, initialized at {chat_model.created_on}")
            chat_model = self.update_model_status(
                session, chat_model, models.ChatModelStatus.TRAINING
            )

            with self._state_lock:
                self._state = ModelState.TRAINING

            build_logger = get_model_build_logger(self._signal, session, chat_model)
            build_logger.info("downloading intents")
            intents = session.query(models.Intent).all()
            build_logger.info(f"downloaded {len(intents)} intents")

            try:
                model_path = train_model(
                    self._device,
                    intents,
                    logger=build_logger,
                    output_dir=self._model_directory,
                )

                session.execute(
                    update(models.ChatModel)
                    .values(location=model_path, state=models.ChatModelStatus.TRAINED)
                    .where(models.ChatModel.id == chat_model.id)
                )

                self.__load_model__(model_path)

                with self._state_lock:
                    self._state = ModelState.LOADED
            except Exception as e:
                build_logger.error(e)
                session.execute(
                    update(models.ChatModel)
                    .values(state=models.ChatModelStatus.ERROR)
                    .where(models.ChatModel.id == chat_model.id)
                )

                with self._state_lock:
                    self._state = ModelState.NOT_AVAILABLE
            finally:
                session.commit()
        self._train_thread = None
