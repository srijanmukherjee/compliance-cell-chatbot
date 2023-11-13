"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { auth } from "@/config/firebase"
import { authAtom, loggingInAtom } from "@/state"
import { FirebaseError } from "firebase/app"
import { AuthErrorCodes, signInWithEmailAndPassword } from "firebase/auth"
import { useAtom } from "jotai"
import { AlertCircle, Loader2 } from "lucide-react"
import { useState } from "react"

export default function Login() {
	const [email, setEmail] = useState<string>("")
	const [password, setPassword] = useState<string>("")
	const [error, setError] = useState<string>()
	const [loggingIn, setLoggingIn] = useAtom(loggingInAtom)
	const [authState] = useAtom(authAtom)

	const login = async () => {
		setLoggingIn(true)
		setError(undefined)

		await signInWithEmailAndPassword(auth, email, password).catch(
			(reason) => {
				if (reason instanceof FirebaseError) {
					let message = "Something went wrong"

					switch (reason.code) {
						case AuthErrorCodes.NETWORK_REQUEST_FAILED:
							message =
								"Couldn't reach out to the authentication server"
							break
						case "auth/invalid-login-credentials":
						case AuthErrorCodes.INVALID_PASSWORD:
						case AuthErrorCodes.USER_DELETED:
							message = "Invalid email or password"
							break
					}

					setError(message)
				} else {
					setError("Something terrible happened!")
					console.error(reason)
				}
			}
		)

		setLoggingIn(false)
	}

	return (
		<div className="bg-secondary min-h-screen flex items-center justify-center p-4">
			<Card className="w-96">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl">Login</CardTitle>
					<CardDescription>
						Welcome back administrator
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-4">
					{error && (
						<Alert variant="destructive">
							<AlertCircle className="h-4 w-4" />
							<AlertTitle>Error</AlertTitle>
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}
					<div className="grid gap-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="you@example.com"
							value={email}
							onChange={(ev) => setEmail(ev.currentTarget.value)}
							autoFocus
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							type="password"
							value={password}
							onChange={(ev) =>
								setPassword(ev.currentTarget.value)
							}
						/>
					</div>
				</CardContent>
				<CardFooter>
					<Button
						className="w-full gap-4"
						disabled={
							email.trim().length === 0 ||
							password.length === 0 ||
							authState.user !== null ||
							!authState.loaded ||
							loggingIn
						}
						onClick={login}>
						{loggingIn && (
							<Loader2 size="1rem" className="animate-spin" />
						)}
						{authState.user === null ? "Login" : "Logged in"}
					</Button>
				</CardFooter>
			</Card>
		</div>
	)
}
