"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useWatchResource } from "@/hooks/useResource"
import { TrainingStatus } from "@/models/chatbot-model"
import ModelService from "@/services/model-service"
import { DownloadCloud, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import dayjs from "dayjs"
import Link from "next/link"
import { storage } from "@/config/firebase"
import { getDownloadURL, ref } from "firebase/storage"

function reprModelStatus(status: TrainingStatus) {
	if (status === TrainingStatus.INIT) return "Initialized"
	return status
}

export default function Models() {
	const [loading, error, model] = useWatchResource(
		ModelService.watchFetchModel
	)

	const [downloadUrl, setDownloadUrl] = useState<string | undefined>()

	useEffect(() => {
		if (model === undefined || model.storageLocation === null) return
		setDownloadUrl(undefined)
		const modelRef = ref(storage, model.storageLocation)
		getDownloadURL(modelRef).then((url) => {
			setDownloadUrl(url)
		})
	}, [model])

	// TODO: handle error
	useEffect(() => {
		if (error) console.error(error)
	}, [error])

	if (loading) {
		return (
			<div className="h-full grid place-items-center">
				<Loader2 className="animate-spin" />
			</div>
		)
	}

	if (model === undefined) {
		return (
			<div className="h-full grid place-items-center">
				<Button
					className="w-48 h-48 aspect-square border-dashed border-2 border-primary bg-transparent select-none"
					variant="secondary"
					onClick={() => ModelService.trainModel()}>
					Train Model
				</Button>
			</div>
		)
	}

	return (
		<div className="grid gap-4">
			<div className="py-4 flex gap-2">
				<Button
					className="select-none"
					onClick={() => ModelService.trainModel()}
					disabled={
						model.status !== TrainingStatus.TRAINED &&
						model.status !== TrainingStatus.ERROR
					}>
					Train Model
				</Button>
				<Button
					variant="outline"
					className="select-none p-0"
					disabled={
						model.status !== TrainingStatus.TRAINED &&
						downloadUrl !== undefined
					}>
					<Link href={downloadUrl ?? "#"} className="flex gap-4 p-4">
						<DownloadCloud size="1.3rem" />
						Download Model
					</Link>
				</Button>
			</div>
			<div className="flex gap-2 items-center">
				<Label className="font-bold">Status:</Label>
				<span className="capitalize">
					{reprModelStatus(model.status)}
				</span>
			</div>
			<div className="flex gap-2 items-center">
				<Label className="font-bold">Trained on:</Label>
				<span className="capitalize">
					{model.trainedOn
						? dayjs(model.trainedOn.toDate()).format(
								"YYYY-MM-DD HH:mm:ss"
						  )
						: "not set"}
				</span>
			</div>
			<div className="grid gap-2">
				<Label className="font-bold">Build log</Label>
				<pre
					className="p-4 rounded-sm whitespace-pre-wrap break-words"
					style={{ backgroundColor: "hsl(var(--secondary) / 60%)" }}>
					{model.buildLog || "-- no build log --"}
				</pre>
			</div>
		</div>
	)
}
