import { TSArch } from "../src/tsarch"
import "../src/jest/ArchMatchers"

describe("Parser", () => {
	it("all files in pipes folder of this project should be named ...Pipe.ts", async () => {
		const project = await TSArch.parseTypescriptProject("./src")

		const rule = TSArch.defineThat()
			.files()
			.withPathMatching(/.*pipe.*/)
			.should()
			.matchName(/.+.Pipe\.ts($|\n)/)

		const expectSubject = expect(project) as any
		expectSubject.toMatchArchRule(rule)
	})
})
