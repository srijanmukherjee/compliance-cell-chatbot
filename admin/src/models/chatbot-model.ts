import { Timestamp } from "firebase/firestore";

export enum TrainingStatus {
	INIT = "init",
	TRAINED = "trained",
	TRAINING = "training",
	ERROR = "error"
}

interface ChatbotModel {
	storageLocation: string | null;
	buildLog: string;
	trainedOn: Timestamp;
	status: TrainingStatus;
}

export default ChatbotModel;