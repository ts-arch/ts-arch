import { ArchRulePipe } from "../abstract/ArchRulePipe"
import { ComplexityRule } from "./ComplexityRule"
import { FileSubject } from "../subject/FileSubject"
import { FileSubjectFactory } from "../subject/FileSubjectFactory"

describe("complexity rule", () => {
	let input
	let rule: ComplexityRule

	beforeEach(() => {
		input = jest.fn<ArchRulePipe>(() => {
			return {
				filterSubjects: subjects => subjects,
				hasNotModifier: () => false
			}
		})()
	})

	it("should calculate correct mcc for A.ts", async () => {
		rule = new ComplexityRule(input, 20)
		const subject = FileSubjectFactory.buildFromPath(__dirname + "/complexitySamples/A.ts")
		expect(rule.getMcc(subject)).toBe(13)
	})

	it("should pass mcc<20 rule for A.ts", async () => {
		rule = new ComplexityRule(input, 20)
		const subject = FileSubjectFactory.buildFromPath(__dirname + "/complexitySamples/A.ts")
		expect(rule.check([subject])).toBe(true)
	})

	it("should not pass mcc<10 rule for A.ts", async () => {
		rule = new ComplexityRule(input, 10)
		const subject = FileSubjectFactory.buildFromPath(__dirname + "/complexitySamples/A.ts")
		expect(rule.check([subject])).toBe(false)
	})

	it("should generate correct results for not negated rule when given A.ts and B.ts", async () => {
		rule = new ComplexityRule(input, 5)
		const a = FileSubjectFactory.buildFromPath(__dirname + "/complexitySamples/A.ts")
		const b = FileSubjectFactory.buildFromPath(__dirname + "/complexitySamples/B.ts")
		expect(rule.check([a, b])).toBe(false)
		expect(rule.getResult().hasRulePassed()).toBe(false)
		expect(rule.getResult().getEntries().length).toBe(2)
		expect(rule.getResult().getEntries()[0].pass).toBe(false)
		expect(rule.getResult().getEntries()[1].pass).toBe(true)
	})

	it("should generate correct results for negated rule when given A.ts and B.ts", async () => {
		rule = new ComplexityRule(input, 5)
		input.hasNotModifier = () => true
		const a = FileSubjectFactory.buildFromPath(__dirname + "/complexitySamples/A.ts")
		const b = FileSubjectFactory.buildFromPath(__dirname + "/complexitySamples/B.ts")
		expect(rule.check([a, b])).toBe(false)
		expect(rule.getResult().hasRulePassed()).toBe(false)
		expect(rule.getResult().getEntries().length).toBe(2)
		expect(rule.getResult().getEntries()[0].pass).toBe(true)
		expect(rule.getResult().getEntries()[1].pass).toBe(false)
	})
})
