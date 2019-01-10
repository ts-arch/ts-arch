import { File } from "./noun/File"
import { Result } from "./Result"
import { Checkable } from "./checks/Checkable"

export class Project {
	constructor(private files: File[] = []) {}

	public addFile(file: File) {
		this.files.push(file)
	}

	public getFiles(): File[] {
		return this.files
	}

	check(ruleToMatch: Checkable): Result {
		return ruleToMatch.check(this.files)
	}
}
