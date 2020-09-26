import {Violation} from "./violation";

export interface Checkable {
	check(): Promise<Violation[]>
}
