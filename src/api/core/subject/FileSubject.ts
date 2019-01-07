import { ArchSubject } from "../abstract/ArchSubject"
import { SourceFile } from "typescript"
export class FileSubject extends ArchSubject {
	constructor(name: string, private dir: string, private sourceFile: SourceFile) {
		super(name)
	}

	public getPath(): string {
		return this.dir
	}

	public getSourceFile(): SourceFile {
		return this.sourceFile
	}
}
