import { ProjectedEdge, ProjectedGraph } from "../processing/project"

export type Rule = {
	source: string
	target: string
}

export type ViolatingEdge = {
	rule?: Rule
} & ProjectedEdge

export function gatherViolations(graph: ProjectedEdge[], forbidden: Rule[]): ViolatingEdge[] {
	const violatingEdges: ViolatingEdge[] = []
	for (const edge of graph) {
		for (const rule of forbidden) {
			if (edge.sourceLabel === rule.source && edge.targetLabel === rule.target) {
				violatingEdges.push({
					...edge,
					rule
				})
			}
		}
	}
	return violatingEdges
}

export function gatherPositiveViolations(graph: ProjectedGraph, allowed: Rule[]): ViolatingEdge[] {
	const violatingEdges: ViolatingEdge[] = []
	for (const edge of graph) {
		const match = allowed.find((allowedRule) => {
			return edge.sourceLabel === allowedRule.source && edge.targetLabel === allowedRule.target
		})
		if (match === undefined) {
			violatingEdges.push(edge)
		}
	}
	return violatingEdges
}

// TODO implement complete coherence
