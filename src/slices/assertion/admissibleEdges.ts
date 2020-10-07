import {ProjectedEdge, ProjectedGraph} from "../../common/projection/projectEdges";
import {Violation} from "../../common/assertion/violation";

export type Rule = {
	source: string
	target: string
}

export class ViolatingEdge implements Violation{
	public rule: Rule|null
	public projectedEdge: ProjectedEdge

	constructor(rule: Rule|null, projectedEdge: ProjectedEdge) {
		this.rule = rule
		this.projectedEdge = projectedEdge
	}
}

export function gatherViolations(graph: ProjectedEdge[], forbidden: Rule[]): ViolatingEdge[] {
	const violatingEdges: ViolatingEdge[] = []
	for (const edge of graph) {
		for (const rule of forbidden) {
			if (edge.sourceLabel === rule.source && edge.targetLabel === rule.target) {
				violatingEdges.push(new ViolatingEdge(rule, edge))
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
			violatingEdges.push(new ViolatingEdge(null, edge))
		}
	}
	return violatingEdges
}

// TODO implement complete coherence
