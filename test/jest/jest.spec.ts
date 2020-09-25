import "../../jest"
import {filesOfProject} from "../../src/files/fluentapi/files"
import {slicesOfProject} from "../../src/slices/fluentapi/slices";

describe("jest", () => {
	it("file errors produced get propably propagated to jest results", async () => {
		const rule = filesOfProject()
			.inFolder("slices")
			.should()
			.beInFolder("jest")

		await expect(rule).toPassAsync()
	})

	it("edge errors produced get propably propagated to jest results", async () => {
		const diagram = `
		@startuml
		  component [controllers]
		  component [services]
		  [controllers] --> [services]
		@enduml
        `

		const rule = slicesOfProject()
			.definedBy("src/(**)")
			.should()
			.adhereToDiagram(diagram)

		await expect(rule).toPassAsync()
	})
})
