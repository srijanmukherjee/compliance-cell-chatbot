from abc import ABC
from typing import Callable, List, Optional, Type, TypeVar

from pydantic import BaseModel
from datetime import datetime
from app.config.firebase import client
from firebase_admin.firestore import firestore
from google.cloud.firestore_v1.watch import Watch, DocumentChange
from proto.datetime_helpers import DatetimeWithNanoseconds

T = TypeVar('T', bound='FirestoreRepository')

def generate_document_watcher(cls: Type[T], callback: Callable[[T], None]) -> Callable[[List[firestore.DocumentSnapshot], DocumentChange, DatetimeWithNanoseconds], None]:
    def handler(doc_snapshot: List[firestore.DocumentSnapshot], changes: DocumentChange, read_time: DatetimeWithNanoseconds):
        if len(doc_snapshot) == 1:
            document = doc_snapshot[0]
            data = cls.model_validate(document.to_dict())
            data._create_time = document.create_time
            callback(data)

    return handler

def generate_collection_watcher(cls: Type[T], callback: Callable[[List[T]], None]) -> Callable[[List[firestore.DocumentSnapshot], DocumentChange, DatetimeWithNanoseconds], None]:
    def handler(doc_snapshot: List[firestore.DocumentSnapshot], changes: DocumentChange, read_time: DatetimeWithNanoseconds):
        documents = []
        for doc in doc_snapshot:
            data = cls.model_validate(doc.to_dict())
            data._create_time = doc.create_time
            documents.append(data)
        callback(documents)

    return handler

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

    @classmethod
    def watchDocument(cls: Type[T], callback: Callable[[T], None], document_id: Optional[str] = None) -> Watch:
        if cls._collection_id is None:
            raise Exception("collection_id is not set")
        
        if cls._document_id is None:
            raise Exception("document_id is not set")
        
        if document_id is None:
            document_id = cls._document_id
        
        document = client.document(cls._collection_id, document_id)
        return document.on_snapshot(generate_document_watcher(cls, callback))
    
    @classmethod
    def watchCollection(cls: Type[T], callback: Callable[[List[T]], None]) -> Watch:
        if cls._collection_id is None:
            raise Exception("collection_id is not set")
        
        collection = client.collection(cls._collection_id)
        return collection.on_snapshot(generate_collection_watcher(cls, callback))

    def document_id(self):
        return self._document_id
    
    def get_create_time(self):
        return self._create_time

def collection(collection_id: str):
    def apply(cls):
        cls._collection_id = collection_id
        return cls
    return apply

def document(document_id: str):
    def apply(cls):
        cls._document_id = document_id
        return cls
    return apply