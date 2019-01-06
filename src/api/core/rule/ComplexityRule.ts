import { ArchRule } from "../abstract/ArchRule"
import { ArchRulePipe } from "../abstract/ArchRulePipe"
import { ArchSubject } from "../abstract/ArchSubject"
import * as ts from "typescript"
import * as fs from "fs"
import { FileSubject } from "../subject/FileSubject"

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
		const sourceFile = ts.createSourceFile(
			subject.getName(),
			fs.readFileSync(subject.getPath() + "/" + subject.getName()).toString(),
			ts.ScriptTarget.ESNext,
			false
		)
		return this.analyze(sourceFile)
	}

	private analyze(node: ts.Node) {
		let mcc = 0
		switch (node.kind) {
			case ts.SyntaxKind.CaseClause:
			case ts.SyntaxKind.DefaultClause:
			case ts.SyntaxKind.IfStatement:
			case ts.SyntaxKind.VariableDeclaration:
			case ts.SyntaxKind.CallExpression:
				mcc++
				break
		}
		node.forEachChild(c => {
			mcc += this.analyze(c)
		})
		return mcc
	}
}
