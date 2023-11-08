import { Component, For, createSignal } from "solid-js";

const HomePage: Component = () => {
	const [chat, setChat] = createSignal<{ message: string; target: "me" | "bot" }[]>([]);
	const [message, setMessage] = createSignal("");
	let chatarea: HTMLDivElement | undefined = undefined;

	const sendMessage = () => {
		if (message().length === 0) return;

		const msg = message();
		setChat((prev) => [...prev, { message: msg, target: "me" }]);

		setTimeout(() => {
			fetch("http://127.0.0.1:5000/chat", {
				method: "POST",
				body: JSON.stringify({
					message: msg,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			})
				.then((res) => res.text())
				.then((reply) => {
					setChat((prev) => [...prev, { message: reply, target: "bot" }]);

					chatarea?.scroll({
						top: chatarea.scrollHeight,
						behavior: "smooth",
					});
				});
		}, 500);

		setMessage("");
	};

	return (
		<div class='flex justify-center flex-grow'>
			<div class='flex flex-col sm:max-w-screen-lg flex-grow p-4 gap-y-6'>
				{/* Chat area */}
				<div
					class='flex-grow h-20 overflow-auto'
					ref={chatarea}>
					<div class='w-full'>
						<For each={chat()}>
							{({ message, target }) => (
								<div
									class='chat'
									classList={{
										"chat-start": target === "bot",
										"chat-end": target === "me",
									}}>
									<div
										class='chat-bubble text-white'
										classList={{
											"chat-bubble-primary": target === "me",
										}}>
										{message}
									</div>
								</div>
							)}
						</For>
					</div>
				</div>
				{/* Chat input */}
				<div class='flex gap-2'>
					<input
						class='input shadow-lg w-full'
						type='text'
						placeholder='Type your message here.'
						autofocus
						value={message()}
						onChange={(event) => setMessage(event.currentTarget.value)}
						onKeyUp={(event) => {
							if (event.key === "Enter") sendMessage();
						}}
					/>
					<button
						type='button'
						class='btn transition duration-500 ease-in-out btn-primary'
						onClick={sendMessage}>
						<span class='font-bold'>Send</span>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 20 20'
							fill='currentColor'
							class='h-6 w-6 ml-2 transform rotate-90'>
							<path d='M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z'></path>
						</svg>
					</button>
				</div>
			</div>
		</div>
	);
};

export default HomePage;
