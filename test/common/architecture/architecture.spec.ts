import path from "path"
import {slicesOfProject} from "../../../src/slices/fluentapi/slices";

describe("architecture", () => {
	it("architecture adheres to the config", async () => {
		const diagramLocation = path.resolve("test", "common", "architecture", "components.puml")

		const violations = await slicesOfProject()
			.definedBy("src/common/(**)/")
			.should()
			.adhereToDiagramInFile(diagramLocation)
			.check()

		expect(violations._unsafeUnwrap()).toEqual([])
	})
})
