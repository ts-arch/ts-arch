import {matchingAllPatterns} from "../../common/util/regexUtils";
import {ProjectedEdge} from "../../common/projection/projectEdges";
import {projectCycles} from "../../common/projection/projectCycles";
import {Violation} from "../../common/assertion/violation";

export class ViolatingCycle implements Violation{
	public cycle: ProjectedEdge[]

	constructor(cycle: ProjectedEdge[]) {
		this.cycle = cycle
	}
}

export function gatherCycleViolations(projectedEdges: ProjectedEdge[],
									  preconditionPatterns: string[]): ViolatingCycle[] {

	const filteredEdges = projectedEdges
		.filter((edge) =>
			matchingAllPatterns(edge.sourceLabel, preconditionPatterns) &&
			matchingAllPatterns(edge.targetLabel, preconditionPatterns))

	const projectedCycles = projectCycles(filteredEdges)

	return projectedCycles.map(cs => new ViolatingCycle(cs))
}
