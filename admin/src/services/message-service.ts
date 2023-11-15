import { firestore } from "@/config/firebase";
import Message from "@/models/message";
import { Setter } from "@/types/common";
import { Unsubscribe, collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";

class MessageService {
	private static MESSAGE_COLLECTION = collection(firestore, "message_logs")
	private static cache = new Map<string, Message>();

	static watchFetchAll(setMessages: Setter<Message[]>, setLoading: Setter<boolean>, setError: Setter<Error>): Unsubscribe {
		setLoading(true);
		console.log("cache size: ", MessageService.cache.size);
		return onSnapshot(query(MessageService.MESSAGE_COLLECTION, orderBy("created_on", "desc")), (querySnapshot) => {
			setLoading(false)

			querySnapshot.docChanges().forEach((change) => {
				if (change.type === 'added') {
					const { doc } = change;
					const id = doc.id;
					// already in the set
					if (MessageService.cache.has(id)) return;
					const data = doc.data();
					const message = { ...data, document_id: id } as Message;
					MessageService.cache.set(id, message);
				}
				else if (change.type === 'modified') {
					const { doc } = change;
					const id = doc.id;
					if (!MessageService.cache.has(id)) return;
					const data = doc.data();
					const message = { ...data, document_id: id } as Message;
					MessageService.cache.set(id, message);
				}

				else {
					const { doc } = change;
					MessageService.cache.delete(doc.id)
				}
			})
			setMessages(Array.from(MessageService.cache.values()))
		}, (error) => {
			if (process.env.NODE_ENV === 'development') console.error(error)
			setError(error);
		})
	}

	static watchFetchLatest(setMessages: Setter<Message[]>, setLoading: Setter<boolean>, setError: Setter<Error>): Unsubscribe {
		setLoading(true);
		console.log("cache size: ", MessageService.cache.size);

		let latest: Message[] = [];
		if (MessageService.cache.size > 0) {
			Array.from(MessageService.cache.values()).toSorted((a, b) => b.created_on.toMillis() - a.created_on.toMillis()).slice(0, 3).forEach((message) => latest.push(message));
		}

		return onSnapshot(query(MessageService.MESSAGE_COLLECTION, orderBy("created_on", "desc"), limit(3)), (querySnapshot) => {
			setLoading(false)

			querySnapshot.docChanges().forEach((change) => {
				if (change.type === 'added') {
					const { doc } = change;
					const id = doc.id;
					// already in the set
					if (MessageService.cache.has(id)) return;
					const data = doc.data();
					const message = { ...data, document_id: id } as Message;
					MessageService.cache.set(id, message);
					latest = [message, ...latest];
					// if (latest.length > 3) latest.pop()
				}
				else if (change.type === 'modified') {
					const { doc } = change;
					const id = doc.id;
					if (!MessageService.cache.has(id)) return;
					const data = doc.data();
					const message = { ...data, document_id: id } as Message;
					MessageService.cache.set(id, message);
				}

				else {
					const { doc } = change;
					MessageService.cache.delete(doc.id)
				}
			})
			setMessages(latest);
		}, (error) => {
			if (process.env.NODE_ENV === 'development') console.error(error)
			setError(error);
		})
	}
}

export default MessageService;