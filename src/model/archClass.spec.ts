import ArchClass from './archClass'

describe('ArchClass', () => {
  it('should return the given name', () => {
    const name = 'Cat'
    const subject = new ArchClass(name)
    expect(subject.getName()).toBe(name)
  })
})
