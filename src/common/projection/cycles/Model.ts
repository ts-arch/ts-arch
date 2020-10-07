export interface NumberEdge {
	from: number
	to: number
}
export interface NumberCycle {
	path: number[]
}
export interface NumberNode {
	node: number
	incoming: NumberEdge[]
	outgoing: NumberEdge[]
}
