import { ReactNode } from "react"

interface Props {
	count: number
	title: string
	icon?: ReactNode
	hint?: string
}

const locale = typeof window === "undefined" ? "en" : navigator.language

const formatter = Intl.NumberFormat(locale, {
	notation: "compact"
})

export default function CountCard({ count, title, icon, hint }: Props) {
	return (
		<div
			className="flex px-4 py-6 border rounded-md items-center gap-10"
			title={hint}>
			{icon}
			<div className="flex flex-col gap-4 items-end">
				<div className="text-md text-zinc-400 select-none">{title}</div>
				<div className="text-2xl font-semibold">
					{formatter.format(count)}
				</div>
			</div>
		</div>
	)
}
