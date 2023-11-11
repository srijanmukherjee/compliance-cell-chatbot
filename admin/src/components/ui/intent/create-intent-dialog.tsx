import { Plus, Trash } from "lucide-react"
import { Button } from "../button"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from "../dialog"
import { Input } from "../input"
import { Label } from "../label"
import { useRef, useState } from "react"

import classes from "./style.module.css"
import { cn } from "@/lib/utils"

interface Props {
	open: boolean
	onOpenChange: (val: boolean) => void
	onSubmit: (tag: string, patterns: string[], responses: string[]) => void
}

export default function CreateIntentDialog({
	open,
	onOpenChange,
	onSubmit
}: Props) {
	const [tag, setTag] = useState<string>("")
	const [patterns, setPatterns] = useState<string[]>([])
	const [patternInput, setPatternInput] = useState<string>("")
	const [responses, setResponses] = useState<string[]>([])
	const [responseInput, setResponseInput] = useState<string>("")

	const addPattern = () => {
		const value = patternInput.trim()
		if (value === "") return
		setPatterns((val) => [...val, value])
		setPatternInput("")
	}

	const deletePattern = (index: number) => {
		setPatterns((values) => {
			return [...values.slice(0, index), ...values.slice(index + 1)]
		})
	}

	const addResponse = () => {
		const value = responseInput.trim()
		if (value === "") return
		setResponses((val) => [...val, value])
		setResponseInput("")
	}

	const deleteResponse = (index: number) => {
		setResponses((values) => [
			...values.slice(0, index),
			...values.slice(index + 1)
		])
	}

	return (
		<>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="max-w-3xl overflow-auto max-h-[calc(100vh-theme(margin.10))]">
					<DialogHeader>
						<DialogTitle>Create Intent</DialogTitle>
						<DialogDescription>
							Add intent for the chatbot to recognise
						</DialogDescription>
					</DialogHeader>
					<div className="flex items-center space-x-2">
						<div className="grid flex-1 gap-2">
							<Label htmlFor="tag">Tag</Label>
							<Input
								id="tag"
								placeholder="Tag"
								type="text"
								value={tag}
								onChange={(event) =>
									setTag(event.currentTarget.value)
								}
							/>
						</div>
					</div>
					<div className="flex items-center space-x-2">
						<div className="grid flex-1 gap-2">
							<Label htmlFor="pattern">Patterns</Label>

							<ol
								className={cn(
									classes.list,
									classes.withControls
								)}>
								{patterns.map((pattern, index) => (
									<li key={index} data-index={index}>
										<div>{pattern}</div>
										<div>
											<Button
												className="text-destructive dark:text-red-500 hover:bg-destructive hover:text-destructive-foreground dark:hover:bg-red-500 dark:hover:text-destructive-foreground"
												variant="secondary"
												size="icon"
												onClick={() =>
													deletePattern(index)
												}>
												<Trash />
											</Button>
										</div>
									</li>
								))}
							</ol>

							<div className="flex items-center gap-2">
								<Input
									id="pattern"
									placeholder="Enter pattern"
									type="text"
									value={patternInput}
									onChange={(event) =>
										setPatternInput(
											event.currentTarget.value
										)
									}
								/>
								<Button
									variant="outline"
									size="sm"
									onClick={addPattern}>
									Add
								</Button>
							</div>
						</div>
					</div>
					<div className="flex items-center space-x-2">
						<div className="grid flex-1 gap-2">
							<Label htmlFor="response">Responses</Label>

							<ol
								className={cn(
									classes.list,
									classes.withControls
								)}>
								{responses.map((response, index) => (
									<li key={index} data-index={index}>
										<div>{response}</div>
										<div>
											<Button
												className="text-destructive dark:text-red-500 hover:bg-destructive hover:text-destructive-foreground dark:hover:bg-red-500 dark:hover:text-destructive-foreground"
												variant="secondary"
												size="icon"
												onClick={() =>
													deleteResponse(index)
												}>
												<Trash />
											</Button>
										</div>
									</li>
								))}
							</ol>

							<div className="flex items-center gap-2">
								<Input
									id="response"
									placeholder="Enter response"
									type="text"
									value={responseInput}
									onChange={(event) =>
										setResponseInput(
											event.currentTarget.value
										)
									}
								/>
								<Button
									variant="outline"
									size="sm"
									onClick={addResponse}>
									Add
								</Button>
							</div>
						</div>
					</div>
					<DialogFooter className="sm:justify-end">
						<DialogClose asChild>
							<Button type="button" variant="secondary">
								Close
							</Button>
						</DialogClose>
						<Button
							size="sm"
							disabled={
								patterns.length === 0 ||
								responses.length === 0 ||
								tag.trim() === ""
							}
							onClick={() => onSubmit(tag, patterns, responses)}>
							<Plus className="mr-2" />
							Create
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	)
}
