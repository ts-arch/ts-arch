import { ArchSubject } from './ArchSubject'
import { ArchRulePipe } from '../abstract/ArchRulePipe'
import { AllSubjectsPipe } from './AllSubjectsPipe'
import { AllFilesPipe } from './AllFilesPipe'

export class EntryPipe extends ArchRulePipe {
  constructor() {
    super(null)
  }

  public all(): AllSubjectsPipe {
    return new AllSubjectsPipe()
  }

  public files(): AllFilesPipe {
    return new AllFilesPipe()
  }
}
