import { TSArch } from '../src/tsarch'

describe('Parser', () => {
  beforeEach(() => {})

  it('should be able to load the ts-arch src folder ', async () => {
    const project = await TSArch.parseTypescriptProject('./src')
    console.log(project.getSubjects())
  })
})
