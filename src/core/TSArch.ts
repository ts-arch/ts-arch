import { RuleBuilder } from "./builder/RuleBuilder"
import { SubjectFilterStarter } from "./lang/SubjectFilterStarter"
import { Project } from "./Project"
import { ProjectParser } from "./parser/ProjectParser"

export class TSArch {
	static defineThat(): SubjectFilterStarter {
		return RuleBuilder.defineThat()
	}

	static async parseTypescriptProject(path: string): Promise<Project> {
		const project = await ProjectParser.parse(path)
		return project
	}
}
