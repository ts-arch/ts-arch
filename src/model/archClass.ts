import ArchRuleEntity from './archRuleEntity'
export default class ArchClass extends ArchRuleEntity {
  constructor(private name: string) {}

  public getName(): string {
    return this.name
  }
}
