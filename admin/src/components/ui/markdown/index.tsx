import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import rehypeKatex from "rehype-katex"
import remarkMath from "remark-math"
import { components } from "./components"

import "katex/dist/katex.min.css"

interface Props {
	content: string
}

export default function Markdown({ content }: Props) {
	return (
		<ReactMarkdown
			remarkPlugins={[remarkGfm, remarkMath]}
			rehypePlugins={[rehypeRaw, rehypeKatex]}
			components={components}>
			{content}
		</ReactMarkdown>
	)
}
