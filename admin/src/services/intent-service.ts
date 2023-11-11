import { firestore } from "@/config/firebase";
import Intent from "@/models/intent";
import { collection, doc, getDocs, onSnapshot, setDoc } from "firebase/firestore";

class IntentService {
	private static INTENTS_COLLECTION = collection(firestore, "intents");

	static async fetchAll(): Promise<Intent[]> {
		const querySnapshot = await getDocs(IntentService.INTENTS_COLLECTION);

		const intents: Intent[] = querySnapshot.docs.map((docSnapshot) => {
			const data = docSnapshot.data()
			console.log(data);
			return {
				tag: data.tag,
				patterns: data.patterns,
				responses: data.responses
			}
		})

		return intents;
	}

	static watchFetchAll(setIntents: (val: Intent[]) => void, setLoading: (val: boolean) => void, setError: (val: Error) => void): () => void {
		setLoading(true);
		return onSnapshot(IntentService.INTENTS_COLLECTION, (snapshot) => {
			const intents = snapshot.docs.map((docSnapshot) => docSnapshot.data()) as Intent[]
			setIntents(intents);
			setLoading(false);
		}, setError)
	}

	static async insertOne(intent: Intent) {
		const intentRef = doc(IntentService.INTENTS_COLLECTION, intent.tag);
		return setDoc(intentRef, intent);
	}
}

export default IntentService;