import { TSArch } from './core/TSArch'
import { ArchSubject } from './core/abstract/ArchSubject'
describe('Rules', () => {
  let subjects

  beforeEach(() => {
    subjects = [
      new ArchSubject('DogService'),
      new ArchSubject('DogController'),
      new ArchSubject('DogModel'),
      new ArchSubject('CatController'),
      new ArchSubject('CatFactory')
    ]
  })

  it('all subjects should have no subjects is false', () => {
    const rule = TSArch.defineThat()
      .allSubjects()
      .should()
      .not()
      .haveSubjects()
    expect(rule.check(subjects)).toBeFalsy()
  })

  it('all subjects should have subjects is true', () => {
    const rule = TSArch.defineThat()
      .allSubjects()
      .should()
      .haveSubjects()
    expect(rule.check(subjects)).toBeTruthy()
  })

  it('all subjects with name matching x should have subjects is false', () => {
    const rule = TSArch.defineThat()
      .allSubjects()
      .withNameMatching(/x/)
      .should()
      .haveSubjects()
    expect(rule.check(subjects)).toBeFalsy()
  })

  it('all subjects with name matching .* should have subjects is true', () => {
    const rule = TSArch.defineThat()
      .allSubjects()
      .withNameMatching(/.*/)
      .should()
      .haveSubjects()
    expect(rule.check(subjects)).toBeTruthy()
  })

  it('should find all controllers', () => {
    const pipe = TSArch.defineThat()
      .allSubjects()
      .withNameMatching(/Controller/)
    expect(pipe.filterSubjects(subjects)).toMatchSnapshot()
  })

  it('should find all Dog stuff', () => {
    const pipe = TSArch.defineThat()
      .allSubjects()
      .withNameMatching(/Dog/)
    expect(pipe.filterSubjects(subjects)).toMatchSnapshot()
  })

  it('should find all Services by suffix', () => {
    const pipe = TSArch.defineThat()
      .allSubjects()
      .withNameSuffix('Service') //TODO this is the wrong result
    expect(pipe.filterSubjects(subjects)).toMatchSnapshot()
  })

  it('should find all Dog things by prefix', () => {
    const pipe = TSArch.defineThat()
      .allSubjects()
      .withNamePrefix('Dog') //TODO this is the wrong result
    expect(pipe.filterSubjects(subjects)).toMatchSnapshot()
  })

  it('should not find all Dog things by suffix', () => {
    const pipe = TSArch.defineThat()
      .allSubjects()
      .withNameSuffix('Dog') //TODO this is the wrong result
    expect(pipe.filterSubjects(subjects)).toMatchSnapshot()
  })

  it('should not find all Services by prefix', () => {
    const pipe = TSArch.defineThat()
      .allSubjects()
      .withNamePrefix('Service') //TODO this is the wrong result
    expect(pipe.filterSubjects(subjects)).toMatchSnapshot()
  })
})
