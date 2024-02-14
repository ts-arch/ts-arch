import { Component, parse, Relationship } from "plantuml-parser"
import { Rule } from "../assertion/admissibleEdges"

export function generateRule(data: string): { rules: Rule[]; containedNodes: string[] } {
	const parsed = parse(data)
	const diagram = parsed[0]
	const rules = diagram.elements
		.map((element) => {
			if (element instanceof Relationship) {
				return [{ source: element.left, target: element.right }]
			} else {
				return []
			}
		})
		.flat()
	const containedNodes = diagram.elements.flatMap((element) => {
		if (element instanceof Component) {
			return [element.name]
		} else {
			return []
		}
	})
	return { rules, containedNodes }
}
