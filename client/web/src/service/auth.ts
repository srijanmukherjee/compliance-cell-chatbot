import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { ALLOWED_EMAIL_DOMAINS } from "../constants/email";
import app from "../config/firebase";

export const auth = getAuth(app);

const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.addScope("");
googleAuthProvider.setCustomParameters({});

function validateEmail(email: string): boolean {
	return ALLOWED_EMAIL_DOMAINS.some((domain) => email.endsWith(domain));
}

export async function googleSignin() {
	return signInWithPopup(auth, googleAuthProvider)
		.then((userCredential) => {
			const { email } = userCredential.user;
			if (email === null || !validateEmail(email)) throw new Error("Account is outside the organisation");
			return userCredential;
		})
		.catch((reason) => {
			auth.signOut();
			throw reason;
		});
}
