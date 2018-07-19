import { ArchSubject } from './ArchSubject'

export abstract class ArchRulePipe {
  constructor(private input: ArchRulePipe) {}

  public filterSubjects(subjects: ArchSubject[]): ArchSubject[] {
    return this.input ? this.input.filterSubjects(subjects) : subjects
  }

  public hasNotModifier(): boolean {
    return this.input ? this.input.hasNotModifier() : false
  }
}
