import {Checkable} from "../common/fluentapi/checkable";
import {Violation} from "../common/fluentapi/violation";

function buildJestResult(
	pass: boolean,
	msg: string,
	details?: Violation[]
): { pass: boolean; message: () => string } {
	let info = msg + "\n"
	if (details && !pass) {
		details
			.forEach((e) => (info += `${e.message}\n${JSON.stringify(e.details)}\n\n`))
	}
	return { pass: pass, message: () => info }
}

export function toMatchNewRuleLogic(
	jestCtx: { isNot: boolean },
	violations?: Violation[]
): { pass: boolean; message?: () => string } {
	 if (!violations) {
		return buildJestResult(false, "expected violations to check")
	} else {
		if (jestCtx.isNot) {
			return buildJestResult(violations.length !== 0, "expected to not pass rule", violations)
		} else {
			return buildJestResult(violations.length === 0, "expected to pass rule", violations)
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
			toPassAsync(): R
		}
	}
}

export function extendJestMatchers() {
	expect.extend({
		async toPassAsync(checkable:  Checkable) {
			const violations = await checkable.check()
			return toMatchNewRuleLogic(this, violations)
		}
	} as any)
}
