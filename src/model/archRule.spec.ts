import ArchClass from './archClass'
import ArchRule from './archRule'

describe('ArchRule', () => {
  let clazz
  let otherClazz
  let anotherClazz
  let clazzes

  beforeEach(() => {
    clazz = new ArchClass('CatService')
    otherClazz = new ArchClass('DogService')
    anotherClazz = new ArchClass('DogController')
    clazzes = [clazz, otherClazz, anotherClazz]
  })

  it('should initially get a rule which has an undefined result', () => {
    const rule = new ArchRule()
    expect(rule.check([])).toBeUndefined()
  })

  it('should initially get a function which has an undefined result', () => {
    const rule = new ArchRule()
    const fn = rule.getTransferFn()
    expect(fn({ subjects: [] }).result).toBeUndefined()
  })

  it('should initially get a rule which has results in the same subjects as given', () => {
    const rule = new ArchRule()
    const fn = rule.getTransferFn()
    expect(fn({ subjects: ['a', 'b'] }).subjects).toEqual(['a', 'b'])
  })

  it('should get a rule which results in true if given an always true transfer function', () => {
    const rule = new ArchRule()
    const fn = () => {
      return { result: true }
    }
    rule.setTransferFn(fn)
    expect(rule.check([])).toBeTruthy()
  })
})
