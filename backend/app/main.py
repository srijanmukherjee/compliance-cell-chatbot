from string import Formatter
from typing import Optional
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from firebase_admin.auth import verify_id_token, ExpiredIdTokenError, InvalidIdTokenError, RevokedIdTokenError, CertificateFetchError, UserDisabledError

from app import settings
from app.model.chat import ChatMessage
from app.model.user import UserRepository
from app.service.chat_service import ChatService
from app.service.model_service import ModelService

app = FastAPI()

origins = [
    "http://localhost:3001",
    "https://compliance-cell-chatbot-ha2g.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

model_service = ModelService(settings.APPLICATION_DATA_PATH)
chat_service = ChatService(model_service)

@app.get("/")
async def index():
    return { "message": "Hello from chai ☕ server! " }

@app.post("/chat")
async def chat(chat_message: ChatMessage):
    claims: Optional[dict] = None
    try:
        claims = verify_id_token(chat_message.token, check_revoked=True)
    except ValueError as e:
        pass
    except ExpiredIdTokenError as e:
        pass
    except RevokedIdTokenError as e:
        pass
    except InvalidIdTokenError as e:
        pass
    except CertificateFetchError as e:
        pass
    except UserDisabledError as e:
        pass
    
    if claims is None or "uid" not in claims or claims["uid"] is None:
        return { "error": "authentication failed" }

    chat_message._uid = claims["uid"]
    user = UserRepository.fetch(chat_message._uid)

    branch_syllabus_links = {
        "cse": "https://kiit.ac.in/wp-content/uploads/2021/05/2018-2022-Computer-Science-Engeering.pdf"
    }

    knowledge_base = {
        "user_name": claims.get("name", None),
        "branch": user.branch if user else None,
        "branch_syllabus_link": f"<br>Here's the link to {user.branch} syllabus: {branch_syllabus_links.get(user.branch)}" if user and user.branch in branch_syllabus_links else None
    }

    response = chat_service.generate_response(chat_message)
    fields = [field for _, field, _, _ in Formatter().parse(response) if field]
    values = dict()

    for field in fields:
        value = knowledge_base.get(field, None)
        values[field] = "" if value is None else value

    return {"response": response.format(**values)}

@app.get("/test")
async def test():
    chat_message = ChatMessage(token="anonymouse", text="hello")
    chat_message._uid = "anonymous"
    chat_service.generate_response(chat_message)
    return "OK"
