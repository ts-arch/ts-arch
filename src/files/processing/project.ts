import { Edge } from "../../common/domain/graph"

export type ProjectedNode = { // TODO this should have a list of incoming and outgoing edges
	label: string
}

export function projectToNodes(graph: Edge[]): ProjectedNode[] {
	const builtGraph: ProjectedNode[] = []
	const internalGraph = graph.filter(e => !e.external) // TODO only internal files are relevant for this projection. maybe it still should be configurable
	const files = Array.from(
		new Set([...internalGraph.map(edge => edge.target), ...internalGraph.map(edge => edge.source)])
	)
	files.forEach(f => builtGraph.push({label: f}))
	return builtGraph
}
