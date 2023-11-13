"use client"

import ExitTransition from "@/components/exit-transition"
import { auth } from "@/config/firebase"
import { authAtom, loggingInAtom } from "@/state"
import { Provider, useAtom } from "jotai"
import { Loader } from "lucide-react"
import { useRouter } from "next/navigation"
import { PropsWithChildren, useEffect, useState } from "react"

export default function Initializer({ children }: PropsWithChildren) {
	const [{ loaded }, setAuth] = useAtom(authAtom)
	const [isLoaderVisible, setIsLoaderVisible] = useState<boolean>(true)
	const [loggingIn] = useAtom(loggingInAtom)
	const router = useRouter()

	// authenticate
	useEffect(() => {
		if (loggingIn) return

		setAuth({
			loaded: false,
			user: null
		})

		const unsubscribe = auth.onAuthStateChanged((user) => {
			if (user == null && window.location.pathname !== "/login") {
				router.replace("/login")
			}

			if (user !== null && window.location.pathname === "/login") {
				router.replace("/")
			}

			setAuth({
				loaded: true,
				user
			})
		})

		return () => {
			unsubscribe()
		}
	}, [setAuth, router, loggingIn])

	if (isLoaderVisible) {
		return (
			<ExitTransition
				shouldExit={loaded}
				onExit={() => setIsLoaderVisible(false)}>
				<div className="bg-secondary h-screen p-2 flex items-center justify-center">
					<Loader
						className="animate-spin stroke-primary"
						size="2rem"
					/>
				</div>
			</ExitTransition>
		)
	}

	return children
}

export function InitializerWithProvider({ children }: PropsWithChildren) {
	return (
		<Provider>
			<Initializer>{children}</Initializer>
		</Provider>
	)
}
