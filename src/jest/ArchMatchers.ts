import { ArchProject } from "../api/core/ArchProject"
import { ArchRule } from "../api/core/abstract/ArchRule"
import { ArchResult } from "../api/core/ArchResult"

function buildJestResult(
	pass: boolean,
	msg: string,
	details?: ArchResult
): { pass: boolean; message: () => string } {
	let info = msg
	if (details && !pass) {
		info += "\nDetails:\n"
		details
			.getEntries()
			.forEach(e => (info += `${e.pass} | ${e.subject.getName()} -> ${e.info}\n`))
	}
	return { pass: pass, message: () => info }
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
			return buildJestResult(!result, "expected to not pass rule", ruleToMatch.getResult())
		} else {
			return buildJestResult(result, "expected to pass rule", ruleToMatch.getResult())
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
