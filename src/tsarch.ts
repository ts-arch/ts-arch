import { RuleBuilder } from "./core/builder/RuleBuilder"
import { SubjectFilterStarter } from "./core/lang/SubjectFilterStarter"
import { Project } from "./core/Project"
import { ProjectParser } from "./core/parser/ProjectParser"

export class TSArch {
	static defineThat(): SubjectFilterStarter {
		return RuleBuilder.defineThat()
	}

	static async parseTypescriptProject(path: string): Promise<Project> {
		const project = await ProjectParser.parse(path)
		return project
	}
}

export * from "./core/Project"
export * from "./core/Result"
export * from "./core/Rule"
