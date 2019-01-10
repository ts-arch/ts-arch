import { Filter } from "./Filter"
import { Noun } from "../noun/Noun"
export class EmptyFilter implements Filter {
	filter(nouns: Noun[]): Noun[] {
		return nouns
	}
}
