import { Route, Routes, useLocation, useNavigate } from "@solidjs/router";
import { User } from "firebase/auth";
import { Show, createEffect, createSignal, type Component } from "solid-js";
import Navbar from "./components/Navbar";
import NotFoundPage from "./pages/errors/NotFoundPage";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/login/LoginPage";
import OnboardingPage from "./pages/onboarding/OnboardingPage";
import { auth } from "./service/auth";
import { ProfileNotFoundException, fetchProfile } from "./service/profile";
import { authState, setAuthState } from "./store/authStore";

const routes = {
	"/": {
		component: HomePage,
	},

	"/login": {
		component: LoginPage,
	},

	"/onboarding": {
		component: OnboardingPage,
	},

	"*": {
		component: NotFoundPage,
	},
};

const App: Component = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [loaded, setLoaded] = createSignal(false);

	const loadProfile = async (user: User | undefined) => {
		// user is not logged in, so dont load profile
		if (user === undefined) {
			return true;
		}

		try {
			const profile = await fetchProfile(user);
			setAuthState((prev) => ({ ...prev, profile }));
		} catch (error) {
			if (error instanceof ProfileNotFoundException) {
				if (location.pathname !== "/onboarding") {
					navigate("/onboarding");
					return false;
				}
			} else {
				// 500 error
			}
		}

		return true;
	};

	createEffect(() => {
		return auth.onAuthStateChanged((user) => {
			setAuthState((prev) => ({ ...prev, loaded: true, user: user ?? undefined }));
		});
	});

	createEffect(() => {
		const { loaded: userLoaded, user, profile } = authState();
		if (!userLoaded) return;
		if (user && !profile) setLoaded(false);

		// user is not logged in but accessing protected routes
		if (location.pathname !== "/login" && user === undefined) {
			let url = "/login";

			// return back to this url after logging in
			if (location.pathname !== "/") url += "?to=" + encodeURI(location.pathname);

			// go to login page
			navigate(url);
		}
		if (user === undefined) setLoaded(true);
		else if (!profile) {
			loadProfile(user).then(setLoaded);
		} else {
			setLoaded(true);
		}
	});

	createEffect(() => {
		const { loaded: userLoaded, user, profile } = authState();
		if (!userLoaded) return;
	});

	return (
		<div class='min-h-screen flex flex-col'>
			<Show
				when={loaded()}
				fallback={
					<div class='flex min-h-screen justify-center items-center'>
						<span class='loading loading-spinner loading-lg' />
					</div>
				}>
				<Navbar />
				<Routes>
					{Object.entries(routes).map(([path, props]) => (
						<Route
							path={path}
							{...props}
						/>
					))}
				</Routes>
			</Show>
		</div>
	);
};

export default App;
