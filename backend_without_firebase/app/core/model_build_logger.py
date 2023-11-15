import logging

from blinker import NamedSignal
from sqlalchemy import update
from sqlalchemy.orm import Session

from app.db.models import ChatModel


class ModelBuildStream:
    def __init__(self, sig: NamedSignal, session: Session, model: ChatModel):
        self.model = model
        self.log = ""
        self.session = session
        self.signal = sig

    def write(self, s: str):
        self.log += s
        self.session.execute(
            update(ChatModel)
            .values(build_log=self.log)
            .where(ChatModel.id == self.model.id)
        )
        self.signal.send("logger", log=self.log)


def get_model_build_logger(
    sig: NamedSignal, session: Session, model: ChatModel, name="model-trainer"
):
    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )
    model_log_handler = logging.StreamHandler(ModelBuildStream(sig, session, model))
    model_log_handler.setFormatter(formatter)
    logger = logging.Logger(name)
    logger.addHandler(model_log_handler)

    return logger
