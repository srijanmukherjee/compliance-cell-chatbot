import Message, { MessageState } from "@/models/message"
import { ColumnDef } from "@tanstack/react-table"
import MessageTableColumnHeader from "./message-table-column-header"
import dayjs from "dayjs"
import { Badge } from "../badge"

const today = new Date()

export const columns: ColumnDef<Message>[] = [
	{
		accessorKey: "created_on",
		accessorFn: (row, index) => {
			return row.created_on.toDate()
		},
		header: ({ column }) => (
			<MessageTableColumnHeader column={column} title="Received on" />
		),
		cell: ({ row }) => {
			const createdOn = dayjs(row.getValue("created_on"))
			if (createdOn.isSame(today, "day"))
				return createdOn.format("HH:mm:ss A")
			return createdOn.format("YYYY-MM-DD HH:mm:ss")
		}
	},
	{
		accessorKey: "uid",
		header: ({ column }) => (
			<MessageTableColumnHeader column={column} title="Uid" />
		)
	},
	{
		accessorKey: "text",
		header: ({ column }) => (
			<MessageTableColumnHeader column={column} title="Text" />
		)
	},
	{
		accessorKey: "tag",
		header: ({ column }) => (
			<MessageTableColumnHeader column={column} title="Tag" />
		),
		filterFn: (row, id, value) => value.includes(row.getValue(id))
	},
	{
		accessorKey: "probability",
		header: ({ column }) => (
			<MessageTableColumnHeader column={column} title="Probability" />
		)
	},
	{
		accessorKey: "response",
		header: ({ column }) => (
			<MessageTableColumnHeader column={column} title="Response" />
		)
	},
	{
		accessorKey: "state",
		header: ({ column }) => (
			<MessageTableColumnHeader column={column} title="State" />
		),
		cell: ({ row }) => {
			const state: MessageState = row.getValue("state")
			if (state === MessageState.REPLIED) return <Badge>Replied</Badge>
			else if (state === MessageState.BELOW_THRESHOLD)
				return <Badge variant="destructive">Below threshold</Badge>
			else if (state === MessageState.INTENT_NOT_FOUND)
				return <Badge variant="destructive">Intent not found</Badge>
			return state
		},
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id))
		}
	}
]
