import ArchClasses from './archRuleClasses'
import ArchClass from './archClass'
export default class ArchRuleDefinition {
  public static classes(toInclude: ArchClass[] = []) {
    return new ArchClasses(toInclude)
  }
}
