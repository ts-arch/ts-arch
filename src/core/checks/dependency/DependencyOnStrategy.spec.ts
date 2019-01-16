import { DependOnStrategy } from "./DependOnStrategy"
import { FileFactory } from "../../noun/FileFactory"

describe("dependency rule", () => {
	let rule: DependOnStrategy

	it("NoDependencies.ts should have no dependencies", async () => {
		rule = new DependOnStrategy()
		const subject = FileFactory.buildFromPath(__dirname + "/samples/NoDependencies.ts")
		const o1 = FileFactory.buildFromPath(__dirname + "/DependOnStrategy.ts")
		// FIXME allow ../something instead of /../something path.normalize ?
		const o2 = FileFactory.buildFromPath(__dirname + "/../HaveComplexityLowerThanStrategy.ts")
		expect(rule.getDependenciesOfSubject(subject, [o1, o2]).length).toBe(0)
	})

	it("TwoDependenciesInProject.ts should have two dependencies", async () => {
		rule = new DependOnStrategy()
		const subject = FileFactory.buildFromPath(
			__dirname + "/samples/TwoDependenciesInProject.ts"
		)
		const o1 = FileFactory.buildFromPath(__dirname + "/DependOnStrategy.ts")
		const o2 = FileFactory.buildFromPath(__dirname + "/../HaveComplexityLowerThanStrategy.ts")
		expect(rule.getDependenciesOfSubject(subject, [o1, o2]).length).toBe(2)
	})

	it("TwoDependenciesInProject.ts should depend on given objects DependOnStrategy.ts and ../HaveComplexityLowerThanStrategy.ts", async () => {
		rule = new DependOnStrategy()
		const subject = FileFactory.buildFromPath(
			__dirname + "/samples/TwoDependenciesInProject.ts"
		)
		const o1 = FileFactory.buildFromPath(__dirname + "/DependOnStrategy.ts")
		const o2 = FileFactory.buildFromPath(__dirname + "/../HaveComplexityLowerThanStrategy.ts")
		const result = rule.execute(false, [subject], [o1, o2])
		expect(result.hasRulePassed()).toBe(true)
		expect(result.getEntries().length).toBe(2)
	})

	it("TwoDependenciesInProject.ts should not depend on0 given objects DependOnStrategy.ts and ../HaveComplexityLowerThanStrategy.ts", async () => {
		rule = new DependOnStrategy()
		const subject = FileFactory.buildFromPath(
			__dirname + "/samples/TwoDependenciesInProject.ts"
		)
		const o1 = FileFactory.buildFromPath(__dirname + "/DependOnStrategy.ts")
		const o2 = FileFactory.buildFromPath(__dirname + "/../HaveComplexityLowerThanStrategy.ts")
		const result = rule.execute(true, [subject], [o1, o2])
		expect(result.hasRulePassed()).toBe(false)
		expect(result.getEntries().length).toBe(2)
	})

	it("TwoDependenciesInProject.ts has dependencies which are not part of the object", async () => {
		rule = new DependOnStrategy()
		const subject = FileFactory.buildFromPath(
			__dirname + "/samples/TwoDependenciesInProject.ts"
		)
		const result = rule.execute(false, [subject], [])
		expect(result.hasRulePassed()).toBe(false)
		expect(result.getEntries().length).toBe(1)
	})

	it("TwoDependenciesInProject.ts has dependencies which are not part of the object, negated", async () => {
		rule = new DependOnStrategy()
		const subject = FileFactory.buildFromPath(
			__dirname + "/samples/TwoDependenciesInProject.ts"
		)
		const result = rule.execute(true, [subject], [])
		expect(result.hasRulePassed()).toBe(true)
		expect(result.getEntries().length).toBe(1)
	})
})
