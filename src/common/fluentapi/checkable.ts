import { Violation } from "../assertion/violation"

export interface Checkable {
	check(): Promise<Violation[]>
}
