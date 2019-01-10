import { Filter } from "./Filter"
import { Noun } from "../noun/Noun"
import { File } from "../noun/File"

export class FilesFilter implements Filter {
	constructor(private input: Filter) {}

	public filter(nouns: Noun[]): File[] {
		return this.input
			.filter(nouns)
			.filter(x => x instanceof File)
			.map(x => x as File)
	}
}
