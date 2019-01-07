import { ArchRule } from "../abstract/ArchRule"
import { ArchRulePipe } from "../abstract/ArchRulePipe"
import { ArchSubject } from "../abstract/ArchSubject"
import { ArchResult } from "../ArchResult"

export class MatchNameRule extends ArchRule {
	constructor(input: ArchRulePipe, private regex: RegExp) {
		super(input)
	}

	public buildResult(subjects: ArchSubject[], hasNotModifier: boolean): ArchResult {
		const result = new ArchResult()

		this.input.filterSubjects(subjects).forEach(s => {
			if (s.getName().match(this.regex)) {
				result.addEntry(s, !hasNotModifier, `${s.getName()} matches ${this.regex}`)
			} else {
				result.addEntry(s, hasNotModifier, `${s.getName()} does not match ${this.regex}`)
			}
		})
		return result
	}
}
