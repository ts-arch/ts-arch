import { ArchSubject } from './ArchSubject'
import { ArchRulePipe } from './ArchRulePipe'
import { ArchProject } from '../ArchProject'

export abstract class ArchRule {
  constructor(public input: ArchRulePipe) {}

  abstract checkCondition(subjects: ArchSubject[]): boolean

  public check(subjects: ArchSubject[]): boolean {
    return this.input.hasNotModifier()
      ? !this.checkCondition(subjects)
      : this.checkCondition(subjects)
  }

  public checkProject(project: ArchProject): boolean {
    return this.check(project.getSubjects())
  }
}
