import { Timestamp } from "firebase/firestore";

export enum MessageState {
	REPLIED = "replied",
	INTENT_NOT_FOUND = "intent_not_found",
	BELOW_THRESHOLD = "below_threshold"
}

interface Message {
	document_id: string;
	uid: string;
	text: string;
	created_on: Timestamp;
	tag: string;
	probability: string;
	response?: string;
	state: MessageState;
	threshold: number;
}

export default Message;