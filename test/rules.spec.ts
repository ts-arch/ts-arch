import { TSArch } from ".."
import { generateAnimalSubjectsMock } from "./generators"

describe("Basic Rules", () => {
	let subjects

	beforeEach(() => {
		subjects = generateAnimalSubjectsMock()
	})

	it("all files should have no subjects is false", () => {
		const rule = TSArch.defineThat()
			.files()
			.shouldNot()
			.haveSubjects()
			.build()
		expect(rule.check(subjects).hasRulePassed()).toBeFalsy()
	})

	it("all subjects should have no subjects is false", () => {
		const rule = TSArch.defineThat()
			.files()
			.shouldNot()
			.haveSubjects()
			.build()

		expect(rule.check(subjects).hasRulePassed()).toBeFalsy()
	})

	it("all subjects should have subjects is true", () => {
		const rule = TSArch.defineThat()
			.files()
			.should()
			.haveSubjects()
			.build()
		expect(rule.check(subjects).hasRulePassed()).toBeTruthy()
	})

	it("all subjects with name matching x should have subjects is false", () => {
		const rule = TSArch.defineThat()
			.files()
			.withNameMatching(/x/)
			.should()
			.haveSubjects()
			.build()

		expect(rule.check(subjects).hasRulePassed()).toBeFalsy()
	})

	it("all subjects with name matching .* should have subjects is true", () => {
		const rule = TSArch.defineThat()
			.files()
			.withNameMatching(/.*/)
			.should()
			.haveSubjects()
			.build()

		expect(rule.check(subjects).hasRulePassed()).toBeTruthy()
	})
})
