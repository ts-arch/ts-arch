import { ArchRulePipe } from "../abstract/ArchRulePipe"
import { HaveSubjectsRule } from "./HaveSubjectsRule"
import { FileSubject } from "../subject/FileSubject"

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
			rule.checkCondition([new FileSubject("a", "a"), new FileSubject("a", "a")])
		).toBeTruthy()
	})
})
