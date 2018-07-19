import { ArchSubject } from './ArchSubject'
import { ArchRulePipe } from '../abstract/ArchRulePipe'
import { HaveNoSubjectsRule } from '../rule/HaveNoSubjectsRule'
import { ShouldPipe } from './ShouldPipe'
import { FileSubject } from '../subject/FileSubject'

export class FilePathFilterPipe extends ArchRulePipe {
  constructor(input: ArchRulePipe, private regex: RegExp) {
    super(input)
  }

  public filterSubjects(subjects: ArchSubject[]): ArchSubject[] {
    return super
      .filterSubjects(subjects)
      .filter(s => s instanceof FileSubject) // this should not be necessary but let us stay safe TODO maybe make Pipes generic for different subject types
      .filter(s => s.getPath().match(this.regex))
  }

  public should(): ShouldPipe {
    return new ShouldPipe(this)
  }
}
