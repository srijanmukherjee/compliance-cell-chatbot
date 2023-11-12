import { Table } from "@tanstack/react-table"
import MessageTableFacetedFilter from "./message-table-faceted-filter"
import { MessageState } from "@/models/message"
import { Cross2Icon } from "@radix-ui/react-icons"
import { Button } from "../button"
import MessageTableViewOptions from "./message-table-view-options"
import { useEffect, useMemo, useState } from "react"

interface Props<TData> {
	table: Table<TData>
}

function generateUniqueOptions<TData>(table: Table<TData>, columnId: string) {
	const valueSet = new Set<any>()
	table.getCoreRowModel().rows.forEach((row) => {
		valueSet.add(row.getValue(columnId))
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

export default function MessageTableToolbar<TData>({ table }: Props<TData>) {
	const [uniqueTagOptions, setUniqueTagOptions] = useState<any[]>([])
	const isFiltered = table.getState().columnFilters.length > 0

	useEffect(() => {
		setUniqueTagOptions(generateUniqueOptions(table, "tag"))
	}, [table])

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
