import { ArchRulePipe } from "../abstract/ArchRulePipe"
import { ComplexityRule } from "./ComplexityRule"
import { FileSubject } from "../subject/FileSubject"

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
		const subject = new FileSubject("A.ts", __dirname + "/complexitySamples")
		expect(rule.getMcc(subject)).toBe(13)
	})

	it("should pass mcc<20 rule for A.ts", async () => {
		rule = new ComplexityRule(input, 20)
		const subject = new FileSubject("A.ts", __dirname + "/complexitySamples")
		expect(rule.check([subject])).toBe(true)
	})

	it("should not pass mcc<10 rule for A.ts", async () => {
		rule = new ComplexityRule(input, 10)
		const subject = new FileSubject("A.ts", __dirname + "/complexitySamples")
		expect(rule.check([subject])).toBe(false)
	})

	it("should generate correct results for not negated rule when given A.ts and B.ts", async () => {
		rule = new ComplexityRule(input, 5)
		const a = new FileSubject("A.ts", __dirname + "/complexitySamples")
		const b = new FileSubject("B.ts", __dirname + "/complexitySamples")
		expect(rule.check([a, b])).toBe(false)
		expect(rule.getResult()).toMatchSnapshot()
	})

	it("should generate correct results for negated rule when given A.ts and B.ts", async () => {
		rule = new ComplexityRule(input, 5)
		input.hasNotModifier = () => true
		const a = new FileSubject("A.ts", __dirname + "/complexitySamples")
		const b = new FileSubject("B.ts", __dirname + "/complexitySamples")
		expect(rule.check([a, b])).toBe(false)
		expect(rule.getResult()).toMatchSnapshot()
	})
})
