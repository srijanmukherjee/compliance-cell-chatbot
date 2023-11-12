"use client"

import { useMemo, useState } from "react"
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger
} from "../collapsible"
import Intent from "@/models/intent"
import { Button } from "../button"
import { ChevronsUpDown, Trash2 } from "lucide-react"

import classes from "./style.module.css"
import { Skeleton } from "../skeleton"
import { cn } from "@/lib/utils"

interface Props {
	intent: Intent
	defaultOpen?: boolean
	onDelete?: (intent: Intent) => void
}

export default function IntentItem({
	intent,
	onDelete,
	defaultOpen = false
}: Props) {
	const [isOpen, setIsOpen] = useState(defaultOpen)

	return (
		<Collapsible
			open={isOpen}
			onOpenChange={setIsOpen}
			className={cn(
				"transition-all shadow-lg rounded-lg overflow-hidden",
				classes.collapsible
			)}
			suppressHydrationWarning>
			<div className="flex items-center justify-between space-x-4 bg-secondary px-4 py-2">
				<h4 className="text-sm font-semibold">{intent.tag}</h4>
				<div className="flex items-center gap-2">
					{onDelete && (
						<Button
							variant="secondary"
							onClick={() => onDelete(intent)}
							className={cn(
								classes.deleteButton,
								"text-destructive dark:text-red-500 hover:bg-destructive hover:text-destructive-foreground dark:hover:bg-red-500 dark:hover:text-destructive-foreground"
							)}
							size="icon">
							<Trash2 size="1rem" />
						</Button>
					)}
					<CollapsibleTrigger asChild>
						<Button variant="ghost" size="sm" className="w-9 p-0">
							<ChevronsUpDown className="h-4 w-4" />
							<span className="sr-only">Toggle</span>
						</Button>
					</CollapsibleTrigger>
				</div>
			</div>

			<CollapsibleContent
				style={{
					backgroundColor: "hsl(var(--secondary) / 60%)"
				}}>
				<div className="p-4 flex flex-col gap-4">
					<section>
						<header>
							<h3 className="font-semibold">Patterns</h3>
						</header>
						<ol className={classes.list}>
							{intent.patterns.map((pattern, index) => (
								<li key={index} data-index={index}>
									{pattern}
								</li>
							))}
						</ol>
					</section>

					<section>
						<header>
							<h3 className="font-semibold">Responses</h3>
						</header>
						<ol className={classes.list}>
							{intent.responses.map((response, index) => (
								<li key={index} data-index={index}>
									{response}
								</li>
							))}
						</ol>
					</section>
				</div>
			</CollapsibleContent>
		</Collapsible>
	)
}

export function IntentItemSkeleton() {
	const tagWidth = useMemo(() => 3 * 50, [])
	const patterns = useMemo(() => new Array(3).fill(0), [])
	const responses = useMemo(() => new Array(2).fill(0), [])
	return (
		<Collapsible
			open={true}
			className="transition-all shadow-lg rounded-lg overflow-hidden"
			suppressHydrationWarning>
			<div className="flex items-center justify-between space-x-4 bg-secondary px-4 py-2">
				<Skeleton
					className={`h-[20px] bg-background`}
					style={{ width: tagWidth }}
				/>
				<Button variant="ghost" size="sm" className="w-9 p-0">
					<ChevronsUpDown className="h-4 w-4" />
					<span className="sr-only">Toggle</span>
				</Button>
			</div>

			<CollapsibleContent
				style={{
					backgroundColor: "hsl(var(--secondary) / 60%)"
				}}>
				<div className="p-4 flex flex-col gap-4">
					<section>
						<header>
							<h3 className="font-semibold">Patterns</h3>
						</header>
						<ul className={classes.list}>
							{patterns.map((_, index) => (
								<li key={index} data-index={index}>
									<Skeleton className="h-[1.5rem]" />
								</li>
							))}
						</ul>
					</section>

					<section>
						<header>
							<h3 className="font-semibold">Responses</h3>
						</header>
						<ul className={classes.list}>
							{responses.map((_, index) => (
								<li key={index} data-index={index}>
									<Skeleton className="h-[1.5rem]" />
								</li>
							))}
						</ul>
					</section>
				</div>
			</CollapsibleContent>
		</Collapsible>
	)
}

export function IntentListSkeleton() {
	return (
		<div>
			<IntentItemSkeleton />
			<IntentItemSkeleton />
			<IntentItemSkeleton />
			<IntentItemSkeleton />
		</div>
	)
}

export function IntentList({
	intents,
	loading,
	onDelete
}: {
	intents?: Intent[]
	loading: boolean
	onDelete?: (intent: Intent) => void
}) {
	if (loading) {
		return <IntentListSkeleton />
	}
	return intents?.map((intent, index) => (
		<IntentItem
			intent={intent}
			key={index}
			defaultOpen
			onDelete={onDelete}
		/>
	))
}