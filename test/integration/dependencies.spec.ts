import { TSArch } from "../../src/files/TSArch"

describe("Type script dependencies", () => {
	beforeEach(() => {
		TSArch.config.ignore.nodeModules = true
		TSArch.config.ignore.declarations = true
	})

	it("pure typescript", async () => {
		const project = await TSArch.parseTypescriptProject(__dirname + "/ts/")

		const rule = TSArch.defineThat()
			.files()
			.withPathMatching(/client/)
			.shouldNot()
			.dependOn()
			.files()
			.withPathMatching(/server/)
			.build()
		expect(project.check(rule).hasRulePassed()).toBeFalsy()
	})

	it("external (positive case)", async () => {
		TSArch.config.ignore.nodeModules = false
		TSArch.config.ignore.declarations = false
		const project = await TSArch.parseTypescriptProject(__dirname + "/ts/")

		const rule = TSArch.defineThat()
			.files()
			.withPathMatching(/client/)
			.shouldNot()
			.dependOn()
			.files()
			.withPathMatching(/glob/)
			.build()
		expect(project.check(rule).hasRulePassed()).toBeFalsy()
	})

	it("external (negative case)", async () => {
		TSArch.config.ignore.nodeModules = true
		TSArch.config.ignore.declarations = false
		const project = await TSArch.parseTypescriptProject(__dirname + "/ts/")

		const rule = TSArch.defineThat()
			.files()
			.withPathMatching(/client/)
			.shouldNot()
			.dependOn()
			.files()
			.withPathMatching(/glob/)
			.build()
		expect(project.check(rule).hasRulePassed()).toBeTruthy()
	})

	it("typescript and tsx mixed", async () => {
		const project = await TSArch.parseTypescriptProject(__dirname + "/tsx/")

		const rule = TSArch.defineThat()
			.files()
			.withPathMatching(/client/)
			.shouldNot()
			.dependOn()
			.files()
			.withPathMatching(/server/)
			.build()
		expect(project.check(rule).hasRulePassed()).toBeFalsy()
	})

	it("cycle detection for tsx ", async () => {
		const project = await TSArch.parseTypescriptProject(__dirname + "/tsxCycles/")

		const rule = TSArch.defineThat()
			.files()
			.withPathMatching(/client/)
			.should()
			.beCycleFree()
			.build()
		expect(project.check(rule).hasRulePassed()).toBeFalsy()
	})
})
