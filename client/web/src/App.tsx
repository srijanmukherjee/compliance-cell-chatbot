import { Route, Routes, useLocation, useNavigate } from "@solidjs/router";
import { User } from "firebase/auth";
import { Show, createEffect, createSignal, onMount, type Component } from "solid-js";
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
		if (user === undefined) {
			setLoaded(true);
			return;
		}

		try {
			const profile = await fetchProfile(user);
			setAuthState((prev) => ({ ...prev, profile }));
		} catch (error) {
			if (error instanceof ProfileNotFoundException) {
				if (location.pathname !== "/onboarding") navigate("/onboarding");
			} else {
				// 500 error
			}

			console.log(error);
		}

		setLoaded(true);
	};

	onMount(() => {
		auth.onAuthStateChanged((user) => {
			setAuthState((prev) => ({ ...prev, loaded: true, user: user === null ? undefined : user }));
		});
	});

	createEffect(() => {
		const { loaded: userLoaded, user, profile } = authState();
		if (location.pathname !== "/login" && userLoaded && user === undefined) {
			let url = "/login";
			if (location.pathname !== "/") url += "?to=" + encodeURI(location.pathname);
			navigate(url);
		}

		if (loaded()) return;
		if (userLoaded) loadProfile(user);
		// setLoaded(true);
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
