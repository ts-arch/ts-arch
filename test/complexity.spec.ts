import { TSArch } from "../src/tsarch"
import "../src/jest/ArchMatchers"
import { ArchProject } from "../src/api/core/ArchProject"
import { generateAnimalSubjectsMock } from "./generators"
import { TypescriptProjectParser } from "../src/parser/TypescriptProjectParser"

describe("Complexity Rules", () => {
	// TODO reduce complexity ? :D
	it("ts-arch complexity", async () => {
		const project = await TypescriptProjectParser.parse(__dirname + "/../src/")

		const rule = TSArch.defineThat()
			.files()
			.should()
			.haveComplexityLowerThan(60)

		expect(project).toMatchArchRule(rule)
	})
})
