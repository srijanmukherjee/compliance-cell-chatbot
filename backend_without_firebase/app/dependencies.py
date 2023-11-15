# from app.config import firebase
from app.db.session import SessionLocal

# def get_firebase_app():
#     return firebase.app


# def get_firestore_client():
#     return firebase.client


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
