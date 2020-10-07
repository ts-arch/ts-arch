import { generateRule } from "../uml/generateRules"
import { extractGraph } from "../../common/extraction/extractGraph"
import fs from "fs"
import {TechnicalError} from "../../common/error/errors";
import {Checkable} from "../../common/fluentapi/checkable";
import {gatherPositiveViolations, gatherViolations, Rule} from "../assertion/admissibleEdges";
import {Violation} from "../../common/assertion/violation";
import {sliceByPattern} from "../projection/slicingProjections";
import {projectEdges} from "../../common/projection/projectEdges";

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

export class NegativeSliceCondition implements Checkable {
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

	public async check(): Promise<Violation[]> {
		const graph = await extractGraph(this.slicesShouldcondition.sliceCondition.filename)
		const mapFunction = sliceByPattern(this.slicesShouldcondition.pattern)
		const mapped = projectEdges(graph, mapFunction)
		return gatherViolations(mapped, this.forbiddenEdges)
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

export class PositiveSliceCondition implements Checkable{
	constructor(
		readonly positiveConditionBuilder: PositiveConditionBuilder,
		readonly diagram: { filename?: string; diagram?: string }
	) {}

	public async check(): Promise<Violation[]> {
		const graph = await extractGraph(
			this.positiveConditionBuilder.slicesShouldCondition.sliceCondition.filename
		)
		let diagram = this.diagram.diagram
		const filename = this.diagram.filename

		if (diagram === undefined) {
			if (filename !== undefined) {
				diagram = fs.readFileSync(filename).toString()
			} else {
				throw new TechnicalError("No diagram provided")
			}
		}
		const rules = generateRule(diagram)

		const mapFunction = sliceByPattern(this.positiveConditionBuilder.slicesShouldCondition.pattern)

		const mapped = projectEdges(graph, mapFunction)
		return gatherPositiveViolations(mapped, rules)
	}
}
