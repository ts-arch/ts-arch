import { ObjectFilterStarter } from "./ObjectFilterStarter"
import { Buildable } from "../builder/Buildable"
export interface RuleAccessor {
	haveComplexityLowerThan(value: number): Buildable
	haveSubjects(): Buildable
	matchName(regex: RegExp): Buildable
	dependOn(): ObjectFilterStarter
}
