import { Navigate, Route, Router, Routes } from "@solidjs/router";
import type { Component } from "solid-js";
import LoginPage from "./pages/login/LoginPage";
import NotFoundPage from "./pages/errors/NotFoundPage";

const App: Component = () => {
	return (
		<Router>
			<Routes>
				<Route path='/' element={<Navigate href='/chat' />} />
				<Route path='/login' component={LoginPage} />
				<Route path='*' component={NotFoundPage} />
			</Routes>
		</Router>
	);
};

export default App;
