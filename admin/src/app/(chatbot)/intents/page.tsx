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
import {
	IconFileExport,
	IconPackageExport,
	IconTableExport
} from "@tabler/icons-react"

const SEARCH_DEBOUNCE_TIME = 500

export default function Intents() {
	const { toast } = useToast()
	const [loading, error, intents] = useWatchResource(
		IntentService.watchFetchAll
	)

	const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false)
	const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false)
	const [editIntent, setEditIntent] = useState<Intent>()
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
		IntentService.insertOne(intent).finally(() => {
			setCreateDialogOpen(false)
			if (editIntent) {
				setEditDialogOpen(false)
				setEditIntent(undefined)
			}
		})
	}

	const onDelete = (intent: Intent) => {
		IntentService.deleteOne(intent)
	}

	const onEdit = (intent: Intent) => {
		setEditIntent(intent)
		setEditDialogOpen(true)
	}

	const exportIntents = () => {
		const data = {
			intents
		}

		const content = JSON.stringify(data, null, 4)
		const blob = new Blob([content], {
			type: "application/json"
		})
		const url = URL.createObjectURL(blob)
		const aTag = document.createElement("a")
		aTag.style.display = "none"
		document.body.appendChild(aTag)
		aTag.href = url
		aTag.download = "intents.json"
		aTag.click()
		aTag.remove()
		URL.revokeObjectURL(url)
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
			<div className="flex gap-4 py-4 flex-wrap">
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
					}}
					disabled={loading}>
					<Import className="mr-2" size="1.2rem" />
					Import
				</Button>
				<Button
					variant="outline"
					onClick={exportIntents}
					disabled={loading}>
					<IconFileExport className="mr-2" size="1.2rem" />
					Export
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
					onEdit={onEdit}
				/>
			</div>
			<CreateIntentDialog
				open={createDialogOpen}
				onOpenChange={setCreateDialogOpen}
				onSubmit={createIntent}
			/>
			<CreateIntentDialog
				open={editDialogOpen}
				onOpenChange={setEditDialogOpen}
				onSubmit={createIntent}
				editMode
				editIntent={editIntent}
			/>
		</section>
	)
}
