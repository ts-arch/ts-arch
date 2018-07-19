import { ArchSubject } from './ArchSubject'
import { ArchRulePipe } from '../abstract/ArchRulePipe'
import { ArchRule } from '../abstract/ArchRule'
import { HaveNoSubjectsRule } from '../rule/HaveNoSubjectsRule'
import { ShouldPipe } from './ShouldPipe'
import { SubjectsNameFilterPipe } from './SubjectsNameFilterPipe'
import { FileSubject } from '../subject/FileSubject'
import { FilePathFilterPipe } from './FilePathFilterPipe'

export class AllFilesPipe extends ArchRulePipe {
  constructor() {
    super(null)
  }

  public filterSubjects(subjects: ArchSubject[]): ArchSubject[] {
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
