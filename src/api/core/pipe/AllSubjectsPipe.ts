import { ArchSubject } from './ArchSubject'
import { ArchRulePipe } from '../abstract/ArchRulePipe'
import { ArchRule } from '../abstract/ArchRule'
import { HaveNoSubjectsRule } from '../rule/HaveNoSubjectsRule'
import { ShouldPipe } from './ShouldPipe'

export class AllSubjectsPipe extends ArchRulePipe {
  constructor() {
    super(null)
  }

  public should(): ShouldPipe {
    return new ShouldPipe(this)
  }
}
