import { db } from "@/config/firebase";
import { Profile } from "@/model/profile";
import { User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export class ProfileNotFoundException extends Error {}

const cache = new Map<string, Profile>();

export async function fetchProfile(user: User): Promise<Profile> {
	if (cache.has(user.uid)) return cache.get(user.uid)!;
	const profileRef = doc(db, "users", user.uid);

	const profileSnap = await getDoc(profileRef);

	if (import.meta.env.DEV) {
		console.log(`fetched profile for ${user.uid}`);
	}

	if (!profileSnap.exists()) throw new ProfileNotFoundException();

	const profile = profileSnap.data() as Profile;
	cache.set(user.uid, profile);
	return profile;
}

export async function updateProfile(user: User, profile: Profile) {
	const profileRef = doc(db, "users", user.uid);
	// TODO: update cache
	return await setDoc(profileRef, profile, { merge: true });
}
