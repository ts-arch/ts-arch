import { HaveSubjectsStrategy } from "./HaveSubjectsStrategy"
import { generateFileSubjectMock } from "../../../../test/files-legacy/generators"

describe("'have subjects rule'", () => {
	let rule: HaveSubjectsStrategy

	beforeEach(() => {
		rule = new HaveSubjectsStrategy()
	})

	it("should be false when given no subjects", () => {
		expect(rule.execute(false, []).hasRulePassed()).toBe(false)
	})

	it("should be true when given subjects", () => {
		expect(
			rule
				.execute(false, [generateFileSubjectMock("a/a"), generateFileSubjectMock("a/a")])
				.hasRulePassed()
		).toBe(true)
	})

	it("should be true when given no subjects and not modifier", () => {
		expect(rule.execute(true, []).hasRulePassed()).toBe(true)
	})

	it("should be false when given subjects and not modifier", () => {
		expect(
			rule
				.execute(true, [generateFileSubjectMock("a/a"), generateFileSubjectMock("a/a")])
				.hasRulePassed()
		).toBe(false)
	})
})
