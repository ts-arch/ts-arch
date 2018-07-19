import { ArchSubject } from './ArchSubject'
import { ArchRulePipe } from '../abstract/ArchRulePipe'
import { HaveNoSubjectsRule } from '../rule/HaveNoSubjectsRule'
import { ShouldPipe } from './ShouldPipe'

export class SubjectsNameFilterPipe extends ArchRulePipe {
  constructor(input: ArchRulePipe, private regex: RegExp) {
    super(input)
  }

  public filterSubjects(subjects: ArchSubject[]): ArchSubject[] {
    return super.filterSubjects(subjects).filter(s => s.getName().match(this.regex))
  }

  public should(): ShouldPipe {
    return new ShouldPipe(this)
  }
}
