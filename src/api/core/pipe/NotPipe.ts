import { ArchSubject } from './ArchSubject'
import { ArchRulePipe } from '../abstract/ArchRulePipe'
import { HaveNoSubjectsRule } from '../rule/HaveNoSubjectsRule'
import { SubjectPipe } from './SubjectPipe'

export class NotPipe extends SubjectPipe {
  constructor(input: ArchRulePipe) {
    super(input)
  }

  hasNotModifier(): boolean {
    return true
  }
}
