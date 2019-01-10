import { CheckStrategy } from "./CheckStrategy"
import { Noun } from "../noun/Noun"
import { Result } from "../Result"

export class MatchNameStrategy implements CheckStrategy {
	constructor(private regex: RegExp) {}

	execute(isNegated: boolean, subjects: Noun[]): Result {
		const result = new Result()
		subjects.forEach(s => {
			if (s.getName().match(this.regex)) {
				result.addEntry({
					subject: s,
					pass: !isNegated,
					info: `${s.getName()} matches ${this.regex}`
				})
			} else {
				result.addEntry({
					subject: s,
					pass: isNegated,
					info: `${s.getName()} does not match ${this.regex}`
				})
			}
		})
		return result
	}
}
