import { TSArch } from "../src/tsarch"
import "../src/jest/ArchMatchers"
import { TypescriptProjectParser } from "../src/parser/TypescriptProjectParser"

describe("Complexity Rules", () => {
	it("ts-arch complexity", async () => {
		const project = await TypescriptProjectParser.parse(__dirname + "/../src/")

		const rule = TSArch.defineThat()
			.files()
			.withoutNameMatching(/.*spec\.ts/)
			.should()
			.haveComplexityLowerThan(25)

		expect(project).toMatchArchRule(rule)
	})
})
