import { ArchRulePipe } from "../abstract/ArchRulePipe"
import { HaveSubjectsRule } from "./HaveSubjectsRule"
import { generateFileSubjectMock } from "../../../../test/generators"

describe("'have subjects rule'", () => {
	let input
	let rule

	beforeEach(() => {
		input = jest.fn<ArchRulePipe>(() => {
			return {
				filterSubjects: subjects => subjects
			}
		})()
		rule = new HaveSubjectsRule(input)
	})

	it("should be false when given no subjects", () => {
		expect(rule.checkCondition([])).toBeFalsy()
	})

	it("should be true when given subjects", () => {
		expect(
			rule.checkCondition([
				generateFileSubjectMock("a", "a"),
				generateFileSubjectMock("a", "a")
			])
		).toBeTruthy()
	})
})
