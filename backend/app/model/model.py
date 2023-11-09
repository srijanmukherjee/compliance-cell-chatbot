from app.core.firestore_repository import FirestoreRepository, collection

@collection("models")
class ModelRepository(FirestoreRepository):
    id: str
    storage_id: str