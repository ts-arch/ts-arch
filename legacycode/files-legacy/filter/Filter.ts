import { Noun } from "../noun/Noun"

export interface Filter {
	filter(nouns: Noun[]): Noun[]
}
