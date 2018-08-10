import { ArchProject } from './ArchProject'

describe('ArchProject', () => {
  it('should have no subjects if not given', () => {
    const project = new ArchProject()
    expect(project.getSubjects()).toEqual([])
  })
})
