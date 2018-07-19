import { ArchSubject } from './ArchSubject'
import { ArchRule } from '../abstract/ArchRule'
import { ArchRulePipe } from '../abstract/ArchRulePipe'

export class HaveNoSubjectsRule extends ArchRule {
  constructor(input: ArchRulePipe) {
    super(input)
  }

  public check(subjects: ArchSubject[]): boolean {
    return this.input.filterSubjects(subjects).length === 0
  }
}
