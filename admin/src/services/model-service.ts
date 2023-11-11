import { firestore } from "@/config/firebase";
import ChatbotModel, { TrainingStatus } from "@/models/chatbot-model";
import { Setter } from "@/types/common";
import { collection, doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";

class ModelService {
	private static CHATBOT_COLLECTION = collection(firestore, "chatbot");
	private static MODEL_DOCUMENT = doc(ModelService.CHATBOT_COLLECTION, "model")

	static watchFetchModel(setModel: Setter<ChatbotModel | undefined>, setLoading: Setter<boolean>, setError: Setter<Error>) {
		setLoading(true);

		return onSnapshot(ModelService.MODEL_DOCUMENT, (snapshot) => {
			const model = snapshot.data();
			setModel(model ? model as ChatbotModel : undefined)
			setLoading(false);
		}, setError)
	}

	static trainModel() {
		return setDoc(ModelService.MODEL_DOCUMENT, {
			buildLog: "",
			status: TrainingStatus.INIT,
			storageLocation: null,
			trainedOn: serverTimestamp()
		});
	}
}

export default ModelService;