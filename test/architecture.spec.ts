import {TSArch} from "../jest"

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

	describe("complexity", () => {
		it("complexity of source files should be lower than 55", () => {
			const rule = TSArch.defineThat()
				.files()
				.withoutNameMatching(/.*spec\.ts/)
				.should()
				.haveComplexityLowerThan(55)
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
			subjectPath       | objectPath
			${/core/}         | ${/jest/}
			${/core\/checks/} | ${/core\/builder/}
			${/core\/checks/} | ${/core\/filter/}
			${/core\/checks/} | ${/core\/lang/}
			${/core\/checks/} | ${/core\/parser/}
			${/core\/filter/} | ${/core\/builder/}
			${/core\/filter/} | ${/core\/checks/}
			${/core\/filter/} | ${/core\/lang/}
			${/core\/filter/} | ${/core\/parser/}
			${/core\/lang/}   | ${/core\/builder/}
			${/core\/lang/}   | ${/core\/filter/}
			${/core\/lang/}   | ${/core\/checks/}
			${/core\/lang/}   | ${/core\/parser/}
			${/core\/noun/}   | ${/core\/builder/}
			${/core\/noun/}   | ${/core\/checks/}
			${/core\/noun/}   | ${/core\/filter/}
			${/core\/noun/}   | ${/core\/lang/}
			${/core\/noun/}   | ${/core\/parser/}
			${/core\/parser/} | ${/core\/builder/}
			${/core\/parser/} | ${/core\/checks/}
			${/core\/parser/} | ${/core\/filter/}
			${/core\/parser/} | ${/core\/lang/}
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
