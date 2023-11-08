import { Profile } from "@/model/profile";
import { User } from "firebase/auth";
import { createSignal } from "solid-js";

interface AuthStore {
	loaded: boolean;
	profile?: Profile;
	user?: User;
}

export const [authState, setAuthState] = createSignal<AuthStore>({
	loaded: false,
});
