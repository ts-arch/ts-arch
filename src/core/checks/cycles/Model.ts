export interface Edge {
	from: number
	to: number
}
export interface Cycle {
	path: number[]
}
export interface Node {
	node: number
	incoming: Edge[]
	outgoing: Edge[]
}
