import { Component, JSX } from "solid-js";

interface Props extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
	loading?: boolean;
}

const ContinueWithGoogleButton: Component<Props> = (props) => {
	const { class: className, ...buttonProps } = props;
	return (
		<button
			aria-label='Continue with google'
			role='button'
			class={"btn py-3.5 px-4 rounded-lg flex items-center w-full " + className}
			{...buttonProps}
			disabled={props.disabled}>
			<img
				src='https://tuk-cdn.s3.amazonaws.com/can-uploader/sign_in-svg2.svg'
				alt='google'
				class={props.disabled ? "opacity-50" : ""}
			/>
			<p class='text-sm font-medium ml-4 text-left flex-1'>Continue with Google</p>
			{props.loading === true && <span class='loading loading-spinner loading-sm' />}
		</button>
	);
};

export default ContinueWithGoogleButton;
