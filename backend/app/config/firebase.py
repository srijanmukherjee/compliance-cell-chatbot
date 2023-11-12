import os
import firebase_admin
from firebase_admin.firestore import client as firestore_client
from firebase_admin.firestore import firestore

options={
    'storageBucket': os.environ.get("STORAGE_BUCKET", None)
}
app = firebase_admin.initialize_app(options=options)
client: firestore.Client = firestore_client(app)