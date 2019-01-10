import { Noun } from "./Noun"
import { SourceFile } from "typescript"

export class File extends Noun {
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
