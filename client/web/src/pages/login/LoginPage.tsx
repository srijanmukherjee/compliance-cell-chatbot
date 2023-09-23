import logo from "../../assets/logo.png";

export default function LoginPage() {
	return (
		<div class='min-h-screen flex justify-center items-center flex-col bg-slate-100'>
			{/* Logo + Heading */}
			<div class='text-center'>
				<img
					src={logo}
					width={48}
					height={48}
					class='inline-block mb-2'
				/>
				<h2 class='font-semibold text-lg'>
					Sign in with your <span class='text-purple-700'>chai</span> account
				</h2>
			</div>

			{/* Form */}
			<div class='bg-white rounded-md shadow-sm py-10 px-8 mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
				<form class='space-y-6'>
					<div>
						<label
							class='block text-sm font-medium leading-6 text-gray-900'
							for='email'>
							Email address
						</label>
						<div class='pt-2'>
							<input
								id='email'
								type='email'
								name='email'
								autocomplete='email'
								required
								class='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
							/>
						</div>
					</div>

					<div>
						<label
							class='block text-sm font-medium leading-6 text-gray-900'
							for='password'>
							Password
						</label>
						<div class='pt-2'>
							<input
								id='password'
								type='password'
								name='password'
								autocomplete='password'
								required
								class='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
							/>
						</div>
					</div>
					<div>
						<button
							type='submit'
							class='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
							Sign in
						</button>
					</div>
				</form>

				{/* Divider */}
				<div class='inline-flex items-center justify-center w-full'>
					<hr class='w-full h-0.5 my-8 bg-gray-200 border-0 rounded' />
					<div class='absolute px-4 -translate-x-1/2 bg-white left-1/2 text-gray-500'>or</div>
				</div>

				<button
					aria-label='Continue with google'
					role='button'
					class='focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-700 py-3.5 px-4 border rounded-lg border-gray-700 flex items-center w-full '>
					<img
						src='https://tuk-cdn.s3.amazonaws.com/can-uploader/sign_in-svg2.svg'
						alt='google'
					/>
					<p class='text-base font-medium ml-4 text-gray-700'>Continue with Google</p>
				</button>

				<div
					class='p-4 text-sm text-blue-800 rounded-lg bg-blue-50 mt-5'
					role='alert'>
					<span class='font-medium'>Please note!</span> Only <span class='font-medium'>@kiit.ac.in</span> google accounts are supported.
				</div>
			</div>
		</div>
	);
}
