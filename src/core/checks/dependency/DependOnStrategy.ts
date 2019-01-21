import { SyntaxKind, ImportDeclaration } from "typescript"
import { CheckStrategy } from "../CheckStrategy"
import { Noun } from "../../noun/Noun"
import { File } from "../../noun/File"
import { Result, ResultEntry } from "../../Result"
import * as path from "path"
export class DependOnStrategy implements CheckStrategy {
	execute(isNegated: boolean, subjects: Noun[], objects: Noun[]): Result {
		const result = new Result()
		const fileObjects = File.getFrom(objects)
		const fileSubjects = File.getFrom(subjects)

		fileSubjects.forEach(s => {
			const dependencies = this.getDependenciesOfSubject(s, fileObjects)
			if (dependencies.length > 0) {
				dependencies.forEach(d => {
					result.addEntry(this.buildHasDependenciesResult(s, d, isNegated))
				})
			} else {
				result.addEntry(this.buildHasNoDependenciesResult(s, isNegated))
			}
		})
		return result
	}

	private buildHasNoDependenciesResult(s: File, isNegated: boolean): ResultEntry {
		return {
			subject: s,
			info: this.buildHasNoDependencyString(),
			pass: isNegated
		}
	}

	private buildHasDependenciesResult(s: File, d: File, isNegated: boolean): ResultEntry {
		return {
			subject: s,
			object: d,
			info: this.buildHasDependencyString(),
			pass: !isNegated
		}
	}

	private buildHasNoDependencyString(): string {
		return `has no dependencies on objects`
	}

	private buildHasDependencyString(): string {
		return `has dependency on object`
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
