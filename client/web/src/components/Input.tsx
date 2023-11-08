import { Component, JSX } from "solid-js";

interface Props extends JSX.InputHTMLAttributes<HTMLInputElement> {
	label: string;
	error?: string;
}

const Input: Component<Props> = (props) => {
	const { label, class: className, ...inputProps } = props;
	return (
		<div>
			<label
				class='block text-xs font-medium leading-6 '
				for={props.id}>
				{label}
			</label>
			<div class='pt-1'>
				<input
					class={`input input-md input-bordered block w-full rounded-md focus:outline-none ${props.error ? "input-error" : null} ${className}`}
					{...inputProps}
					disabled={props.disabled}
				/>

				{props.error && <span class='text-xs text-error'>{props.error}</span>}
			</div>
		</div>
	);
};

export default Input;
