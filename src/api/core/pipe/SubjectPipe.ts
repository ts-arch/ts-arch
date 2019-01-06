import { ArchRulePipe } from "../abstract/ArchRulePipe"
import { ArchRule } from "../abstract/ArchRule"
import { HaveSubjectsRule } from "../rule/HaveSubjectsRule"
import { MatchNameRule } from "../rule/MatchNameRule"
import { ComplexityRule } from "../rule/ComplexityRule"

export abstract class SubjectPipe extends ArchRulePipe {
	constructor(input: ArchRulePipe) {
		super(input)
	}

	public haveSubjects(): ArchRule {
		return new HaveSubjectsRule(this)
	}

	public matchName(regex: RegExp): ArchRule {
		return new MatchNameRule(this, regex)
	}

	public haveComplexityLowerThan(value: number): ArchRule {
		return new ComplexityRule(this, value)
	}
}
