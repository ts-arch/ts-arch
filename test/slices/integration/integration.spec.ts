import { parse } from "plantuml-parser"

import { slicesOfNxProject, slicesOfProject } from "../../../src/slices/fluentapi/slices"
import { exportDiagram } from "../../../src/slices/uml/exportDiagram"
import path from "path"
import { extractGraph } from "../../../src/common/extraction/extractGraph"
import {
	sliceByFileSuffix,
	sliceByPattern
} from "../../../src/slices/projection/slicingProjections"
import { projectEdges } from "../../../src/common/projection/projectEdges"
import { gatherPositiveViolations } from "../../../src/slices/assertion/admissibleEdges"

describe("Integration test", () => {
	it("finds simple violations", async () => {
		const violations = await slicesOfProject(__dirname + "/samples/foldersample/tsconfig.json")
			.definedBy("src/(**)/")
			.shouldNot()
			.containDependency("services", "controllers")
			.check()

		expect(violations).toContainEqual({
			projectedEdge: {
				sourceLabel: "services",
				targetLabel: "controllers",
				cumulatedEdges: [
					{
						source: "src/services/util/Service.ts",
						target: "src/controllers/Controller.ts",
						external: false
					}
				]
			},
			rule: { source: "services", target: "controllers" }
		})
	})

	it("reports inner dependencies", async () => {
		const graph = await extractGraph(__dirname + "/samples/innerdependencies/tsconfig.json")

		const mapFunction = sliceByPattern("src/facades/(**)/")

		const sliced = projectEdges(graph, mapFunction)

		expect(gatherPositiveViolations(sliced, [], ["another", "one"], false)).toEqual([
			{
				projectedEdge: {
					cumulatedEdges: [
						{
							external: false,
							source: "src/facades/another/AnotherFacade.ts",
							target: "src/facades/one/OneFacade.ts"
						}
					],
					sourceLabel: "another",
					targetLabel: "one"
				},
				rule: null
			}
		])
	})

	it("finds not adherent parts", async () => {
		const diagram = `
@startuml
  component [controllers]
  component [services]
  [controllers] --> [services]
@enduml
        `
		const violations = await slicesOfProject(__dirname + "/samples/foldersample/tsconfig.json")
			.definedBy("src/(**)/")
			.should()
			.adhereToDiagram(diagram)
			.check()

		expect(violations).toContainEqual({
			rule: null,
			projectedEdge: {
				sourceLabel: "services",
				targetLabel: "controllers",
				cumulatedEdges: [
					{
						source: "src/services/util/Service.ts",
						target: "src/controllers/Controller.ts",
						external: false
					}
				]
			}
		})
	})

	it("reads uml from file", async () => {
		const exampleLocation = path.resolve(__dirname, "samples", "foldersample")
		const exampleConfig = path.resolve(exampleLocation, "tsconfig.json")
		const exampleUml = path.resolve(exampleLocation, "architecture.puml")

		const violations = await slicesOfProject(exampleConfig)
			.definedBy("src/(**)/")
			.should()
			.adhereToDiagramInFile(exampleUml)
			.check()

		expect(violations).toContainEqual({
			rule: null,
			projectedEdge: {
				sourceLabel: "services",
				targetLabel: "controllers",
				cumulatedEdges: [
					{
						source: "src/services/util/Service.ts",
						target: "src/controllers/Controller.ts",
						external: false
					}
				]
			}
		})
	})

	it("exports the architecture by suffixes", async () => {
		const graph = await extractGraph(__dirname + "/samples/suffixsample/tsconfig.json")

		const mapFunction = sliceByFileSuffix(
			new Map([
				["Controller", "controllers"],
				["Service", "services"]
			])
		)

		const reducedGraph = projectEdges(graph, mapFunction)

		const stringDiagram = exportDiagram(reducedGraph)
		const parsedActual = parse(stringDiagram)

		const expectedDiagram = `
@startuml
  component [controllers]
  component [services]
  [controllers] --> [services]
@enduml
            `

		const parsedExpected = parse(expectedDiagram)
		// TODO: test for equivalence of diagrams
		expect(parsedActual).toEqual(parsedExpected)
	})

	it("exports the architecture by folders", async () => {
		const graph = await extractGraph(__dirname + "/samples/foldersample/tsconfig.json")
		const mapFunction = sliceByPattern("src/(**)/")

		const reducedGraph = projectEdges(graph, mapFunction)

		const stringDiagram = exportDiagram(reducedGraph)
		const parsedActual = parse(stringDiagram)

		const expectedDiagram = `
@startuml
  component [services]
  component [controllers]
  [services] --> [controllers]
  [controllers] --> [services]
@enduml
            `

		const parsedExpected = parse(expectedDiagram)
		expect(parsedActual).toEqual(parsedExpected)
	})

	it("finds not adherent parts in nx projects", async () => {
		const diagram = `
@startuml
  component [is-even]
  component [is-odd]
@enduml
        `
		const violations = await slicesOfNxProject(__dirname)
			.should()
			.ignoringExternalDependencies()
			.adhereToDiagram(diagram)
			.check()

		expect(violations).toContainEqual({
			rule: null,
			projectedEdge: {
				sourceLabel: "is-even",
				targetLabel: "is-odd",
				cumulatedEdges: [
					{
						source: "is-even",
						target: "is-odd",
						external: false
					}
				]
			}
		})
	})

	it("ignores parts not listed in architecture diagram", async () => {
		const diagram = `
@startuml
  component [is-even]
@enduml
        `
		const violations = await slicesOfNxProject(__dirname)
			.should()
			.ignoringUnknownNodes()
			.ignoringExternalDependencies()
			.adhereToDiagram(diagram)
			.check()

		expect(violations).toEqual([])
	})
})
