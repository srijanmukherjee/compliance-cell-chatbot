import Alert from "@/components/Alert";
import Input from "@/components/Input";
import Logo from "@/components/Logo";
import { Profile } from "@/model/profile";
import { updateProfile } from "@/service/profile";
import { authState } from "@/store/authStore";
import { Navigate, useNavigate } from "@solidjs/router";
import { FirestoreError } from "firebase/firestore";
import { Component, createEffect, createSignal } from "solid-js";

interface FormError {
	firstName?: string;
	lastName?: string;
}

const OnboardingPage: Component = () => {
	const { user, profile } = authState();

	if (user === undefined) return null;
	if (profile !== undefined) {
		return <Navigate href='/' />;
	}

	const [error, setError] = createSignal<string>();
	const [isDirty, setIsDirty] = createSignal<boolean>(false);
	const [formError, setFormError] = createSignal<FormError>({});
	const [firstName, setFirstName] = createSignal(user.displayName?.split(" ")[0] ?? "");
	const [branch, setBranch] = createSignal("cse");
	const [semester, setSemester] = createSignal(1);
	const [lastName, setLastName] = createSignal(user.displayName?.substring(user.displayName.indexOf(" ") + 1) ?? "");
	const [disabledInput, setDisabledInput] = createSignal(false);
	const [loading, setLoading] = createSignal(false);
	const navigate = useNavigate();

	const handleFormSubmit = async (event: any) => {
		event.preventDefault();

		const profile: Profile = {
			firstName: firstName(),
			lastName: lastName(),
			branch: branch(),
			semester: semester(),
		};

		setDisabledInput(true);
		setLoading(true);
		setError(undefined);

		try {
			await updateProfile(user, profile);
			navigate("/");
		} catch (error) {
			let message: string = "Something went wrong";
			if (error instanceof FirestoreError) {
				if (error.code === "permission-denied") {
					message = "Permission denied";
				}
			}
			setError(message);
			setDisabledInput(false);
		}

		setLoading(false);
	};

	createEffect(() => {
		setFormError({});
		setIsDirty(false);

		if (firstName().trim().length === 0) {
			setFormError((prev) => ({ ...prev, firstName: "First name is empty" }));
			setIsDirty(true);
		}

		if (lastName().trim().length === 0) {
			setFormError((prev) => ({ ...prev, lastName: "Last name is empty" }));
			setIsDirty(true);
		}
	});

	return (
		<div class='min-h-screen flex justify-center items-center flex-col py-2'>
			{/* Logo + Heading */}
			<div class='text-center'>
				<Logo />
				<h2 class='font-semibold text-3xl pt-3'>Complete your profile</h2>
			</div>

			{/* Form */}
			<div class='card rounded-md shadow-sm py-10 px-8 mt-10 sm:mx-auto sm:w-full sm:max-w-md bg-base-100'>
				<form
					class='space-y-6'
					onSubmit={handleFormSubmit}>
					<div class='flex justify-center'>
						{user.photoURL === null ? (
							<div class='avatar placeholder'>
								<div class='bg-neutral-focus text-neutral-content rounded-full w-24'>
									<span class='text-3xl'>{user.displayName?.split(" ").reverse()[0].charAt(0).toUpperCase() ?? "P"}</span>
								</div>
							</div>
						) : (
							<div class='avatar'>
								<div class='w-24 rounded-full'>
									<img
										src={user.photoURL}
										alt='user photo'
									/>
								</div>
							</div>
						)}
					</div>

					{error() !== undefined && (
						<Alert
							type='error'
							class='my-2'>
							{error()}
						</Alert>
					)}

					<Input
						label='Email address'
						id='email'
						type='email'
						disabled={true}
						value={user!.email ?? "not provided"}
					/>

					<div class='flex sm:space-x-2 space-y-6 sm:space-y-0 sm:flex-row flex-col'>
						<Input
							label='First name'
							id='fname'
							name='fname'
							type='text'
							disabled={disabledInput()}
							onChange={(event) => setFirstName(event.currentTarget.value)}
							value={firstName()}
							spellcheck={false}
							error={formError().firstName}
							autocomplete='off'
						/>
						<Input
							label='Last name'
							id='lname'
							name='lname'
							type='text'
							disabled={disabledInput()}
							value={lastName()}
							onChange={(event) => setLastName(event.currentTarget.value)}
							spellcheck={false}
							error={formError().lastName}
							autocomplete='off'
						/>
					</div>

					<div>
						<label
							class='block text-xs font-medium leading-6 '
							for='branch'>
							Branch
						</label>
						<select
							class='select select-bordered w-full'
							value={branch()}
							onSelect={(event) => setBranch(event.currentTarget.value)}
							id='branch'>
							<option value='cse'>Computer science and Engineering</option>
							<option value='ece'>Electronics and communication engineering</option>
						</select>
					</div>

					<div>
						<label
							class='block text-xs font-medium leading-6 '
							for='semester'>
							Semester
						</label>
						<select
							class='select select-bordered w-full'
							value={semester()}
							onChange={(event) => setSemester(parseInt(event.currentTarget.value))}
							id='semester'>
							<option value='1'>1st</option>
							<option value='2'>2nd</option>
							<option value='3'>3rd</option>
							<option value='4'>4th</option>
							<option value='5'>5th</option>
							<option value='6'>6th</option>
							<option value='7'>7th</option>
							<option value='8'>8th</option>
						</select>
					</div>

					<div>
						<button
							type='submit'
							class='btn btn-primary w-full flex rounded-md text-white shadow-sm'
							disabled={disabledInput() || isDirty() || loading()}>
							{loading() && <span class='loading loading-sm mr-1' />}
							Continue
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default OnboardingPage;
