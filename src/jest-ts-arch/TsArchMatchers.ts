import { ArchProject } from '../api/core/ArchProject'
import { ArchRule } from '../api/core/abstract/ArchRule'

expect.extend({
  toMatchArchRule(project: ArchProject, ruleToMatch: ArchRule) {
    if (project == null) {
      return {
        pass: false,
        message: () => 'expected project as input'
      }
    }

    if (ruleToMatch == null) {
      return {
        pass: false,
        message: () => 'expected rule to match against'
      }
    }

    const result = ruleToMatch.checkProject(project)
    if (this.isNot) {
      return {
        pass: !result
      }
    } else {
      return {
        pass: result
      }
    }
  }
} as any)
