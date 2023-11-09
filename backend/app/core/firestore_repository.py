from abc import ABC
from typing import List, Optional

from pydantic import BaseModel
from datetime import datetime
from app.config.firebase import client
from firebase_admin.firestore import firestore

class FirestoreRepository(BaseModel, ABC):
    _collection_id: Optional[str] = None
    _document_id: Optional[str] = None
    _create_time: datetime = datetime.now()

    @classmethod
    def fetch(cls, documentId: str):
        if cls._collection_id is None:
            raise Exception("Collection is not set")
        
        if cls == FirestoreRepository:
            raise Exception("This method must be called from subclass models")
        
        doc = client.document(cls._collection_id, documentId)
        snapshot = doc.get()

        if not snapshot.exists:
            return None
        
        data = cls.model_validate(snapshot.to_dict())
        data._document_id = documentId
        data._create_time = snapshot.create_time
        return data
    
    @classmethod
    def fetch_all(cls):
        if cls._collection_id is None:
            raise Exception("Collection is not set")

        collection = client.collection(cls._collection_id)
        datas: List[cls] = []

        for snapshot in collection.stream():
            data = cls.model_validate(snapshot.to_dict())
            data._document_id = snapshot.id
            data._create_time = snapshot.create_time
            datas.append(data)

        return datas

    def save(self):
        if self._collection_id is None:
            raise Exception("Collection is not set")
        
        # insert new document
        if self._document_id is None:
            collection = client.collection(self._collection_id)
            _, document = collection.add(self.model_dump())
            doc: firestore.DocumentReference = document
            self._document_id = doc.id
            self._create_time = doc.get().create_time
        
        # update existing document
        else:
            doc = client.document(self._collection_id, self._document_id)
            doc.set(self.model_dump())
            self._create_time = doc.get().create_time

    def document_id(self):
        return self._document_id
    
    def get_create_time(self):
        return self._create_time

def collection(collection_name: str):
    def apply(cls):
        cls._collection_id = collection_name
        return cls
    return apply