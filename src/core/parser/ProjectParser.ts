import { createProgram, ScriptTarget } from "typescript"
import { FileFactory } from "../noun/FileFactory"
import { Project } from "../Project"
import { IgnoreConfig } from "../TSArchConfig";
import * as glob from 'glob'
import * as path from 'path'

export class ProjectParser {
	public static async parse(
		rootPath: string,
		config: IgnoreConfig
	): Promise<Project> {
		const glob = config.js ? "**/*.{ts,tsx}" : "**/*.{ts,tsx,js,jsx}"
		const fileNames = await ProjectParser.getFileNames(path.join(rootPath, glob))
		const project = new Project()

		let program = createProgram(fileNames, {
			target: ScriptTarget.ESNext
		})

		program.getSourceFiles().forEach(s => {
			if (
				(config.declarations ? !s.fileName.endsWith(".d.ts") : true) &&
				(config.nodeModules ? !s.fileName.includes("node_modules") : true)
			) {
				const file = FileFactory.buildFromSourceFile(s)
				project.addFile(file)
			}
		})

		return project
	}

	public static async getFileNames(globPattern: string): Promise<string[]> {
		return new Promise<string[]>((resolve, reject) => {
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
