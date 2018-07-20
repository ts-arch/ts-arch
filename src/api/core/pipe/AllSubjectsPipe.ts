import { ArchRulePipe } from '../abstract/ArchRulePipe'
import { ShouldPipe } from './ShouldPipe'
import { SubjectsNameFilterPipe } from './SubjectsNameFilterPipe'

export class AllSubjectsPipe extends ArchRulePipe {
  constructor() {
    super(null)
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
