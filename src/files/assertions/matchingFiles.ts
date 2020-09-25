import {ProjectedNode} from "../processing/project";

export type ViolatingFile = {
	rule: string
} & ProjectedNode

export function gatherRegexMatchingViolations(files: ProjectedNode[], pattern: string, isNegated: boolean): ViolatingFile[] {
	const violations: ViolatingFile[] = []
	files.forEach(file => {
		const match = file.label.match(pattern)
		if(!isNegated){
			const violation = checkPositiveViolation(match, file, pattern)
			if(violation) {
				violations.push(violation)
			}
		} else {
			const violation = checkNegativeViolation(match, file, pattern)
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
