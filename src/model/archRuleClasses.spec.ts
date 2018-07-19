import ArchRuleClasses from './archRuleClasses'
import ArchClass from './archClass'

describe('ArchRuleClasses', () => {
  let clazz
  let otherClazz
  let anotherClazz
  let clazzes
  let subjects

  beforeEach(() => {
    clazz = new ArchClass('CatService')
    otherClazz = new ArchClass('DogService')
    anotherClazz = new ArchClass('DogController')
    clazzes = [clazz, otherClazz, anotherClazz]
    subjects = new ArchRuleClasses(clazzes)
  })

  it('should be initially empty', () => {
    const subject = new ArchRuleClasses()
    expect(subject.getClasses()).toEqual([])
  })

  it('should contain one classes when given array of one', () => {
    const clazzes = [clazz]
    const subject = new ArchRuleClasses(clazzes)
    expect(subject.getClasses()).toEqual([clazz])
  })

  it('should contain two classes when given array of two', () => {
    const clazzes = [clazz, otherClazz]
    const subject = new ArchRuleClasses(clazzes)
    expect(subject.getClasses()).toEqual([clazz, otherClazz])
  })

  it("should return all classes with name matching '.*'", () => {
    expect(subjects.withNameMatching('.*').getClasses()).toEqual(clazzes)
    expect(subjects.withNameMatching(/.*/).getClasses()).toEqual(clazzes)
  })

  it("should return service classes with name matching '.*Service'", () => {
    expect(subjects.withNameMatching('.*Service').getClasses()).toEqual([clazz, otherClazz])
    expect(subjects.withNameMatching(/.*Service/).getClasses()).toEqual([clazz, otherClazz])
  })

  it("should return controller classes with name matching '.*Controller'", () => {
    expect(subjects.withNameMatching(/.*Controller/).getClasses()).toEqual([anotherClazz])
  })

  it("should return controller classes with name suffix matching 'Controller'", () => {
    expect(subjects.withNameSuffix('Controller').getClasses()).toEqual([anotherClazz])
  })

  it("should return services classes with name suffix matching 'Service'", () => {
    expect(subjects.withNameSuffix('Service').getClasses()).toEqual([clazz, otherClazz])
  })

  it("should not return dog classes with name suffix matching 'Dog'", () => {
    expect(subjects.withNameSuffix('Dog').getClasses()).toEqual([])
  })

  it("should return dog classes with name prefix matching 'Dog'", () => {
    expect(subjects.withNamePrefix('Dog').getClasses()).toEqual([otherClazz, anotherClazz])
  })

  it("should return dog classes with name prefix matching 'Cat'", () => {
    expect(subjects.withNamePrefix('Cat').getClasses()).toEqual([clazz])
  })

  it("should not return service classes with name prefix matching 'Service'", () => {
    expect(subjects.withNamePrefix('Service').getClasses()).toEqual([])
  })

  it('should return mediator with classes', () => {
    expect(subjects.should().getSubjects()).toEqual(clazzes)
  })
})
