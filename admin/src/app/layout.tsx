import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import DashboardLayout from "@/components/layout/dashboard-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
	title: "Chatbot Administration",
	description: "Manage and administrate chai chatbot"
}

export default function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<DashboardLayout>{children}</DashboardLayout>
			</body>
		</html>
	)
}
