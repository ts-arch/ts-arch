import { Filter } from "./filter/Filter"
import { Result } from "./Result"
import { CheckStrategy } from "./checks/CheckStrategy"
import { Noun } from "./noun/Noun"
import { Checkable } from "./lang/Checkable"

export class Rule implements Checkable {
	constructor(
		private subjectFilter: Filter,
		private objectFilter: Filter,
		private isNegated: boolean,
		private checkStrategy: CheckStrategy
	) {}

	check(nouns: Noun[]): Result {
		return this.checkStrategy.execute(
			this.isNegated,
			this.subjectFilter.filter(nouns),
			this.objectFilter.filter(nouns)
		)
	}
}
