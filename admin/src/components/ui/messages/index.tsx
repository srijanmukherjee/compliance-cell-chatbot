import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable
} from "@tanstack/react-table"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "../table"
import MessageTableBody from "./message-table-body"
import { useEffect, useState } from "react"
import MessageTablePagination from "./message-table-pagination"
import MessageTableToolbar from "./message-table-toolbar"
import Message from "@/models/message"

const PREVIEW_PAGE_SIZE = 3

interface Props<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	loading?: boolean
	preview?: boolean
}

export default function MessagesTable<TValue>({
	columns,
	data,
	loading = false,
	preview = false
}: Props<Message, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([
		{
			id: "created_on",
			desc: true
		}
	])
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
		{}
	)

	const table = useReactTable({
		data,
		columns,
		enableRowSelection: true,
		state: {
			sorting,
			columnVisibility,
			columnFilters
		},
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getFilteredRowModel: getFilteredRowModel()
	})

	useEffect(() => {
		if (preview) {
			table.setPageSize(PREVIEW_PAGE_SIZE)
			table.setPageIndex(0)
		}
	}, [preview, table])

	return (
		<div className="space-y-4">
			{!preview && <MessageTableToolbar table={table} data={data} />}
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef
														.header,
													header.getContext()
											  )}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						<MessageTableBody
							table={table}
							columns={columns}
							loading={loading}
						/>
					</TableBody>
				</Table>
			</div>
			{!preview && <MessageTablePagination table={table} />}
		</div>
	)
}
