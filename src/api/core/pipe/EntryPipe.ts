import { ArchSubject } from './ArchSubject'
import { ArchRulePipe } from '../abstract/ArchRulePipe'
import { AllSubjectsPipe } from './AllSubjectsPipe'

export class EntryPipe extends ArchRulePipe {
  constructor() {
    super(null)
  }

  public filterSubjects(subjects: ArchSubject[]): ArchSubject[] {
    return subjects
  }

  public allSubjects(): AllSubjectsPipe {
    return new AllSubjectsPipe()
  }
}
