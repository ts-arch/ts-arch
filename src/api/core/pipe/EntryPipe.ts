import { ArchSubject } from './ArchSubject'
import { ArchRulePipe } from '../abstract/ArchRulePipe'
import { AllSubjectsPipe } from './AllSubjectsPipe'

//TODO it is propably better to differntiate between sources and pipes since sources have no previous pipe and the modifier is fix
export class EntryPipe extends ArchRulePipe {
  constructor() {
    super(null)
  }

  public all(): AllSubjectsPipe {
    return new AllSubjectsPipe()
  }

  public files(): AllSubjectsPipe {
    return new AllSubjectsPipe()
  }
}
