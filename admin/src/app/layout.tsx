import "./globals.css"

import { Inter } from "next/font/google"
import { InitializerWithProvider } from "./initializer"
import { Metadata } from "next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
	title: "Chatbot Administration"
}

export default function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<InitializerWithProvider>{children}</InitializerWithProvider>
			</body>
		</html>
	)
}
