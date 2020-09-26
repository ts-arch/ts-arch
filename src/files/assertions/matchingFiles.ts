import {ProjectedNode} from "../processing/project";
import {matchingAllPatterns} from "../../common/util/regexUtils";

export type ViolatingFile = {
	rule: string
} & ProjectedNode

export function gatherRegexMatchingViolations(files: ProjectedNode[],
											  checkPattern: string,
											  preconditionPatterns: string[],
											  isNegated: boolean): ViolatingFile[] {
	const violations: ViolatingFile[] = []

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

function checkNegativeViolation(match: RegExpMatchArray | null, file: ProjectedNode, pattern: string): ViolatingFile|null {
	if (match != null && match.length > 0) {
		return {label: file.label, rule: `should not match regex '${pattern}'`}
	} else return null
}

function checkPositiveViolation(match: RegExpMatchArray | null, file: ProjectedNode, pattern: string): ViolatingFile|null  {
	if (match == null || match.length === 0) {
		return {label: file.label, rule: `should match regex '${pattern}'`}
	} else return null
}
