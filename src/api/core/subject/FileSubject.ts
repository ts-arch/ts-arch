import { ArchSubject } from "../abstract/ArchSubject"
import { File } from "typescript-parser"

export class FileSubject extends ArchSubject {
	constructor(name: string, private dir: string) {
		super(name)
	}

	public getPath(): string {
		return this.dir
	}
}
