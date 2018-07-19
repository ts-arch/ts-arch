import { ArchSubject } from './ArchSubject'
import { ArchRulePipe } from '../abstract/ArchRulePipe'
import { ArchRule } from '../abstract/ArchRule'
import { HaveNoSubjectsRule } from '../rule/HaveNoSubjectsRule'
import { HaveSubjectsRule } from '../rule/HaveSubjectsRule'
import { NotPipe } from './NotPipe'
import { MatchNameRule } from '../rule/MatchNameRule'

export abstract class SubjectPipe extends ArchRulePipe {
  constructor(input: ArchRulePipe) {
    super(input)
  }

  public haveSubjects(): ArchRule {
    return new HaveSubjectsRule(this)
  }

  public matchName(regex: RegExp): ArchRule {
    return new MatchNameRule(this, regex)
  }
}
