import { ArchRulePipe } from '../abstract/ArchRulePipe'
import { SubjectPipe } from './SubjectPipe'

export class NotPipe extends SubjectPipe {
  constructor(input: ArchRulePipe) {
    super(input)
  }

  hasNotModifier(): boolean {
    return true
  }
}
