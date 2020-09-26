import {matchingAllPatterns} from "../../common/util/regexUtils";
import {Violation} from "../../common/fluentapi/violation";
import {ProjectedEdge} from "../../common/processing/project";
import {Edge} from "../../common/domain/cycles/Model";
import {TrajanSCC} from "../../common/domain/cycles/TrajanSCC";
import { JohnsonsAPSP } from "../../common/domain/cycles/JohnsonsAPSP";

export class ViolatingCycle implements Violation{
	public cycle: ProjectedEdge[]

	constructor(cycle: ProjectedEdge[]) {
		this.cycle = cycle
	}
}

// TODO we can propably make this code a lot better
function findCycles(filteredEdges: ProjectedEdge[]) {
	const labelToId: Map<string, number> = new Map<string, number>()
	const idToLabel: Map<number, string> = new Map<number, string>()
	let index = 0
	filteredEdges.forEach(e => {
		if (!labelToId.has(e.sourceLabel)) {
			labelToId.set(e.sourceLabel, index)
			idToLabel.set(index++, e.sourceLabel)
		}
		if (!labelToId.has(e.targetLabel)) {
			labelToId.set(e.targetLabel, index)
			idToLabel.set(index++, e.targetLabel)
		}
	})
	const idEdges = filteredEdges.map(e => {
		return {
			from: labelToId.get(e.sourceLabel),
			to: labelToId.get(e.targetLabel),
		}
	})
	const cycles: Array<Edge[]> = []
	const tarjan = new TrajanSCC()
	const stronglyConnectedComponents = tarjan.findStronglyConnectedComponents(idEdges as Edge[])
	stronglyConnectedComponents.forEach((scc) => {
		const johnson = new JohnsonsAPSP()
		if (scc.length > 1) {
			cycles.push(...johnson.findSimpleCycles(scc))
		}
	})

	const violations: ViolatingCycle[] = []

	cycles.forEach(cs => {
		const cycle = cs.map(c => {
			const sourceLabel = idToLabel.get(c.from)
			const targetLabel = idToLabel.get(c.to)
			return filteredEdges.find(e => e.sourceLabel === sourceLabel && e.targetLabel === targetLabel)!! // TODO bad!
		})
		violations.push(new ViolatingCycle(cycle))
	})
	return violations;
}

export function gatherCycleViolations(projectedEdges: ProjectedEdge[],
									  preconditionPatterns: string[],
									  isNegated: boolean): ViolatingCycle[] {

	const filteredEdges = projectedEdges
		.filter((edge) =>
			matchingAllPatterns(edge.sourceLabel, preconditionPatterns) &&
			matchingAllPatterns(edge.targetLabel, preconditionPatterns))

	return findCycles(filteredEdges)
}
