import { FileConditionBuilder, filesOfProject } from "../../../src/files/fluentapi/files"
import { extractGraph } from "../../../src/common/extraction/extractGraph"
import path from "path"
describe("Integration test", () => {
	let files: FileConditionBuilder

	beforeAll(() => {
		files = filesOfProject(__dirname + "/samples/namingsample/tsconfig.json")
	})

	it("does not find a violation", async () => {
		const violations = await files
			.inFolder("controllers")
			.should()
			.matchPattern(".*Controller.ts")
			.check()

		expect(violations).toEqual([])
	})

	it("does find a violation", async () => {
		const violations = await files
			.inFolder("controllers")
			.should()
			.matchPattern(".*Service.ts")
			.check()

		expect(violations).toEqual([
			{ checkPattern: ".*Service.ts", projectedNode: { label: "src/controllers/Controller.ts" } }
		])
	})

	it("does find a violation when described as negated rule", async () => {
		const violations = await files
			.inFolder("controllers")
			.shouldNot()
			.matchPattern(".*Controller.ts")
			.check()

		expect(violations).toEqual([
			{ checkPattern: ".*Controller.ts", projectedNode: { label: "src/controllers/Controller.ts" } }
		])
	})

	it("handles absolute imports", async () => {
		const violations = await filesOfProject(
			path.resolve(__dirname, "samples", "absoluteimports", "tsconfig.json")
		)
			.matchingPattern("src/components/ATest")
			.shouldNot()
			.dependOnFiles()
			.matchingPattern("src/components/BTest")
			.check()

		expect(violations).toEqual([
			{
				dependency: {
					cumulatedEdges: [
						{
							typeOnly: false,
							external: false,
							source: "src/components/ATest/ATest.ts",
							target: "src/components/BTest/BTest.ts"
						}
					],
					sourceLabel: "src/components/ATest/ATest.ts",
					targetLabel: "src/components/BTest/BTest.ts"
				}
			}
		])
	})

	it("does not find a violation when described as negated rule", async () => {
		const violations = await files
			.inFolder("controllers")
			.shouldNot()
			.matchPattern(".*Service.ts")
			.check()

		expect(violations).toEqual([])
	})

	it("allows multiple patterns", async () => {
		const violations = await files
			.inFolder("controllers")
			.inFolder("services")
			.should()
			.matchPattern(".*Service.ts")
			.check()

		expect(violations).toEqual([])
	})

	it("checks for cycles", async () => {
		const violations = await files.matchingPattern(".*").should().beFreeOfCycles().check()

		expect(violations).toEqual([
			{
				cycle: [
					{
						cumulatedEdges: [
							{
								external: false,
								typeOnly: false,
								source: "src/services/Service.ts",
								target: "src/controllers/Controller.ts"
							}
						],
						sourceLabel: "src/services/Service.ts",
						targetLabel: "src/controllers/Controller.ts"
					},
					{
						cumulatedEdges: [
							{
								external: false,
								typeOnly: false,
								source: "src/controllers/Controller.ts",
								target: "src/services/Service.ts"
							}
						],
						sourceLabel: "src/controllers/Controller.ts",
						targetLabel: "src/services/Service.ts"
					}
				]
			}
		])
	})

	it("correctly ignores files exlucded by tsconfig", async () => {
		const violations = await filesOfProject(
			path.resolve(__dirname, "samples", "ignores", "tsconfig.json")
		)
			.inFolder("ignore")
			.shouldNot()
			.dependOnFiles()
			.inFolder("dontImport")
			.check()

		expect(violations).toEqual([])
	})
	

	it("does mark type only imports", async () => {
		const graph = await extractGraph(path.resolve(__dirname, "samples", "typeimports", "tsconfig.json"));

		const typeOnly = graph.find(e => e.source.endsWith('typeOnly.ts'));
		const valueImport = graph.find(e => e.source.endsWith('valueImport.ts'));

		expect(typeOnly).toBeDefined();
		expect(valueImport).toBeDefined();
		expect(typeOnly).toEqual(expect.objectContaining({ typeOnly: true }));
		expect(valueImport).toEqual(expect.objectContaining({ typeOnly: false }));
	})

})
