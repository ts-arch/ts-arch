import ArchRuleDefinition from './archRuleDefinition'
import ArchClass from './archClass'

describe('ArchRuleDefinition', () => {
  it('should give an empty ArchClasses instance when #classes is called', () => {
    const subject = ArchRuleDefinition.classes()
    expect(subject.getClasses()).toEqual([])
  })

  it('should give an non empty ArchClasses instance when #classes is called and classes are given', () => {
    const clazz = new ArchClass('Cat')
    const otherClazz = new ArchClass('Dog')
    const clazzes = [clazz, otherClazz]
    const subject = ArchRuleDefinition.classes(clazzes)
    expect(subject.getClasses()).toEqual(clazzes)
  })

  it('full test', () => {
    const clazz = new ArchClass('Cat')
    const otherClazz = new ArchClass('Dog')
    const clazzes = [clazz, otherClazz]

    expect(
      ArchRuleDefinition.classes(clazzes)
        .withNameMatching('.*')
        .should()
        .beEmpty()
    ).toBeFalsy()
  })
})
