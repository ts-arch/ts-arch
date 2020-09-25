import { Result } from "../Result"
import { Noun } from "../noun/Noun"

export interface Checkable {
	check(nouns: Noun[]): Result
}
