import { ArchRulePipe } from '../abstract/ArchRulePipe'
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
