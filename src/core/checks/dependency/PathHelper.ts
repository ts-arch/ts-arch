import * as ts from "typescript"

export class PathHelper {
	public static assumePathOfImportedObject(subject: string, i: ts.ImportDeclaration) {
		const moduleSpecifier = i.moduleSpecifier["text"]
		let completePath = subject

		let resolvedModule = ts.resolveModuleName(
			moduleSpecifier,
			completePath,
			{},
			ts.createCompilerHost({}, true)
		).resolvedModule

		if (!resolvedModule) {
			return undefined
		}
		
		return resolvedModule.resolvedFileName
	}
}
