import { ArchRule } from "../abstract/ArchRule"
import { ArchRulePipe } from "../abstract/ArchRulePipe"
import { ArchSubject } from "../abstract/ArchSubject"
import { ArchResult } from "../ArchResult"

export class HaveSubjectsRule extends ArchRule {
	constructor(input: ArchRulePipe) {
		super(input)
	}

	public buildResult(subjects: ArchSubject[], hasNotModifier: boolean): ArchResult {
		const result = new ArchResult()
		if (this.input.filterSubjects(subjects).length > 0) {
			if (!hasNotModifier) {
				result.forcePass()
			} else {
				result.forceFail()
			}
		} else {
			if (!hasNotModifier) {
				result.forceFail()
			} else {
				result.forcePass()
			}
		}
		return result
	}
}
