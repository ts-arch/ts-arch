import { slicesOfProject } from "../../../src/slices/fluentapi/slices"
import path from "path"

describe("architecture", () => {
	it("architecture adheres to the config", async () => {
		const diagramLocation = path.resolve("test", "slices", "architecture", "components.puml")

		const violations = await slicesOfProject()
			.definedBy("src/slices/(**)/")
			.should()
			.adhereToDiagramInFile(diagramLocation)
			.check()

		expect(violations._unsafeUnwrap()).toEqual([])
	})
})
