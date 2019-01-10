import { HaveComplexityLowerThanStrategy } from "./HaveComplexityLowerThanStrategy"
import { FileFactory } from "../noun/FileFactory"

describe("complexity rule", () => {
	let input
	let rule: HaveComplexityLowerThanStrategy

	it("should calculate correct mcc for A.ts", async () => {
		rule = new HaveComplexityLowerThanStrategy(20)
		const subject = FileFactory.buildFromPath(__dirname + "/complexitySamples/A.ts")
		expect(rule.getMcc(subject)).toBe(13)
	})

	it("should pass mcc<20 rule for A.ts", async () => {
		rule = new HaveComplexityLowerThanStrategy(20)
		const subject = FileFactory.buildFromPath(__dirname + "/complexitySamples/A.ts")
		expect(rule.execute(false, [subject]).hasRulePassed()).toBe(true)
	})

	it("should not pass mcc<10 rule for A.ts", async () => {
		rule = new HaveComplexityLowerThanStrategy(10)
		const subject = FileFactory.buildFromPath(__dirname + "/complexitySamples/A.ts")
		expect(rule.execute(false, [subject]).hasRulePassed()).toBe(false)
	})

	it("should generate correct results for not negated rule when given A.ts and B.ts", async () => {
		rule = new HaveComplexityLowerThanStrategy(5)
		const a = FileFactory.buildFromPath(__dirname + "/complexitySamples/A.ts")
		const b = FileFactory.buildFromPath(__dirname + "/complexitySamples/B.ts")
		const result = rule.execute(false, [a, b])
		expect(result.hasRulePassed()).toBe(false)
		expect(result.getEntries().length).toBe(2)
		expect(result.getEntries()[0].pass).toBe(false)
		expect(result.getEntries()[1].pass).toBe(true)
	})

	it("should generate correct results for negated rule when given A.ts and B.ts", async () => {
		rule = new HaveComplexityLowerThanStrategy(5)
		const a = FileFactory.buildFromPath(__dirname + "/complexitySamples/A.ts")
		const b = FileFactory.buildFromPath(__dirname + "/complexitySamples/B.ts")
		const result = rule.execute(true, [a, b])
		expect(result.hasRulePassed()).toBe(false)
		expect(result.getEntries().length).toBe(2)
		expect(result.getEntries()[0].pass).toBe(true)
		expect(result.getEntries()[1].pass).toBe(false)
	})
})
