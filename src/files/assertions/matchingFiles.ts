import {ProjectedNode} from "../processing/project";
import {matchingAllPatterns} from "../../common/util/regexUtils";
import {Violation} from "../../common/fluentapi/violation";

export function gatherRegexMatchingViolations(files: ProjectedNode[],
											  checkPattern: string,
											  preconditionPatterns: string[],
											  isNegated: boolean): Violation[] {
	const violations: Violation[] = []

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

function checkNegativeViolation(match: RegExpMatchArray | null, file: ProjectedNode, pattern: string): Violation|null {
	if (match != null && match.length > 0) {
		 return {
		 	 message: `${file.label} should not match regex '${pattern}'`,
			 details: {
		 	 	 file: file,
				 pattern: pattern
			 }
		 }
	} else return null
}

function checkPositiveViolation(match: RegExpMatchArray | null, file: ProjectedNode, pattern: string): Violation|null  {
	if (match == null || match.length === 0) {
		return {
			message: `${file.label} should match regex '${pattern}'`,
			details: {
				file: file,
				pattern: pattern
			}
		}
	} else return null
}
