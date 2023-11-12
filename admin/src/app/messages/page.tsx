"use client"

import MessagesTable from "@/components/ui/messages"
import { columns } from "@/components/ui/messages/columns"
import { useWatchResource } from "@/hooks/useResource"
import MessageService from "@/services/message-service"

export default function Messages() {
	const [loading, error, messages] = useWatchResource(
		MessageService.watchFetchAll
	)

	return (
		<div>
			<MessagesTable
				data={messages ?? []}
				loading={loading}
				columns={columns}
			/>
		</div>
	)
}
