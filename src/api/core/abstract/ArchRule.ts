import { ArchSubject } from './ArchSubject'
import { ArchRulePipe } from './ArchRulePipe'

export abstract class ArchRule {
  constructor(private input: ArchRulePipe) {}
  abstract check(subjects: ArchSubject[]): boolean
}
