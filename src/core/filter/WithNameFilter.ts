import { Noun } from "../noun/Noun"
import { Filter } from "./Filter"

export class WithNameFilter implements Filter {
	constructor(private inputFilter: Filter, private name: string) {}

	public filter(nouns: Noun[]): Noun[] {
		return this.inputFilter.filter(nouns).filter(x => x.getName() === this.name)
	}
}
