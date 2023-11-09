from enum import Enum
import os
from loguru import logger

import torch
import torch.nn as nn

from app.model.model import ModelRepository

class ModelState(Enum):
    LOADING         = 0
    LOADED          = 1
    NOT_AVAILABLE   = 2

class ModelService:
    def __init__(self, model_directory: str, info_file: str = 'model.json') -> None:
        if not os.path.exists(model_directory) or not os.path.isdir(model_directory):
            os.makedirs(model_directory)

        self.state: ModelState = ModelState.NOT_AVAILABLE
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

        # load local model information
        model_information_path = os.path.join(model_directory, info_file)

        if os.path.exists(model_information_path):
            pass

        else:
            logger.info("local model information doesn't exist, loading from cloud")

            self.state = ModelState.LOADING
            models = ModelRepository.fetch_all()
            logger.info(f"models fetched: {len(models)}")

            if len(models) == 0:
                logger.warning("Model service without any active model")
                self.state = ModelState.NOT_AVAILABLE
                return

    
    def set_model(self, model_id: str):
        return NotImplemented
    
    def train_model(self):
        return NotImplemented

    def get_model(self) -> nn.Module:
        return NotImplemented