import ShouldMediator from './shouldMediator'

describe('ShouldMediator', () => {
  it('should be constructable with no input and return an empty subjects array', () => {
    const shouldMediator = new ShouldMediator<null>()
    expect(shouldMediator.getSubjects()).toEqual([])
  })

  it('should be constructable with empty input and return an empty subjects array', () => {
    const shouldMediator = new ShouldMediator<null>([])
    expect(shouldMediator.getSubjects()).toEqual([])
  })

  it('should be constructable with given input and return the correct subjects', () => {
    const subjects = ['a', 'b']
    const shouldMediator = new ShouldMediator<string>(subjects)
    expect(shouldMediator.getSubjects()).toEqual(subjects)
  })

  it('should be empty with empty input and return an empty subjects array', () => {
    const shouldMediator = new ShouldMediator<null>([])
    expect(shouldMediator.beEmpty()).toBeTruthy()
  })

  it('should not be e,pty with given input and return the correct subjects', () => {
    const subjects = ['a', 'b']
    const shouldMediator = new ShouldMediator<string>(subjects)
    expect(shouldMediator.beEmpty()).toBeFalsy()
  })
})
