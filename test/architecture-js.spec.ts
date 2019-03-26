import { TSArch } from "../index"

describe("JS Architecture Rules", () => {
	let project

	beforeAll(async () => {
		project = await TSArch.parseTypescriptProject(__dirname + "/js")
	})

	describe("complexity", () => {
		it("complexity of source files should be lower than 5", () => {
			const rule = TSArch.defineThat()
				.files()
				.should()
				.haveComplexityLowerThan(5)
				.build()

			expect(project).toPass(rule)
		})
	})

	describe("cycles", () => {
		it("the project without test sample files should be cycle free", () => {
			const rule = TSArch.defineThat()
				.files()
				.should()
				.beCycleFree()
				.build()

			expect(project).toPass(rule)
		})
	})

	describe("dependencies", () => {
		it("C should depend on A even though it uses an import with the .js suffix", () => {
			const rule = TSArch.defineThat()
				.files()
				.withName("C.js")
				.should()
				.dependOn()
				.files()
				.withName("A.js")
				.build()

			expect(project).toPass(rule)
		})

	})
})
