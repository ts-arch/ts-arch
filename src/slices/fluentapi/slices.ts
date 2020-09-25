import { generateRule } from "../uml/generateRules"
import { sliceByPattern } from "../projections/slicing"
import { project } from "../processing/project"
import { extractGraph } from "../../common/extraction/extractGraph"
import {
	gatherPositiveViolations,
	ViolatingEdge,
	Rule,
	gatherViolations
} from "../assertions/admissibleEdges"
import { Result, err, ok } from "neverthrow"
import fs from "fs"
import {EdgeRule} from "./SliceRule";

export function slicesOfProject(filename?: string): SliceConditionBuilder {
	return new SliceConditionBuilder(filename)
}

export class SliceConditionBuilder {
	constructor(readonly filename?: string) {}

	public definedBy(pattern: string): SlicesShouldCondition {
		return new SlicesShouldCondition(this, pattern)
	}
}

export class SlicesShouldCondition {
	constructor(readonly sliceCondition: SliceConditionBuilder, readonly pattern: string) {}
	public should(): PositiveConditionBuilder {
		return new PositiveConditionBuilder(this)
	}

	public shouldNot(): NegativeSliceCondition {
		return new NegativeSliceCondition(this, [])
	}
}

export class NegativeSliceCondition implements EdgeRule {
	constructor(
		readonly slicesShouldcondition: SlicesShouldCondition,
		private readonly forbiddenEdges: Rule[]
	) {}

	public containDependency(from: string, to: string): NegativeSliceCondition {
		return new NegativeSliceCondition(this.slicesShouldcondition, [
			...this.forbiddenEdges,
			{ source: from, target: to }
		])
	}

	public async check(): Promise<Result<ViolatingEdge[], string>> {
		const graph = await extractGraph(this.slicesShouldcondition.sliceCondition.filename)
		if (graph.isErr()) {
			return err(graph.error)
		}
		const mapFunction = sliceByPattern(this.slicesShouldcondition.pattern)

		const mapped = project(graph.value, mapFunction)
		return ok(gatherViolations(mapped, this.forbiddenEdges))
	}
}

export class PositiveConditionBuilder {
	constructor(readonly slicesShouldCondition: SlicesShouldCondition) {}

	public adhereToDiagram(diagram: string): PositiveSliceCondition {
		return new PositiveSliceCondition(this, { diagram })
	}

	public adhereToDiagramInFile(filename: string): PositiveSliceCondition {
		return new PositiveSliceCondition(this, { filename })
	}
}

export class PositiveSliceCondition implements EdgeRule{
	constructor(
		readonly positiveConditionBuilder: PositiveConditionBuilder,
		readonly diagram: { filename?: string; diagram?: string }
	) {}

	public async check(): Promise<Result<ViolatingEdge[], string>> {
		const graph = await extractGraph(
			this.positiveConditionBuilder.slicesShouldCondition.sliceCondition.filename
		)
		let diagram = this.diagram.diagram
		const filename = this.diagram.filename
		if (graph.isErr()) {
			return err(graph.error)
		}

		if (diagram === undefined) {
			if (filename !== undefined) {
				diagram = fs.readFileSync(filename).toString()
			} else {
				return err("No diagram provided")
			}
		}
		const rules = generateRule(diagram)

		const mapFunction = sliceByPattern(this.positiveConditionBuilder.slicesShouldCondition.pattern)

		const mapped = project(graph.value, mapFunction)
		return ok(gatherPositiveViolations(mapped, rules))
	}
}
