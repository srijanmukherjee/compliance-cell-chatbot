import os
from fastapi import Depends, FastAPI
from app import settings
from app.dependencies import get_firestore_client
from app.model.chat import ChatMessage
from app.model.intent import IntentRepository
from app.model.model import ModelRepository
from app.service.chat_service import ChatService

from firebase_admin.firestore import firestore

from app.service.model_service import ModelService

# app = FastAPI()
model_service = ModelService(
    settings.APPLICATION_DATA_PATH, 
    settings.MODEL_INFO_DATA_FILE)
chat_service = ChatService(model_service)

# chat_model = ChatModel(id='10', storage_id='hello')
# print(chat_model.model_fields)
# chat_model.save()

# data = ChatModel.fetch("MT3Wr5ue4mTCKDeAB9s3")
# if data:
#     print(data)

intent = IntentRepository(tag="goodbye", patterns=["Bye", "See you later"], responses=["Have a nice day :-)"])
intent.save()

# for model in ModelRepository.fetch_all():
    # print(model, model._create_time.date())

# @app.get("/")
# async def index():
#     return { "message": "Hello from chai ☕ server! " }

# @app.post("/chat")
# async def chat(chat_message: ChatMessage):
#     # tag, prob = chat_service.generate_response(chat_message)
#     # return {"tag": tag, "probability": prob}
#     return None
