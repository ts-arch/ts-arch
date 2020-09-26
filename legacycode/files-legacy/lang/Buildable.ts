import { Checkable } from "./Checkable"

export interface Buildable {
	build(): Checkable
}
