from app.config import firebase

def get_firebase_app():
    return firebase.app

def get_firestore_client():
    return firebase.client