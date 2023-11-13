import Alert from "@/components/Alert";
import ContinueWithGoogleButton from "@/components/ContinueWithGoogleButton";
import Input from "@/components/Input";
import Logo from "@/components/Logo";
import { authState } from "@/store/authStore";
import { Navigate, useLocation, useNavigate } from "@solidjs/router";
import { FirebaseError } from "firebase/app";
import { AuthErrorCodes } from "firebase/auth";
import { createMemo, createSignal } from "solid-js";
import { googleSignin } from "../../service/auth";

// TODO: Implement email/password login
export default function LoginPage() {
	const [error, setError] = createSignal<string>();
	const [googleLoading, setGoogleLoading] = createSignal(false);
	const navigate = useNavigate();
	const location = useLocation();
	const disabledInput = createMemo(() => !authState().loaded || authState().user !== undefined || googleLoading());

	const handleContinueWithGoogleBtnClick = async () => {
		setGoogleLoading(true);
		await googleSignin()
			.then((userCredential) => {
				navigate(location.query.to ?? "/");
			})
			.catch((reason) => {
				let message: string | undefined = "Something went wrong";
				if (reason instanceof FirebaseError) {
					if (reason.code === AuthErrorCodes.POPUP_CLOSED_BY_USER) message = undefined;
					else if (reason.code === AuthErrorCodes.POPUP_BLOCKED) message = "Popup blocked.";
					else if (reason.code === AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER) message = "Too many attempts. Please try again later.";
				} else if (reason instanceof Error) message = reason.message;
				setError(message);
			});
		setGoogleLoading(false);
	};

	if (authState().loaded && authState().user) {
		return <Navigate href={location.query.to ?? "/"} />;
	}

	return (
		<div class='min-h-screen flex justify-center items-center flex-col py-2'>
			{/* Logo + Heading */}
			<div class='text-center'>
				<Logo />
				<h2 class='font-semibold text-lg pt-3'>Sign in with your account</h2>
			</div>

			{/* Form */}
			<div class='card rounded-md shadow-xl mt-6 sm:mx-auto sm:w-full sm:max-w-sm bg-base-100'>
				<div class='card-body'>
					<form class='space-y-6'>
						{error() !== undefined && (
							<Alert
								type='error'
								class='mb-2'>
								{error()}
							</Alert>
						)}

						<Input
							label='Email address'
							id='email'
							type='email'
							name='email'
							autocomplete='email'
							required
							disabled={disabledInput()}
						/>

						<Input
							label='Password'
							id='password'
							type='password'
							name='password'
							autocomplete='password'
							required
							disabled={disabledInput()}
						/>

						<div>
							<button
								type='submit'
								class='btn btn-primary w-full shadow-sm text-white'
								disabled={disabledInput()}>
								Sign in
							</button>
						</div>
					</form>

					{/* Divider */}
					<div class='divider'>or</div>

					<ContinueWithGoogleButton
						onClick={handleContinueWithGoogleBtnClick}
						class='mb-4'
						disabled={disabledInput()}
						loading={googleLoading()}
					/>

					<Alert type='info'>
						<span class='font-medium'>Please note!</span> Only <span class='font-medium'>@kiit.ac.in</span> google accounts are supported.
					</Alert>
				</div>
			</div>
		</div>
	);
}
