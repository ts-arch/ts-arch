import { parse, Relationship } from "plantuml-parser"
import {Rule} from "../assertion/admissibleEdges";

export function generateRule(data: string): Rule[] {
	const parsed = parse(data)
	const diagram = parsed[0]
	return diagram.elements
		.map((element) => {
			if (element instanceof Relationship) {
				return [{ source: element.left, target: element.right }]
			} else {
				return []
			}
		})
		.flat()
}
