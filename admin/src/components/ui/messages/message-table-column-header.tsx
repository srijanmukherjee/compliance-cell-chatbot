import { cn } from "@/lib/utils"
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator
} from "../dropdown-menu"
import { Column } from "@tanstack/react-table"
import {
	ArrowDownIcon,
	ArrowUpIcon,
	EyeOffIcon,
	SortAscIcon
} from "lucide-react"
import { HTMLAttributes } from "react"
import { Button } from "../button"

interface Props<TData, TValue> extends HTMLAttributes<HTMLDivElement> {
	column: Column<TData, TValue>
	title: string
}

export default function MessageTableColumnHeader<TData, TValue>({
	column,
	title,
	className
}: Props<TData, TValue>) {
	if (!column.getCanSort()) {
		return <div className={cn(className)}>{title}</div>
	}

	return (
		<div className={cn("flex items-center space-x-2", className)}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						size="sm"
						className="-ml-3 h-8 data-[state=open]:bg-accent">
						<span>{title}</span>
						{column.getIsSorted() === "desc" ? (
							<ArrowDownIcon className="ml-2 h-4 w-4" />
						) : column.getIsSorted() === "asc" ? (
							<ArrowUpIcon className="ml-2 h-4 w-4" />
						) : (
							<SortAscIcon className="ml-2 h-4 w-4" />
						)}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start">
					<DropdownMenuItem
						onClick={() => column.toggleSorting(false)}>
						<ArrowUpIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
						Asc
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => column.toggleSorting(true)}>
						<ArrowDownIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
						Desc
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={() => column.toggleVisibility(false)}>
						<EyeOffIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
						Hide
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}
