import { ArchSubject } from './ArchSubject'
import { ArchRulePipe } from '../abstract/ArchRulePipe'
import { ArchRule } from '../abstract/ArchRule'
import { HaveNoSubjectsRule } from '../rule/HaveNoSubjectsRule'
import { HaveSubjectsRule } from '../rule/HaveSubjectsRule'

export class ShouldPipe extends ArchRulePipe {
  constructor(input: ArchRulePipe) {
    super(input)
  }

  public filterSubjects(subjects: ArchSubject[]): ArchSubject[] {
    return this.input.filterSubjects(subjects)
  }

  public haveNoSubjects(): ArchRule {
    return new HaveNoSubjectsRule(this)
  }

  public haveSubjects(): ArchRule {
    return new HaveSubjectsRule(this)
  }
}
