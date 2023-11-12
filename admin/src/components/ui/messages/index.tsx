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
import { useState } from "react"
import MessageTablePagination from "./message-table-pagination"
import MessageTableToolbar from "./message-table-toolbar"

interface Props<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	loading?: boolean
}

export default function MessagesTable<TData, TValue>({
	columns,
	data,
	loading = false
}: Props<TData, TValue>) {
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

	return (
		<div className="space-y-4">
			<MessageTableToolbar table={table} />
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
			<MessageTablePagination table={table} />
		</div>
	)
}
