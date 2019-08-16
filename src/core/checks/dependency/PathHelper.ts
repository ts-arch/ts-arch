import { File } from "../../noun/File"
import { ImportDeclaration } from "typescript"
import * as path from "path"

export class PathHelper {
	public static assumePathOfImportedObject(subject: File, i: ImportDeclaration) {
		let completePath = subject.getPath()
		const assumedPathTokens = [
			...completePath.split("/"),
			...i.moduleSpecifier["text"].split("/")
		]
		return PathHelper.assemblePath(assumedPathTokens, completePath)
	}

	private static assemblePath(tokens: string[], completePath: string) {
		let pathWithoutTrailingSlash = path.join(...tokens)
		if (completePath.startsWith('/')) {
			return '/'+pathWithoutTrailingSlash
		} else {
			return pathWithoutTrailingSlash
		}
	}
}
