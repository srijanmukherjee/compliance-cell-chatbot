import { Component, JSX } from "solid-js";

interface Props extends JSX.HTMLAttributes<HTMLDivElement> {
	size?: 2 | 4 | 8;
}

const Spinner: Component<Props> = ({ size = 4, class: className, ...props }) => (
	<div
		class={
			`inline-block h-${size} w-${size} animate-spin rounded-full border-${
				size / 2
			} border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] ` + className
		}
		{...props}
		role='status'>
		<span class='!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]'>Loading...</span>
	</div>
);

export default Spinner;
