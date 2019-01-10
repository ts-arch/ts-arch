import "../src/jest/ArchMatchers"
import { ProjectParser } from "../src/core/parser/ProjectParser"
import { RuleBuilder } from "../src/core/builder/RuleBuilder"

describe("Complexity Rules", () => {
	it("ts-arch complexity", async () => {
		const project = await ProjectParser.parse(__dirname + "/../src/")
		const rule = RuleBuilder.defineThat()
			.files()
			.withoutNameMatching(/.*spec\.ts/)
			.should()
			.haveComplexityLowerThan(25)
			.build()

		expect(project).toPass(rule)
	})
})
