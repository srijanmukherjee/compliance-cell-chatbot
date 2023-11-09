import firebase_admin
from firebase_admin.firestore import client as firestore_client
from firebase_admin.firestore import firestore

app = firebase_admin.initialize_app()
client: firestore.Client = firestore_client(app)