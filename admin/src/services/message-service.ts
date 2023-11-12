import { firestore } from "@/config/firebase";
import Message from "@/models/message";
import { Setter } from "@/types/common";
import { Unsubscribe, collection, onSnapshot } from "firebase/firestore";

class MessageService {
	private static MESSAGE_COLLECTION = collection(firestore, "message_logs")

	static watchFetchAll(setMessages: Setter<Message[]>, setLoading: Setter<boolean>, setError: Setter<Error>): Unsubscribe {
		setLoading(true);
		return onSnapshot(MessageService.MESSAGE_COLLECTION, (querySnapshot) => {
			setLoading(false)
			setMessages(querySnapshot.docs.map((document) => ({ ...document.data(), document_id: document.id })) as Message[])
		}, setError)
	}
}

export default MessageService;