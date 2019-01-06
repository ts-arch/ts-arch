import { ArchRule } from "../abstract/ArchRule"
import { ArchRulePipe } from "../abstract/ArchRulePipe"
import { ArchSubject } from "../abstract/ArchSubject"
import { FileSubject } from "../subject/FileSubject"
import { readFileSync } from "fs"
import { createSourceFile, ScriptTarget, Node, SyntaxKind } from "typescript"

export class ComplexityRule extends ArchRule {
	constructor(input: ArchRulePipe, private value: number) {
		super(input)
	}

	public checkCondition(subjects: ArchSubject[]): boolean {
		// TODO how can we manifest types in our pipelines
		let passed = true
		subjects
			.filter(s => s instanceof FileSubject)
			.map(s => s as FileSubject)
			.forEach(s => {
				const mcc = this.getMcc(s)
				if (mcc >= this.value) {
					passed = false
				}
			})
		return passed // TODO return error objects
	}

	// TODO move official typescript parser to Project parser and kick package typescript-parser
	// TODO another option is to use lazy loading like now and then use a cache for already loaded ast's
	public getMcc(subject: FileSubject): number {
		const sourceFile = createSourceFile(
			subject.getName(),
			readFileSync(subject.getPath() + "/" + subject.getName()).toString(),
			ScriptTarget.ESNext,
			false
		)
		return this.analyze(sourceFile)
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
