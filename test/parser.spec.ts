import { TSArch } from "../src/tsarch"
import "../src/jest/ArchMatchers"

describe("Parser", async () => {
	it("all files in pipes folder of this project should be named ...Pipe.ts or ... Pipe.spec.ts", async () => {
		const project = await TSArch.parseTypescriptProject("./src")

		const rule = TSArch.defineThat()
			.files()
			.withPathMatching(/.*pipe.*/)
			.should()
			.matchName(/.+.Pipe(\.spec)?\.ts($|\n)/)

		expect(project).toMatchArchRule(rule)
	})
})
