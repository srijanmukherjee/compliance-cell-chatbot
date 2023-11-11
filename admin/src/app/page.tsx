"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function Home() {
	const [count, setCount] = useState(0)
	return (
		<>
			<main>
				<Button onClick={() => setCount((val) => val + 1)}>
					Count {count}
				</Button>
			</main>
		</>
	)
}
