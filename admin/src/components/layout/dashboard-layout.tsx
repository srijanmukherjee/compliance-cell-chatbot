"use client"

import { PropsWithChildren, useMemo, useState } from "react"

import { IconDeviceNintendo, IconMenu2 } from "@tabler/icons-react"
import { Button } from "../ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { cn } from "@/lib/utils"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "../ui/dropdown-menu"
import {
	Github,
	LayoutDashboardIcon,
	List,
	LogOut,
	MessageCircle,
	Package,
	User
} from "lucide-react"
import { ThemeProvider } from "../provider/theme-provider"
import ThemeToggleButton from "../ui/theme-toggle-button"
import Link from "next/link"
import { usePathname } from "next/navigation"

const links = [
	{
		href: "/",
		title: "Dashboard",
		icon: <LayoutDashboardIcon />
	},
	{
		href: "/intents",
		title: "Intents",
		icon: <List />
	},
	{
		href: "/messages",
		title: "Messages",
		icon: <MessageCircle />
	},
	{
		href: "/models",
		title: "Model",
		icon: <Package />
	}
]

export default function DashboardLayout({ children }: PropsWithChildren) {
	const [sidenavOn, setSidenavOn] = useState<boolean>(true)
	const pathname = usePathname()
	const activeLink = useMemo(
		() => links.find(({ href }) => href === pathname),
		[pathname]
	)

	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange>
			<div className="min-h-screen flex">
				<nav
					className={cn(
						"transition-all duration-150 h-screen sticky top-0 p-4 pr-0",
						sidenavOn
							? "w-72"
							: "w-0 p-0 opacity-0 pointer-events-none"
					)}>
					<div className="bg-secondary h-full rounded-md sticky top-0 text-foreground p-4">
						<section className="flex text-2xl justify-center items-center py-4">
							<IconDeviceNintendo className="mr-2" size="1.5em" />
							<h1 className="capitalize">Chatbot</h1>
						</section>
						<section className="py-4 flex flex-col gap-2">
							{links.map(({ href, title, icon }, index) => (
								<Link href={href} key={index}>
									<Button
										className={cn(
											"w-full justify-start text-foreground gap-2",
											pathname === href
												? "text-primary-foreground"
												: "hover:bg-background"
										)}
										variant={
											pathname === href
												? "default"
												: "secondary"
										}>
										{icon}
										{title}
									</Button>
								</Link>
							))}
						</section>
					</div>
				</nav>
				<main
					className={cn(
						"flex-1 min-h-screen overflow-y-auto transition-all z-0 flex flex-col"
					)}>
					<nav className="p-4 pb-0 text-foreground sticky top-0 bg-background">
						<div className="bg-secondary rounded-md flex items-center p-4">
							<Button
								className="bg-transparent text-foreground"
								variant="secondary"
								onClick={() => setSidenavOn((b) => !b)}>
								<IconMenu2 />
							</Button>
							{activeLink && <h2>{activeLink.title}</h2>}
							<div className="flex-1 flex items-center justify-end gap-4">
								<ThemeToggleButton />
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="secondary"
											className="p-0 select-none">
											<Avatar>
												<AvatarImage src="https://github.com/shadcn.png" />
												<AvatarFallback>
													CN
												</AvatarFallback>
											</Avatar>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										side="bottom"
										sideOffset={10}
										align="end"
										className="w-48 shadow-lg">
										<DropdownMenuLabel>
											My Account
										</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuGroup>
											<DropdownMenuItem>
												<User className="mr-2 h-4 w-4 inline-block" />
												<span>Profile</span>
											</DropdownMenuItem>
										</DropdownMenuGroup>
										<DropdownMenuSeparator />
										<DropdownMenuItem>
											<LogOut className="mr-2 h-4 w-4" />
											<span>Log out</span>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</div>
					</nav>
					<div className={cn("flex-1 p-4")}>{children}</div>
				</main>
			</div>
		</ThemeProvider>
	)
}
