import { ArchProject } from "../api/core/ArchProject"
import { ArchRule } from "../api/core/abstract/ArchRule"

function buildJestResult(pass: boolean, msg: string): { pass: boolean; message: () => string } {
	return { pass: pass, message: () => msg }
}

export function toMatchArchRuleLogic(
	jestCtx: { isNot: boolean },
	project?: ArchProject,
	ruleToMatch?: ArchRule
): { pass: boolean; message?: () => string } {
	if (!project) {
		return buildJestResult(false, "expected project as input")
	} else if (!ruleToMatch) {
		return buildJestResult(false, "expected rule to match against")
	} else {
		const result = ruleToMatch.checkProject(project)
		if (jestCtx.isNot) {
			return buildJestResult(!result, "expected to not pass rule")
		} else {
			return buildJestResult(result, "expected to pass rule")
		}
	}
}

/*
 * Extending Jest and its type
 */
declare global {
	namespace jest {
		// tslint:disable-next-line:interface-name
		interface Matchers<R> {
			toMatchArchRule(ruleToMatch: ArchRule): R
		}
	}
}

expect.extend({
	toMatchArchRule(project?: ArchProject, ruleToMatch?: ArchRule) {
		return toMatchArchRuleLogic(this, project, ruleToMatch)
	}
} as any)
