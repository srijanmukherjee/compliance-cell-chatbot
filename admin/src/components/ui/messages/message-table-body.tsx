import { Loader2 } from "lucide-react"
import { TableCell, TableRow } from "../table"
import { ColumnDef, flexRender, Table as TableDef } from "@tanstack/react-table"

interface Props<TData, TValue> {
	table: TableDef<TData>
	columns: ColumnDef<TData, TValue>[]
	loading?: boolean
}

export default function MessageTableBody<TData, TValue>({
	table,
	columns,
	loading = false
}: Props<TData, TValue>) {
	if (loading) {
		return (
			<TableRow>
				<TableCell
					colSpan={columns.length}
					className="h-24 text-center">
					<Loader2 className="animate-spin mx-auto" />
				</TableCell>
			</TableRow>
		)
	}

	if (!table.getRowModel().rows?.length) {
		return (
			<TableRow>
				<TableCell
					colSpan={columns.length}
					className="h-24 text-center">
					No results.
				</TableCell>
			</TableRow>
		)
	}

	return table.getRowModel().rows.map((row) => (
		<TableRow key={row.id}>
			{row.getVisibleCells().map((cell) => (
				<TableCell key={cell.id}>
					{flexRender(cell.column.columnDef.cell, cell.getContext())}
				</TableCell>
			))}
		</TableRow>
	))
}
