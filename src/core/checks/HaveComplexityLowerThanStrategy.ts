import { CheckStrategy } from "./CheckStrategy"
import { Noun } from "../noun/Noun"
import { Result } from "../Result"
import { SyntaxKind, Node } from "typescript"
import { File } from "../noun/File"

export class HaveComplexityLowerThanStrategy implements CheckStrategy {
	constructor(private value: number) {}

	execute(isNegated: boolean, subjects: Noun[]): Result {
		const result = new Result()
		subjects
			.filter(s => s instanceof File)
			.map(s => s as File)
			.forEach(s => {
				const mcc = this.getMcc(s)
				if (mcc >= this.value) {
					result.addEntry({
						subject: s,
						pass: isNegated,
						info: `${s.getName()} has MCC of ${mcc}.`
					})
				} else {
					result.addEntry({
						subject: s,
						pass: !isNegated,
						info: `${s.getName()} has MCC of ${mcc}.`
					})
				}
			})
		return result
	}

	public getMcc(subject: File): number {
		return this.analyze(subject.getSourceFile())
	}

	private analyze(node: Node) {
		let mcc = 0
		switch (node.kind) {
			case SyntaxKind.CaseClause:
			case SyntaxKind.DefaultClause:
			case SyntaxKind.IfStatement:
			case SyntaxKind.VariableDeclaration:
			case SyntaxKind.CallExpression:
				mcc++
				break
		}
		node.forEachChild(c => {
			mcc += this.analyze(c)
		})
		return mcc
	}
}
