import { createProgram, ScriptTarget } from "typescript"
import { FileFactory } from "../noun/FileFactory"
import { Project } from "../Project"

export class ProjectParser {
	public static async parse(rootPath: string): Promise<Project> {
		const fileNames = await ProjectParser.getFileNames(rootPath + "/**/*.ts")
		const project = new Project()

		let program = createProgram(fileNames, {
			target: ScriptTarget.ESNext
		})

		program.getSourceFiles().forEach(s => {
			// TODO make this configurable ?
			if (!s.fileName.endsWith(".d.ts") && !s.fileName.includes("node_modules")) {
				const file = FileFactory.buildFromSourceFile(s)
				project.addFile(file)
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
