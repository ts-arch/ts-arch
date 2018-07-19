import { ArchSubject } from './ArchSubject'
import { ArchRulePipe } from './ArchRulePipe'

export abstract class ArchRule {
  constructor(private input: ArchRulePipe) {}
  abstract checkCondition(subjects: ArchSubject[]): boolean
  public check(subjects: ArchSubject[]): boolean {
    return this.input.hasNotModifier()
      ? !this.checkCondition(subjects)
      : this.checkCondition(subjects)
  }
}
