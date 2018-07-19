import { ArchSubject } from './ArchSubject'
import { ArchRulePipe } from '../abstract/ArchRulePipe'
import { ArchRule } from '../abstract/ArchRule'
import { HaveNoSubjectsRule } from '../rule/HaveNoSubjectsRule'
import { ShouldPipe } from './ShouldPipe'
import { SubjectsNameFilterPipe } from './SubjectsNameFilterPipe'

export class AllSubjectsPipe extends ArchRulePipe {
  constructor() {
    super(null)
  }

  public withNameMatching(regex: RegExp): SubjectsNameFilterPipe {
    return new SubjectsNameFilterPipe(this, regex)
  }

  public should(): ShouldPipe {
    return new ShouldPipe(this)
  }
}
