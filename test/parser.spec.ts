import { TSArch } from '../src/tsarch'
import { ArchProject } from '../src/api/core/ArchProject'
import { ArchRule } from '../src/api/core/abstract/ArchRule'

//TODO make it importable as a matcher
//TODO error messages ?
expect.extend({
  toMatchArchRule(project: ArchProject, ruleToMatch: ArchRule) {
    if (project === null) {
      return {
        pass: false,
        message: () => 'expected project as input'
      }
    }

    if (ruleToMatch === null) {
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
})

describe('Parser', () => {
  it('all files in pipes folder of this project should be named ...Pipe.ts', async () => {
    const project = await TSArch.parseTypescriptProject('./src')

    const rule = TSArch.defineThat()
      .files()
      .withPathMatching(/.*pipe.*/)
      .should()
      .matchName(/.+.Pipe\.ts($|\n)/)

    expect(project).toMatchArchRule(rule)
  })
})
