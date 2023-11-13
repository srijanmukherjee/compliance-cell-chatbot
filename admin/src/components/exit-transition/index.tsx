import { cn } from "@/lib/utils"
import { PropsWithChildren, useEffect, useRef, useState } from "react"

interface Props extends PropsWithChildren {
	onExit: () => void
	shouldExit: boolean
}

export default function ExitTransition({
	onExit,
	children,
	shouldExit
}: Props) {
	const [applyExitStyle, setApplyExitStyle] = useState<boolean>(false)
	const [mounted, setMounted] = useState<boolean>(true)
	const container = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const onAnimationEnd = (event: AnimationEvent) => {
			if (event.animationName === "exit") {
				setMounted(false)
				onExit()
			}
		}

		const el = container.current

		if (shouldExit && el) {
			el.addEventListener("animationend", onAnimationEnd)
			setApplyExitStyle(true)
		}

		return () => {
			if (el) {
				el.removeEventListener("animationend", onAnimationEnd)
			}
		}
	}, [shouldExit])

	if (!mounted) return null
	return (
		<div
			className={cn(
				"fill-mode-forwards",
				applyExitStyle ? "animate-out fade-out-0 duration-1000" : null
			)}
			ref={container}>
			{children}
		</div>
	)
}
