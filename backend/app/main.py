from fastapi import FastAPI

from app import settings
from app.model.chat import ChatMessage
from app.service.chat_service import ChatService
from app.service.model_service import ModelService

app = FastAPI()
model_service = ModelService(settings.APPLICATION_DATA_PATH)
chat_service = ChatService(model_service)

@app.get("/")
async def index():
    return { "message": "Hello from chai ☕ server! " }

@app.post("/chat")
async def chat(chat_message: ChatMessage):
    response = chat_service.generate_response(chat_message)
    return {"response": response}
