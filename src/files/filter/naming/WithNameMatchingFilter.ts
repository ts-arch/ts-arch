import { Noun } from "../../noun/Noun"
import { Filter } from "../Filter"

export class WithNameMatchingFilter implements Filter {
	constructor(
		private inputFilter: Filter,
		private regex: RegExp,
		private invert: boolean = false
	) {}

	public filter(nouns: Noun[]): Noun[] {
		return this.inputFilter.filter(nouns).filter(s => {
			return this.invert ? !s.getName().match(this.regex) : s.getName().match(this.regex)
		})
	}
}
