import {matchingAllPatterns} from "../../common/util/regexUtils";
import {Violation} from "../../common/fluentapi/violation";
import {ProjectedEdge} from "../../common/processing/project";
import {Edge} from "../../common/domain/cycles/Model";
import {TrajanSCC} from "../../common/domain/cycles/TrajanSCC";
import { JohnsonsAPSP } from "../../common/domain/cycles/JohnsonsAPSP";
import {TechnicalError, UserError} from "../../common/error/errors";

export class ViolatingFileDependency implements Violation{
	public dependency: ProjectedEdge

	constructor(dependency: ProjectedEdge) {
		this.dependency = dependency
	}
}

export function gatherDependOnFileViolations(projectedEdges: ProjectedEdge[],
									  objectPatterns: string[],
									  subjectPatterns: string[],
									  isNegated: boolean): ViolatingFileDependency[] {

	if(objectPatterns.length === 0 && subjectPatterns.length === 0) {
		throw new UserError("object and subject patterns must be set")
	}

	if(isNegated) {
		const filteredEdges = projectedEdges
			.filter((edge) =>
				matchingAllPatterns(edge.sourceLabel, objectPatterns) &&
				matchingAllPatterns(edge.targetLabel, subjectPatterns))
		return filteredEdges.map(e => {
			return new ViolatingFileDependency(e)
		})
	} else {
		const filteredEdges = projectedEdges
			.filter((edge) =>
				!matchingAllPatterns(edge.sourceLabel, objectPatterns) ||
				!matchingAllPatterns(edge.targetLabel, subjectPatterns))
		return filteredEdges.map(e => {
			return new ViolatingFileDependency(e)
		})
	}
}
