import { CheckStrategy } from "../CheckStrategy"
import { Noun } from "../../noun/Noun"
import { Result, ResultEntry } from "../../Result"
import { SyntaxKind, Node } from "typescript"
import { File } from "../../noun/File"

export class HaveComplexityLowerThanStrategy implements CheckStrategy {
	constructor(private value: number) {}

	execute(isNegated: boolean, subjects: Noun[]): Result {
		const result = new Result()
		File.getFrom(subjects).forEach((s) => {
			const mcc = this.getMcc(s)
			if (mcc >= this.value) {
				result.addEntry(this.buildResult(s, isNegated, mcc))
			} else {
				result.addEntry(this.buildResult(s, !isNegated, mcc))
			}
		})
		return result
	}

	private buildResult(s: File, isNegated: boolean, mcc: number): ResultEntry {
		return {
			subject: s,
			pass: isNegated,
			info: this.buildInfo(s, mcc)
		}
	}

	private buildInfo(s: File, mcc: number): string {
		return `${s.getName()} has MCC of ${mcc}.`
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
		node.forEachChild((c) => {
			mcc += this.analyze(c)
		})
		return mcc
	}
}
