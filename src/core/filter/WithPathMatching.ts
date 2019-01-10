import { Noun } from "../noun/Noun"
import { Filter } from "./Filter"
import { File } from "../noun/File"

export class WithPathMatchingFilter implements Filter {
	constructor(private inputFilter: Filter, private regex: RegExp) {}

	public filter(nouns: Noun[]): Noun[] {
		return this.inputFilter
			.filter(nouns)
			.filter(s => s instanceof File)
			.filter(s => (s as File).getPath().match(this.regex))
	}
}
