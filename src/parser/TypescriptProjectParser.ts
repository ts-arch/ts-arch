import { ArchProject } from "../api/core/ArchProject"
import { FileSubjectFactory } from "../api/core/subject/FileSubjectFactory"
import { createProgram, ScriptTarget } from "typescript"

export class TypescriptProjectParser {
	public static async parse(rootPath: string): Promise<ArchProject> {
		const fileNames = await TypescriptProjectParser.getFileNames(rootPath + "/**/*.ts")
		const project = new ArchProject()

		let program = createProgram(fileNames, {
			target: ScriptTarget.ESNext
		})

		program.getSourceFiles().forEach(s => {
			// TODO make this configurable ?
			if (!s.fileName.endsWith(".d.ts") && !s.fileName.includes("node_modules")) {
				const fileSubject = FileSubjectFactory.buildFromSourceFile(s)
				project.addSubject(fileSubject)
			}
		})

		return project
	}

	public static async getFileNames(globPattern: string): Promise<string[]> {
		return new Promise<string[]>((resolve, reject) => {
			const glob = require("glob")
			glob(globPattern, (err, files: string[]) => {
				if (err) {
					reject(err)
					return
				}
				resolve(files)
			})
		})
	}
}
