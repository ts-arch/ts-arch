import { TSArch } from "../../src/files-legacy/TSArch"
import "../../jest"

describe("Project Architecture Rules", () => {
	let project

	beforeAll(async () => {
		project = await TSArch.parseTypescriptProject(__dirname + "/../src/")
	})

	describe("naming", () => {
		it("source files in /filter should have Filter Suffix", () => {
			const rule = TSArch.defineThat()
				.files()
				.withPathMatching(/filter/)
				.withoutNameMatching(/.*spec\.ts/)
				.should()
				.matchName(/.*Filter.ts/)
				.build()

			expect(project).toPass(rule)
		})
	})

	describe("cycles", () => {
		it("the project without test sample files should be cycle free", () => {
			const rule = TSArch.defineThat()
				.files()
				.withoutPathMatching(/sample/)
				.should()
				.beCycleFree()
				.build()

			expect(project).toPass(rule)
		})
	})

	describe("dependencies", () => {
		test.each`
			subjectPath        | objectPath
			${/files/}         | ${/jest/}
			${/files\/checks/} | ${/files\/builder/}
			${/files\/checks/} | ${/files\/filter/}
			${/files\/checks/} | ${/files\/lang/}
			${/files\/checks/} | ${/files\/parser/}
			${/files\/filter/} | ${/files\/builder/}
			${/files\/filter/} | ${/files\/checks/}
			${/files\/filter/} | ${/files\/lang/}
			${/files\/filter/} | ${/files\/parser/}
			${/files\/lang/}   | ${/files\/builder/}
			${/files\/lang/}   | ${/files\/filter/}
			${/files\/lang/}   | ${/files\/checks/}
			${/files\/lang/}   | ${/files\/parser/}
			${/files\/noun/}   | ${/files\/builder/}
			${/files\/noun/}   | ${/files\/checks/}
			${/files\/noun/}   | ${/files\/filter/}
			${/files\/noun/}   | ${/files\/lang/}
			${/files\/noun/}   | ${/files\/parser/}
			${/files\/parser/} | ${/files\/builder/}
			${/files\/parser/} | ${/files\/checks/}
			${/files\/parser/} | ${/files\/filter/}
			${/files\/parser/} | ${/files\/lang/}
		`("$subjectPath should not depend on $objectPath", ({ subjectPath, objectPath }) => {
			const rule = TSArch.defineThat()
				.files()
				.withPathMatching(subjectPath)
				.shouldNot()
				.dependOn()
				.files()
				.withPathMatching(objectPath)
				.build()
			expect(project).toPass(rule)
		})
	})
})
