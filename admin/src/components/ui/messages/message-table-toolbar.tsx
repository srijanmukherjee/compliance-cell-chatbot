import { Row, Table } from "@tanstack/react-table"
import MessageTableFacetedFilter from "./message-table-faceted-filter"
import Message, { MessageState } from "@/models/message"
import { Cross2Icon } from "@radix-ui/react-icons"
import { Button } from "../button"
import MessageTableViewOptions from "./message-table-view-options"
import { useEffect, useMemo, useState } from "react"

interface Props {
	table: Table<Message>
	data: Message[]
}

function generateUniqueOptions(rows: Message[], columnId: string) {
	const valueSet = new Set<any>()
	rows.forEach((row: Message) => {
		valueSet.add((row as any)[columnId])
	})

	const options: any[] = []

	valueSet.forEach((value) => {
		options.push({
			value: value.toString(),
			label: value.toString()
		})
	})

	return options
}

export default function MessageTableToolbar({ table, data }: Props) {
	const [uniqueTagOptions, setUniqueTagOptions] = useState<any[]>([])
	const isFiltered = table.getState().columnFilters.length > 0

	useEffect(() => {
		setUniqueTagOptions(generateUniqueOptions(data, "tag"))
	}, [data])

	return (
		<div className="flex items-center justify-between">
			<div>
				{table.getColumn("state") && (
					<MessageTableFacetedFilter
						column={table.getColumn("state")}
						title="State"
						options={[
							{
								value: MessageState.REPLIED,
								label: "Replied"
							},
							{
								value: MessageState.BELOW_THRESHOLD,
								label: "Below threshold"
							},
							{
								value: MessageState.INTENT_NOT_FOUND,
								label: "Intent not found"
							}
						]}
					/>
				)}
				{table.getColumn("tag") && (
					<MessageTableFacetedFilter
						column={table.getColumn("tag")}
						title="Tag"
						options={uniqueTagOptions}
					/>
				)}
				{isFiltered && (
					<Button
						variant="ghost"
						onClick={() => table.resetColumnFilters()}
						className="h-8 px-2 lg:px-3">
						Reset
						<Cross2Icon className="ml-2 h-4 w-4" />
					</Button>
				)}
			</div>
			<MessageTableViewOptions table={table} />
		</div>
	)
}
