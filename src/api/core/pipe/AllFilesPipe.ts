import { ArchRulePipe } from '../abstract/ArchRulePipe'
import { ArchRule } from '../abstract/ArchRule'
import { ShouldPipe } from './ShouldPipe'
import { SubjectsNameFilterPipe } from './SubjectsNameFilterPipe'
import { FileSubject } from '../subject/FileSubject'
import { FilePathFilterPipe } from './FilePathFilterPipe'
import { ArchSubject } from '../abstract/ArchSubject'

export class AllFilesPipe extends ArchRulePipe {
  constructor() {
    super(null)
  }

  public filterSubjects(subjects: ArchSubject[]): ArchSubject[] {
    // TODO subjects is not an array when using project console.log(super.filterSubjects(subjects[0]));
    return super.filterSubjects(subjects).filter(s => s instanceof FileSubject)
  }

  public withPathMatching(regex: RegExp): FilePathFilterPipe {
    return new FilePathFilterPipe(this, regex)
  }

  public withNameMatching(regex: RegExp): SubjectsNameFilterPipe {
    return new SubjectsNameFilterPipe(this, regex)
  }

  public withNamePrefix(prefix: string): SubjectsNameFilterPipe {
    return new SubjectsNameFilterPipe(this, new RegExp(prefix + '.+.($|\\n)'))
  }

  public withNameSuffix(suffix: string): SubjectsNameFilterPipe {
    return new SubjectsNameFilterPipe(this, new RegExp('.+.' + suffix + '($|\\n)'))
  }

  public should(): ShouldPipe {
    return new ShouldPipe(this)
  }
}
