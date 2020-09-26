import {ProjectedNode} from "../processing/project";
import {matchingAllPatterns} from "../../common/util/regexUtils";
import {Violation} from "../../common/fluentapi/violation";

export class ViolatingNode implements Violation{
	public checkPattern: string
	public projectedNode: ProjectedNode

	constructor(checkPattern: string, projectedNode: ProjectedNode) {
		this.checkPattern = checkPattern
		this.projectedNode = projectedNode
	}
}

export function gatherRegexMatchingViolations(files: ProjectedNode[],
											  checkPattern: string,
											  preconditionPatterns: string[],
											  isNegated: boolean): ViolatingNode[] {
	const violations: ViolatingNode[] = []

	const filteredFiles = files
		.filter((node) => matchingAllPatterns(node.label, preconditionPatterns))

	filteredFiles.forEach(file => {
		const match = file.label.match(checkPattern)
		if(!isNegated){
			const violation = checkPositiveViolation(match, file, checkPattern)
			if(violation) {
				violations.push(violation)
			}
		} else {
			const violation = checkNegativeViolation(match, file, checkPattern)
			if(violation) {
				violations.push(violation)
			}
		}
	})

	return violations

}

function checkNegativeViolation(match: RegExpMatchArray | null, file: ProjectedNode, pattern: string): ViolatingNode|null {
	if (match != null && match.length > 0) {
		return new ViolatingNode(pattern, file)
	} else return null
}

function checkPositiveViolation(match: RegExpMatchArray | null, file: ProjectedNode, pattern: string): ViolatingNode|null  {
	if (match == null || match.length === 0) {
		return new ViolatingNode(pattern, file)
	} else return null
}
