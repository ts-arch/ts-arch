import ArchClass from './archClass'
import ShouldMediator from './shouldMediator'

export default class ArchRuleClasses {
  private classes: ArchClass[]

  constructor(toInclude: ArchClass[] = []) {
    this.classes = toInclude
  }

  public getClasses(): ArchClass[] {
    return this.classes
  }

  public withNameMatching(regex: RegExp) {
    const matched = this.classes.filter(c => c.name.match(regex))
    return new ArchRuleClasses(matched)
  }

  public withNameSuffix(suffix: string) {
    return this.withNameMatching('.+.' + suffix + '($|\n)')
  }

  public withNamePrefix(prefix: string) {
    return this.withNameMatching(prefix + '.+.($|\n)')
  }

  public should(): ShouldMediator<ArchRuleClasses> {
    return new ShouldMediator<ArchRuleClasses>(this.classes)
  }
}
