"use client"

import CountCard from "@/components/count-card"
import MessagesTable from "@/components/ui/messages"
import { columns } from "@/components/ui/messages/columns"
import { useWatchResource } from "@/hooks/useResource"
import Message from "@/models/message"
import MessageService from "@/services/message-service"
import { Activity, MessageCircle } from "lucide-react"
import { useEffect, useRef, useState } from "react"

function utc(datetime: Date) {
	return datetime.getTime() + datetime.getTimezoneOffset() * 60000
}

function getFrequency(messages: Message[]) {
	let frequency = 0
	const sortedMessages = messages.toSorted(
		(a, b) => b.created_on.toMillis() - a.created_on.toMillis()
	)
	const currentUTCTime = utc(new Date())
	for (let i = 0; i < sortedMessages.length; i++) {
		const diff = currentUTCTime - utc(sortedMessages[i].created_on.toDate())
		if (diff > 60 * 1000) break
		frequency++
	}

	return frequency
}

export default function Home() {
	const [loading, error, messages] = useWatchResource(
		MessageService.watchFetchAll
	)
	const [frequencyPerMinute, setFrequencyPerMinute] = useState<number>(0)
	const frequencyUpdateTimer = useRef<NodeJS.Timeout>()

	useEffect(() => {
		if (loading || !messages || messages.length === 0) return

		if (frequencyUpdateTimer.current)
			clearTimeout(frequencyUpdateTimer.current)

		setFrequencyPerMinute(getFrequency(messages))

		frequencyUpdateTimer.current = setTimeout(() => {
			setFrequencyPerMinute(getFrequency(messages))
		}, 60000)

		return () => {
			if (frequencyUpdateTimer.current)
				clearTimeout(frequencyUpdateTimer.current)
		}
	}, [loading, messages])

	return (
		<main className="space-y-2">
			<section>
				<header className="py-4">
					<h2 className="font-semibold text-2xl">Stats</h2>
				</header>
				<div className="flex gap-4 flex-wrap">
					<CountCard
						count={frequencyPerMinute}
						title="In the last minute"
						icon={<Activity size="4rem" />}
						hint={"Messages in the last minute"}
					/>

					<CountCard
						count={messages?.length ?? 0}
						title="Messages"
						icon={<MessageCircle size="4rem" />}
						hint={"Total number of messages"}
					/>
				</div>
			</section>

			<section>
				<header className="py-4">
					<h2 className="font-semibold text-2xl">Recent chat logs</h2>
				</header>
				<div>
					<MessagesTable
						columns={columns}
						data={messages ?? []}
						loading={loading}
						preview
					/>
				</div>
			</section>
		</main>
	)
}
