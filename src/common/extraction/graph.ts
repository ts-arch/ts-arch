export type Edge = {
	source: string
	target: string
	external: boolean
	typeOnly: boolean
}

export type Graph = Edge[]
