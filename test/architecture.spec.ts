import "../src/jest/ArchMatchers"
import { ProjectParser } from "../src/core/parser/ProjectParser"
import { RuleBuilder } from "../src/core/builder/RuleBuilder"

describe("Project Architecture Rules", () => {
	let project

	beforeAll(async () => {
		project = await ProjectParser.parse(__dirname + "/../src/")
	})

	describe("naming", () => {
		it("source files in /filter should have Filter Suffix", () => {
			const rule = RuleBuilder.defineThat()
				.files()
				.withPathMatching(/filter/)
				.withoutNameMatching(/.*spec\.ts/)
				.should()
				.matchName(/.*Filter.ts/)
				.build()

			expect(project).toPass(rule)
		})

		it("source files without samples in /checks should have Strategy Suffix", () => {
			const rule = RuleBuilder.defineThat()
				.files()
				.withPathMatching(/checks/)
				.withoutPathMatching(/[sS]amples/)
				.withoutNameMatching(/.*spec\.ts/)
				.should()
				.matchName(/.*Strategy.ts/)
				.build()

			expect(project).toPass(rule)
		})
	})

	describe("complexity", () => {
		it("complexity of source files should be lower than 40", () => {
			const rule = RuleBuilder.defineThat()
				.files()
				.withoutNameMatching(/.*spec\.ts/)
				.should()
				.haveComplexityLowerThan(40)
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
			const rule = RuleBuilder.defineThat()
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
