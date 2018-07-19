import { ArchSubject } from './ArchSubject'
import { ArchRulePipe } from '../abstract/ArchRulePipe'
import { ArchRule } from '../abstract/ArchRule'
import { HaveNoSubjectsRule } from '../rule/HaveNoSubjectsRule'
import { HaveSubjectsRule } from '../rule/HaveSubjectsRule'
import { NotPipe } from './NotPipe'

export abstract class SubjectPipe extends ArchRulePipe {
  constructor(input: ArchRulePipe) {
    super(input)
  }

  public haveSubjects(): ArchRule {
    return new HaveSubjectsRule(this)
  }
}
