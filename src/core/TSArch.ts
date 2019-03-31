import { RuleBuilder } from "./builder/RuleBuilder"
import { SubjectFilterStarter } from "./lang/SubjectFilterStarter"
import { Project } from "./Project"
import { ProjectParser } from "./parser/ProjectParser"
import { TSArchConfig } from "./TSArchConfig";

export class TSArch {
	public static config: TSArchConfig = {
		ignore: {
			declarations: true,
			nodeModules: true,
			js: false
		}
	}

	static defineThat(): SubjectFilterStarter {
		return new RuleBuilder(TSArch.config.ignore)
	}

	static async parseTypescriptProject(path: string): Promise<Project> {
		const project = await ProjectParser.parse(path, TSArch.config.ignore)
		return project
	}
}
