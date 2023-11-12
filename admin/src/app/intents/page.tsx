"use client"

import { Button } from "@/components/ui/button"
import CreateIntentDialog from "@/components/ui/intent/create-intent-dialog"
import { Input } from "@/components/ui/input"
import { IntentList } from "@/components/ui/intent"
import { useWatchResource } from "@/hooks/useResource"
import IntentService from "@/services/intent-service"
import { Import, Plus } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import Intent from "@/models/intent"
import { useToast } from "@/components/ui/use-toast"

const SEARCH_DEBOUNCE_TIME = 500

export default function Intents() {
	const { toast } = useToast()
	const [loading, error, intents] = useWatchResource(
		IntentService.watchFetchAll
	)

	const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false)
	const [searchText, setSearchText] = useState<string>("")
	const [data, setData] = useState<Intent[]>([])
	const debounceTimerRef = useRef<NodeJS.Timeout | null>()

	const createIntent = (
		tag: string,
		patterns: string[],
		responses: string[]
	) => {
		const intent: Intent = {
			tag,
			patterns,
			responses
		}
		IntentService.insertOne(intent).finally(() =>
			setCreateDialogOpen(false)
		)
	}

	const onDelete = (intent: Intent) => {
		IntentService.deleteOne(intent)
	}

	useEffect(() => {
		if (!intents) return
		if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
		if (searchText === "") setData(intents)
		else {
			const query = searchText.trim()
			debounceTimerRef.current = setTimeout(() => {
				setData(
					intents.filter(
						({ tag, patterns, responses }) =>
							tag.toLowerCase().includes(query) ||
							patterns.find((p) =>
								p.toLowerCase().includes(query)
							) !== undefined ||
							responses.find((r) =>
								r.toLowerCase().includes(query)
							) !== undefined
					)
				)
			}, SEARCH_DEBOUNCE_TIME)
		}
		return () => {
			if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
		}
	}, [searchText, intents])

	return (
		<section className="flex flex-col gap-4">
			<div className="flex gap-4 py-4">
				<Button onClick={() => setCreateDialogOpen(true)}>
					<Plus className="mr-2" />
					Create
				</Button>
				<Button
					variant="outline"
					onClick={() => {
						toast({
							title: "Not Implemented",
							description:
								"This feature has not yet been implemented."
						})
					}}>
					<Import className="mr-2" />
					Import
				</Button>
				<Input
					placeholder="Search intents"
					type="text"
					className="w-72"
					disabled={loading}
					value={searchText}
					onChange={(event) =>
						setSearchText(event.currentTarget.value)
					}
				/>
			</div>
			<div
				className="flex flex-col gap-4"
				suppressHydrationWarning={true}>
				<IntentList
					intents={data}
					loading={loading}
					onDelete={onDelete}
				/>
			</div>
			<CreateIntentDialog
				open={createDialogOpen}
				onOpenChange={setCreateDialogOpen}
				onSubmit={createIntent}
			/>
		</section>
	)
}
