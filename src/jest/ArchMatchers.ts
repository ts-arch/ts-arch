import { Result } from "../files-legacy/Result"
import { Project } from "../files-legacy/Project"
import { Checkable } from "../files-legacy/lang/Checkable"

function buildJestResult(
	pass: boolean,
	msg: string,
	details?: Result
): { pass: boolean; message: () => string } {
	let info = msg
	if (details && !pass) {
		info += "\nDetails:\n"
		details
			.getEntries()
			.filter((e) => !e.pass)
			.forEach((e) => (info += `${e.pass} | ${e.subject.getName()} -> ${e.info}\n`))
	}
	return { pass: pass, message: () => info }
}

export function toMatchArchRuleLogic(
	jestCtx: { isNot: boolean },
	project?: Project,
	ruleToMatch?: Checkable
): { pass: boolean; message?: () => string } {
	if (!project) {
		return buildJestResult(false, "expected project as input")
	} else if (!ruleToMatch) {
		return buildJestResult(false, "expected rule to match against")
	} else {
		const result: Result = project.check(ruleToMatch)
		if (jestCtx.isNot) {
			return buildJestResult(!result.hasRulePassed(), "expected to not pass rule", result)
		} else {
			return buildJestResult(result.hasRulePassed(), "expected to pass rule", result)
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
			toPass(ruleToMatch: Checkable): R
		}
	}
}

export function extendJestMatchers() {
	expect.extend({
		toPass(project?: Project, ruleToMatch?: Checkable) {
			return toMatchArchRuleLogic(this, project, ruleToMatch)
		}
	} as any)
}
