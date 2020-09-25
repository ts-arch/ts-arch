import { Result as LegacyResult } from "../files-legacy/Result"
import { Project } from "../files-legacy/Project"
import { Checkable } from "../files-legacy/lang/Checkable"
import {ViolatingFile} from "../files/assertions/matchingFiles";
import {Result} from "neverthrow";
import {FileRule} from "../files/fluentapi/FileRule";

function buildJestResult(
	pass: boolean,
	msg: string,
	details?: LegacyResult
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

function buildNewJestResult(
	pass: boolean,
	msg: string,
	details?: ViolatingFile[]
): { pass: boolean; message: () => string } {
	let info = msg
	if (details && !pass) {
		details
			.forEach((e) => (info += `${e.label} -> ${e.rule}\n`))
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
		const result: LegacyResult = project.check(ruleToMatch)
		if (jestCtx.isNot) {
			return buildJestResult(!result.hasRulePassed(), "expected to not pass rule", result)
		} else {
			return buildJestResult(result.hasRulePassed(), "expected to pass rule", result)
		}
	}
}

export function toMatchNewRuleLogic(
	jestCtx: { isNot: boolean },
	violations?: ViolatingFile[]
): { pass: boolean; message?: () => string } {
	 if (!violations) {
		return buildJestResult(false, "expected ViolatingFile[] to match against")
	} else {
		if (jestCtx.isNot) {
			return buildNewJestResult(violations.length !== 0, "expected to not pass rule", violations)
		} else {
			return buildNewJestResult(violations.length === 0, "expected to pass rule", violations)
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
			toPassAsync(): R
		}
	}
}

export function extendJestMatchers() {
	expect.extend({
		toPass(project?: Project, ruleToMatch?: Checkable) {
			return toMatchArchRuleLogic(this, project, ruleToMatch)
		}
	} as any)
	expect.extend({
		async toPassAsync(rule:  FileRule) {
			const violations = await rule.check()
			return toMatchNewRuleLogic(this, violations._unsafeUnwrap())
		}
	} as any)
}
