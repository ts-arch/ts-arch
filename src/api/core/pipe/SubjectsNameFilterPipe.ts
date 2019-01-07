import { ArchRulePipe } from "../abstract/ArchRulePipe"
import { ShouldPipe } from "./ShouldPipe"
import { ArchSubject } from "../abstract/ArchSubject"

export class SubjectsNameFilterPipe extends ArchRulePipe {
	constructor(input: ArchRulePipe, private regex: RegExp, private invert: boolean = false) {
		super(input)
	}

	public filterSubjects(subjects: ArchSubject[]): ArchSubject[] {
		return super.filterSubjects(subjects).filter(s => {
			return this.invert ? !s.getName().match(this.regex) : s.getName().match(this.regex)
		})
	}

	public should(): ShouldPipe {
		return new ShouldPipe(this)
	}
}
