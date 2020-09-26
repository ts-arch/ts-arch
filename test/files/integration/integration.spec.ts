import {filesOfProject} from "../../../src/files/fluentapi/files";

describe("Integration test", () => {

	it("repetitive filtering of files is possible", async () => {
		const violations = await filesOfProject(__dirname + "/samples/filenamingsample/tsconfig.json")
			.matchingPattern(".*Controller\.ts")
			.matchingPattern(".*troller\.ts")
			.inFolder("services")
			.shouldNot()
			.matchPattern(".*\\\\services\\\\.*") // TODO we should unify path notations
			.check()

		expect(violations).toEqual([{"label": "src\\services\\SomeController.ts", "rule": "should not match regex '.*\\\\services\\\\.*'"}])
	})

	it("controllers should not be in services", async () => {
		const violations = await filesOfProject(__dirname + "/samples/filenamingsample/tsconfig.json")
			.matchingPattern(".*Controller\.ts")
			.shouldNot()
			.beInFolder("services") // TODO we should unify path notations
			.check()

		expect(violations).toMatchSnapshot()
	})

	it("services should be named Service", async () => {

		const violations = await filesOfProject(__dirname + "/samples/filenamingsample/tsconfig.json")
			.inFolder("services") // TODO we should unify path notations
			.should()
			.matchPattern(".*Service\.ts")
			.check()

		expect(violations).toMatchSnapshot()
	})
})
