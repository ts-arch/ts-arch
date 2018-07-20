import { ArchRule } from '../abstract/ArchRule'
import { ArchRulePipe } from '../abstract/ArchRulePipe'
import { ArchSubject } from '../abstract/ArchSubject'

export class HaveSubjectsRule extends ArchRule {
  constructor(input: ArchRulePipe) {
    super(input)
  }

  public checkCondition(subjects: ArchSubject[]): boolean {
    return this.input.filterSubjects(subjects).length > 0
  }
}
