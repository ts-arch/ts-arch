import { TSArch } from "../../src/core/TSArch"

describe('Type script dependencies', () =>{

	it ('pure typescript', async () => {
		const project = await TSArch.parseTypescriptProject(__dirname + "/ts/")

		const rule = TSArch.defineThat()
			.files()
			.withPathMatching(/client/)
			.shouldNot()
			.dependOn()
			.files()
			.withPathMatching(/server/)
			.build()
		expect(project.check(rule).hasRulePassed()).toBeFalsy();
	})

	it ('typescript and tsx mixed', async () => {
		const project = await TSArch.parseTypescriptProject(__dirname + "/tsx/")

		const rule = TSArch.defineThat()
			.files()
			.withPathMatching(/client/)
			.shouldNot()
			.dependOn()
			.files()
			.withPathMatching(/server/)
			.build()
		expect(project.check(rule).hasRulePassed()).toBeFalsy();
	})
})
