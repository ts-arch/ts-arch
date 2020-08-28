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

	public static getFrom(nouns: Noun[]): File[] {
		return nouns.filter((x) => x instanceof File).map((x) => x as File)
	}
}
