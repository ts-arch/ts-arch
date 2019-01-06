import { File } from "typescript-parser"
import { FileSubject } from "./FileSubject"

export class FileSubjectFactory {
	public static buildFromFile(file: File): FileSubject {
		return new FileSubject(file.parsedPath.base, file.parsedPath.dir)
	}
}
