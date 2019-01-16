import { SyntaxKind, ImportDeclaration } from "typescript"
import { CheckStrategy } from "../CheckStrategy"
import { Noun } from "../../noun/Noun"
import { File } from "../../noun/File"
import { Result } from "../../Result"
import * as path from "path"

export class DependOnStrategy implements CheckStrategy {
	execute(isNegated: boolean, subjects: Noun[], objects: Noun[]): Result {
		const result = new Result()
		const fileObjects = objects.filter(x => x instanceof File).map(x => x as File)
		const fileSubjects = subjects.filter(x => x instanceof File).map(x => x as File)

		fileSubjects.forEach(s => {
			const dependencies = this.getDependenciesOfSubject(s, fileObjects)

			if (dependencies.length > 0) {
				dependencies.forEach(d => {
					result.addEntry({
						subject: s,
						object: d,
						info: `has dependency on object`,
						pass: !isNegated
					})
				})
			} else {
				result.addEntry({
					subject: s,
					info: `has no dependencies on objects`,
					pass: isNegated
				})
			}
		})
		return result
	}

	public getDependenciesOfSubject(subject: File, objects: File[]): File[] {
		const result: File[] = []
		objects.forEach(object => {
			const declaration = this.getImportDeclarationForObject(object, subject)
			if (declaration) {
				result.push(object)
			}
		})
		return result
	}

	public getImportDeclarationForObject(object: File, subject: File): ImportDeclaration | null {
		let result: ImportDeclaration | null = null
		this.getImportDeclarations(subject).forEach(i => {
			// FIXME this is an assumption, we need to consider shortcutted imports e.g. from node_modules.
			// FIXME It would be nice to use the typescript compilers resolution algorithm
			const assumedPathTokens = [
				...subject.getPath().split("/"),
				...i.moduleSpecifier["text"].split("/")
			]

			// FIXME this is an assumption, we need to consider other types e.g. JS files
			// FIXME It would be nice to use the typescript compilers resolution algorithm
			const assumedPath = path.join(...assumedPathTokens) + ".ts"

			if (
				path.normalize(assumedPath) ===
				path.normalize(object.getPath() + "/" + object.getName())
			) {
				result = i
			}
		})
		return result
	}

	public getImportDeclarations(subject: File): ImportDeclaration[] {
		return subject
			.getSourceFile()
			.statements.filter(x => x.kind === SyntaxKind.ImportDeclaration)
			.map(x => x as ImportDeclaration)
	}
}
