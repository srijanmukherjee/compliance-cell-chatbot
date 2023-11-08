import { auth } from "@/service/auth";
import { authState } from "@/store/authStore";
import { useLocation } from "@solidjs/router";
import { Component } from "solid-js";
import Logo from "./Logo";

const Navbar: Component = () => {
	const location = useLocation();

	return (
		<div class='navbar bg-base-100 w-full justify-center'>
			<div class='w-full sm:max-w-screen-lg items-center self-center'>
				<div class='flex-1'>
					<a class='btn btn-ghost normal-case text-xl'>
						<Logo />
					</a>
				</div>
				<div class='flex'>
					<ul class='menu menu-horizontal px-1 space-x-1'>
						{authState().user === undefined && (
							<li>
								<a
									class={location.pathname === "/login" ? "active" : undefined}
									href='login'>
									Login
								</a>
							</li>
						)}
						{authState().user && (
							<li>
								<a
									href='/'
									class={location.pathname === "/" ? "active" : undefined}>
									Chat
								</a>
							</li>
						)}
						<li>
							<a
								href='https://github.com/srijanmukherjee/compliance-cell-chatbot'
								target='_blank'>
								Github
							</a>
						</li>
					</ul>
					{authState().user && (
						<div class='dropdown dropdown-end'>
							<label
								tabindex='0'
								class='btn btn-ghost btn-circle avatar'>
								<div class='w-10 rounded-full'>
									<img
										src={authState().user!.photoURL!}
										alt='User photo'
									/>
								</div>
							</label>
							<ul
								tabindex='0'
								class='mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52'>
								<li>
									<a
										class='justify-between'
										href='/'>
										Profile
									</a>
								</li>
								<li>
									<a onClick={() => auth.signOut()}>Logout</a>
								</li>
							</ul>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Navbar;
