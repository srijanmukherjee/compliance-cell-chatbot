import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import { components } from "./components"

interface Props {
	content: string
}

export default function Markdown({ content }: Props) {
	return (
		<ReactMarkdown
			remarkPlugins={[remarkGfm]}
			rehypePlugins={[rehypeRaw]}
			components={components}>
			{content}
		</ReactMarkdown>
	)
}
