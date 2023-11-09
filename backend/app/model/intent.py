from typing import Any, List

from app.core.firestore_repository import FirestoreRepository, collection

@collection("intents")
class IntentRepository(FirestoreRepository):
    tag: str
    patterns: List[str]
    responses: List[str]

    def model_post_init(self, __context: Any) -> None:
        self._document_id = self.tag
        return super().model_post_init(__context)