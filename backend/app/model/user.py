from re import S
from app.core.firestore_repository import FirestoreRepository, collection


@collection("users")
class UserRepository(FirestoreRepository):
    branch: str
    firstName: str
    lastName: str
    semester: int