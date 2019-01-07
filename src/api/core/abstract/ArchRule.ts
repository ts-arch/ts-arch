import { ArchSubject } from "./ArchSubject"
import { ArchRulePipe } from "./ArchRulePipe"
import { ArchProject } from "../ArchProject"
import { ArchResult } from "../ArchResult"

export abstract class ArchRule {
	private result: ArchResult

	constructor(public input: ArchRulePipe) {
		this.result = new ArchResult()
	}

	abstract buildResult(subjects: ArchSubject[], hasNotModifier: boolean): ArchResult

	public check(subjects: ArchSubject[]): boolean {
		this.result = this.buildResult(subjects, this.input.hasNotModifier())
		return this.result.hasRulePassed()
	}

	public checkProject(project: ArchProject): boolean {
		return this.check(project.getSubjects())
	}

	public getResult(): ArchResult {
		return this.result
	}
}
