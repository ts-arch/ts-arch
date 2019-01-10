import { toMatchArchRuleLogic } from "./ArchMatchers"
import { Rule } from "../core/Rule"
import { Project } from "../core/Project"
import { Result } from "../core/Result"

describe("Jest ArchMatcher", () => {
	it("should extend jest's expect", () => {
		expect(expect(null).toPass).toBeDefined()
	})

	describe("Jest ArchMatcher Logic", () => {
		let project: Project
		let rule: Rule
		let jestCtx: { isNot: boolean }

		function buildJestContext(negated: boolean): { isNot: boolean } {
			return { isNot: negated }
		}

		function buildArchRule(passing: boolean): Rule {
			return jest.fn<Rule>(() => {
				return {
					check: () => {
						const result = new Result()
						passing ? result.forcePass() : result.forceFail()
						return result
					}
				}
			})()
		}

		beforeEach(() => {
			jestCtx = buildJestContext(false)
			project = jest.fn<Project>(() => {
				return {
					check: (ruleToMatch: any) => {
						return ruleToMatch.check()
					}
				}
			})()
			rule = buildArchRule(true)
		})

		it("should pass without a message when project exists and passing rule exists and jest matcher is not negated", () => {
			const result = toMatchArchRuleLogic(jestCtx, project, rule)
			expect(result).toEqual({ pass: true, message: expect.any(Function) })
		})

		it("should fail without a message when project exists and passing rule exists but jest matcher is negated", () => {
			jestCtx = buildJestContext(true)
			const result = toMatchArchRuleLogic(jestCtx, project, rule)
			expect(result).toEqual({ pass: false, message: expect.any(Function) })
		})

		it("should pass without a message when project exists and failing rule exists and jest matcher is negated", () => {
			jestCtx = buildJestContext(true)
			rule = buildArchRule(false)
			const result = toMatchArchRuleLogic(jestCtx, project, rule)
			expect(result).toEqual({ pass: true, message: expect.any(Function) })
		})

		it("should fail without a message when project exists and failing rule exists and jest matcher is not negated", () => {
			rule = buildArchRule(false)
			const result = toMatchArchRuleLogic(jestCtx, project, rule)
			expect(result).toEqual({ pass: false, message: expect.any(Function) })
		})

		it("should not pass when project does not exist", () => {
			const result = toMatchArchRuleLogic(jestCtx, undefined, rule)
			expect(result).toEqual({ pass: false, message: expect.any(Function) })
		})

		it("should not pass when rule does not exist ", () => {
			const result = toMatchArchRuleLogic(jestCtx, project, undefined)
			expect(result).toEqual({ pass: false, message: expect.any(Function) })
		})
	})
})
