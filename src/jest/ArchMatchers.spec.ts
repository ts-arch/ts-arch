import { toMatchArchRuleLogic } from "./ArchMatchers"
import { ArchProject } from "../api/core/ArchProject"
import { ArchRule } from "../api/core/abstract/ArchRule"
import { ArchResult } from "../api/core/ArchResult"

describe("Jest ArchMatcher", () => {
	it("should extend jest's expect", () => {
		expect(expect(null).toMatchArchRule).toBeDefined()
	})

	describe("Jest ArchMatcher Logic", () => {
		let project: ArchProject
		let rule: ArchRule
		let jestCtx: { isNot: boolean }

		function buildJestContext(negated: boolean): { isNot: boolean } {
			return { isNot: negated }
		}

		function buildArchRule(passing: boolean): ArchRule {
			return jest.fn<ArchRule>(() => {
				return {
					checkProject: () => passing,
					getResult: () => new ArchResult()
				}
			})()
		}

		beforeEach(() => {
			jestCtx = buildJestContext(false)
			project = jest.fn<ArchProject>(() => {
				return {}
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
