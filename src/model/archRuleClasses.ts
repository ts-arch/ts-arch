import ShouldMediator from './shouldMediator'
import ArchRule from './archRule'

export default class ArchRuleClasses extends ArchRule {
  constructor(previousTransferFn: ArchRuleTransferFunction) {
    const previousFn = this.getTransferFn
    const fn = () => {}
    this.setTransferFn()
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
