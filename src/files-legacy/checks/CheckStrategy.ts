import { Noun } from "../noun/Noun"
import { Result } from "../Result"

export interface CheckStrategy {
	execute(isNegated: boolean, subjects: Noun[], objects?: Noun[]): Result
}
