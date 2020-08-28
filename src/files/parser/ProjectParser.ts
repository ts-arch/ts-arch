import { createProgram, ModuleResolutionKind, ScriptTarget } from "typescript"
import { FileFactory } from "../noun/FileFactory"
import { Project } from "../Project"
import { IgnoreConfig } from "../TSArchConfig"
import glob from "glob"
import path from "path"

export class ProjectParser {
	public static async parse(rootPath: string, config: IgnoreConfig): Promise<Project> {
		const glob = config.js ? "**/*.{ts,tsx}" : "**/*.{ts,tsx,js,jsx}"
		const fileNames = await ProjectParser.getFileNames(path.join(rootPath, glob))
		const project = new Project()

		let program = createProgram(fileNames, {
			target: ScriptTarget.ESNext,
			moduleResolution: ModuleResolutionKind.NodeJs
		})

		program.getSourceFiles().forEach((s) => {
			if (
				(config.declarations ? !s.isDeclarationFile : true) &&
				(config.nodeModules ? !program.isSourceFileFromExternalLibrary(s) : true)
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
