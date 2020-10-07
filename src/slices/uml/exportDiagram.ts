import {ProjectedGraph} from "../../common/projection/projectEdges";

export function exportDiagram(graph: ProjectedGraph): string {
	let output = "@startuml\n"

	const vertices = new Set<string>(graph.flatMap((edge) => [edge.sourceLabel, edge.targetLabel]))
	for (const vertex of vertices.values()) {
		output += `component [${vertex}]\n`
	}

	for (const edge of graph) {
		output += `[${edge.sourceLabel}] --> [${edge.targetLabel}]\n`
	}
	output += "@enduml"
	return output
}
