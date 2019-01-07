import { ArchRulePipe } from "../abstract/ArchRulePipe"
import { HaveSubjectsRule } from "./HaveSubjectsRule"
import { generateFileSubjectMock } from "../../../../test/generators"

describe("'have subjects rule'", () => {
	let input
	let rule

	beforeEach(() => {
		input = jest.fn<ArchRulePipe>(() => {
			return {
				filterSubjects: subjects => subjects,
				hasNotModifier: () => false
			}
		})()
		rule = new HaveSubjectsRule(input)
	})

	it("should be false when given no subjects", () => {
		expect(rule.check([])).toBe(false)
	})

	it("should be true when given subjects", () => {
		expect(
			rule.check([generateFileSubjectMock("a", "a"), generateFileSubjectMock("a", "a")])
		).toBe(true)
	})

	it("should be true when given no subjects and not modifier", () => {
		input.hasNotModifier = () => true
		expect(rule.check([])).toBe(true)
	})

	it("should be false when given subjects and not modifier", () => {
		input.hasNotModifier = () => true
		expect(
			rule.check([generateFileSubjectMock("a", "a"), generateFileSubjectMock("a", "a")])
		).toBe(false)
	})
})
