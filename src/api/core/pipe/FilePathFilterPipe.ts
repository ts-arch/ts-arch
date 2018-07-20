import { ArchRulePipe } from '../abstract/ArchRulePipe'
import { ShouldPipe } from './ShouldPipe'
import { FileSubject } from '../subject/FileSubject'
import { ArchSubject } from '../abstract/ArchSubject'

export class FilePathFilterPipe extends ArchRulePipe {
  constructor(input: ArchRulePipe, private regex: RegExp) {
    super(input)
  }

  public filterSubjects(subjects: ArchSubject[]): ArchSubject[] {
    return super
      .filterSubjects(subjects)
      .filter(s => s instanceof FileSubject)
      .filter(s => (s as FileSubject).getPath().match(this.regex))
  }

  public should(): ShouldPipe {
    return new ShouldPipe(this)
  }
}
