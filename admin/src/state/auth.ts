import { User } from 'firebase/auth';
import { atom } from 'jotai';

interface AuthState {
	loaded: boolean;
	user: User | null
}

const authAtom = atom<AuthState>({
	loaded: false,
	user: null,
});

export default authAtom;
