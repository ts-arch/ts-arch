import { CheckStrategy } from "../CheckStrategy"
import { Noun } from "../../noun/Noun"
import { Result, ResultEntry } from "../../Result"

export class MatchNameStrategy implements CheckStrategy {
	constructor(private regex: RegExp) {}

	execute(isNegated: boolean, subjects: Noun[]): Result {
		const result = new Result()
		subjects.forEach(s => {
			if (s.getName().match(this.regex)) {
				result.addEntry(this.buildMatchingResult(s, isNegated))
			} else {
				result.addEntry(this.buildNotMatchingResult(s, isNegated))
			}
		})
		return result
	}

	private buildNotMatchingResult(s: Noun, isNegated: boolean): ResultEntry {
		return {
			subject: s,
			pass: isNegated,
			info: this.buildNotMatchingString(s)
		}
	}

	private buildMatchingResult(s: Noun, isNegated: boolean): ResultEntry {
		return {
			subject: s,
			pass: !isNegated,
			info: this.buildMatchingString(s)
		}
	}

	private buildMatchingString(s: Noun): string {
		return `${s.getName()} matches ${this.regex}`
	}

	private buildNotMatchingString(s: Noun): string {
		return `${s.getName()} does not match ${this.regex}`
	}
}
