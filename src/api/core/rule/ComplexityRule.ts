import { ArchRule } from "../abstract/ArchRule"
import { ArchRulePipe } from "../abstract/ArchRulePipe"
import { ArchSubject } from "../abstract/ArchSubject"
import { FileSubject } from "../subject/FileSubject"
import { readFileSync } from "fs"
import { createSourceFile, ScriptTarget, Node, SyntaxKind } from "typescript"
import { ArchResult } from "../ArchResult"

export class ComplexityRule extends ArchRule {
	constructor(input: ArchRulePipe, private value: number) {
		super(input)
	}

	public buildResult(subjects: ArchSubject[], hasNotModifier: boolean): ArchResult {
		const result = new ArchResult()
		subjects
			.filter(s => s instanceof FileSubject)
			.map(s => s as FileSubject)
			.forEach(s => {
				const mcc = this.getMcc(s)
				if (mcc >= this.value) {
					result.addEntry(s, hasNotModifier, `${s.getName()} has MCC of ${mcc}.`)
				} else {
					result.addEntry(s, !hasNotModifier, `${s.getName()} has MCC of ${mcc}.`)
				}
			})
		return result
	}

	public getMcc(subject: FileSubject): number {
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
