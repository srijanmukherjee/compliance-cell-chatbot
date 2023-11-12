import logging
from app.model.model import ChatbotModelRepository

class ModelBuildStream:
    def __init__(self, model: ChatbotModelRepository):
        self.model = model
    
    def write(self, s: str):
        self.model.buildLog += s
        self.model.save()


def get_model_build_logger(model: ChatbotModelRepository, name="model-trainer"):
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    model_log_handler = logging.StreamHandler(ModelBuildStream(model))
    model_log_handler.setFormatter(formatter)
    logger = logging.Logger(name)
    logger.addHandler(model_log_handler)

    return logger