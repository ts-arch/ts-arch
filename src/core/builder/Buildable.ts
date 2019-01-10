import { Checkable } from "../checks/Checkable"

export interface Buildable {
	build(): Checkable
}
