import { FileSubject } from "./FileSubject"
import { SourceFile, createSourceFile, ScriptTarget } from "typescript"
import * as path from "path"
import { readFileSync } from "fs"
export class FileSubjectFactory {
	public static buildFromPath(location: string): FileSubject {
		let sf = createSourceFile(location, readFileSync(location).toString(), ScriptTarget.ESNext)
		const name = path.basename(sf.fileName)
		const dir = path.dirname(sf.fileName)
		return new FileSubject(name, dir, sf)
	}

	public static buildFromSourceFile(source: SourceFile): FileSubject {
		const name = path.basename(source.fileName)
		const dir = path.dirname(source.fileName)
		return new FileSubject(name, dir, source)
	}
}
