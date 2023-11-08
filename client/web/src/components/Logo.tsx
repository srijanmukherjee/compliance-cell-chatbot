import { Component, JSX } from "solid-js";

const Logo: Component<JSX.HTMLAttributes<HTMLDivElement>> = (props) => {
	return (
		<div
			class='flex items-center justify-center text-lg select-none'
			{...props}>
			<span class='bg-primary px-2 text-2xl font-bold text-white rounded-lg mr-1'>C</span>
			<span class='text-primary font-bold tracking-widest'>HAI</span>
		</div>
	);
};

export default Logo;
