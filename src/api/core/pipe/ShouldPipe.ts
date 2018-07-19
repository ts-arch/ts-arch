import { ArchSubject } from './ArchSubject'
import { ArchRulePipe } from '../abstract/ArchRulePipe'
import { ArchRule } from '../abstract/ArchRule'
import { HaveNoSubjectsRule } from '../rule/HaveNoSubjectsRule'
import { HaveSubjectsRule } from '../rule/HaveSubjectsRule'
import { NotPipe } from './NotPipe'
import { SubjectPipe } from './SubjectPipe'

export class ShouldPipe extends SubjectPipe {
  constructor(input: ArchRulePipe) {
    super(input)
  }

  public not(): NotPipe {
    return new NotPipe(this)
  }
}
