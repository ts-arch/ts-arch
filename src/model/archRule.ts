import ArchRuleEntity from './archRuleEntity'

interface ArchRuleTransferFunctionData {
  subjects: ArchRuleEntity[]
  result: boolean
}

interface ArchRuleTransferFunction {
  (data: ArchRuleTransferFunctionData): ArchRuleTransferFunctionData
}

export default class ArchRule {
  private transferFn: ArchRuleTransferFunction = data => {
    return {
      subjects: data.subjects,
      result: undefined
    }
  }

  public check(toCheck: ArchRuleEntity[]): boolean {
    return this.transferFn({ subjects: toCheck }).result
  }

  public getTransferFn(): ArchRuleTransferFunction {
    return this.transferFn
  }

  public setTransferFn(fn: ArchRuleTransferFunction) {
    return (this.transferFn = fn)
  }
}
