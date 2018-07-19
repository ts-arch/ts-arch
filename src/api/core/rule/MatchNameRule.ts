import { ArchSubject } from './ArchSubject'
import { ArchRule } from '../abstract/ArchRule'
import { ArchRulePipe } from '../abstract/ArchRulePipe'

export class MatchNameRule extends ArchRule {
  constructor(input: ArchRulePipe, private regex: RegExp) {
    super(input)
  }

  public checkCondition(subjects: ArchSubject[]): boolean {
    return (
      this.input.filterSubjects(subjects).filter(s => !s.getName().match(this.regex)).length === 0
    )
  }
}
