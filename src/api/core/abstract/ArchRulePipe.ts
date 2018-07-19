import { ArchSubject } from './ArchSubject'

export abstract class ArchRulePipe {
  constructor(private input: ArchRulePipe) {}
  abstract filterSubjects(subjects: ArchSubject[]): ArchSubject[]
}
