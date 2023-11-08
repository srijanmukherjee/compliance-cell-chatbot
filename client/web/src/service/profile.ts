import { db } from "@/config/firebase";
import { Profile } from "@/model/profile";
import { User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export class ProfileNotFoundException extends Error {}

export async function fetchProfile(user: User): Promise<Profile> {
	const profileRef = doc(db, "users", user.uid);
	const profileSnap = await getDoc(profileRef);

	if (!profileSnap.exists()) throw new ProfileNotFoundException();

	return profileSnap.data() as any;
}

export async function updateProfile(user: User, profile: Profile) {
	const profileRef = doc(db, "users", user.uid);
	return await setDoc(profileRef, profile, { merge: true });
}
