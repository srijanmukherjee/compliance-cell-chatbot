import Link from "next/link"
import { Components } from "react-markdown"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "../table"

export const components: Partial<Components> = {
	h1(props) {
		return <h1 className="font-semibold text-4xl py-2">{props.children}</h1>
	},
	h2(props) {
		return <h1 className="font-semibold text-3xl py-2">{props.children}</h1>
	},
	h3(props) {
		return <h1 className="font-semibold text-2xl py-2">{props.children}</h1>
	},
	h4(props) {
		return <h1 className="font-semibold text-xl py-2">{props.children}</h1>
	},
	a(props) {
		return (
			<Link className="text-primary" href={props.href ?? "#"}>
				{props.children}
			</Link>
		)
	},
	ul(props) {
		return <ul className="list-disc pl-4">{props.children}</ul>
	},
	table(props) {
		return <Table className="border-2 my-4">{props.children}</Table>
	},

	thead(props) {
		return <TableHeader>{props.children}</TableHeader>
	},

	tbody(props) {
		return <TableBody>{props.children}</TableBody>
	},

	tr(props) {
		return <TableRow>{props.children}</TableRow>
	},

	td(props) {
		return <TableCell>{props.children}</TableCell>
	},

	th(props) {
		return <TableHead>{props.children}</TableHead>
	},
	blockquote(props) {
		return (
			<blockquote className="p-6 border-l-4 border-l-secondary my-4">
				{props.children}
			</blockquote>
		)
	}
}
