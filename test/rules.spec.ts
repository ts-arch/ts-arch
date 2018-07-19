import { FileSubject } from '../src/api/core/subject/FileSubject'
import { TSArch } from '../src/tsarch'
describe('Rules', () => {
  let subjects

  beforeEach(() => {
    subjects = [
      new FileSubject('DogService', 'C://project/src/service'),
      new FileSubject('DogController', 'C://project/src/controller'),
      new FileSubject('DogModel', 'C://project/src/model'),
      new FileSubject('CatController', 'C://project/src/controller'),
      new FileSubject('CatFactory', 'C://project/src/factory')
    ]
  })

  it('all files should have no subjects is false', () => {
    const rule = TSArch.defineThat()
      .files()
      .should()
      .not()
      .haveSubjects()
    expect(rule.check(subjects)).toBeFalsy()
  })

  it('all subjects should have no subjects is false', () => {
    const rule = TSArch.defineThat()
      .all()
      .should()
      .not()
      .haveSubjects()
    expect(rule.check(subjects)).toBeFalsy()
  })

  it('all subjects should have subjects is true', () => {
    const rule = TSArch.defineThat()
      .all()
      .should()
      .haveSubjects()
    expect(rule.check(subjects)).toBeTruthy()
  })

  it('all subjects with name matching x should have subjects is false', () => {
    const rule = TSArch.defineThat()
      .all()
      .withNameMatching(/x/)
      .should()
      .haveSubjects()
    expect(rule.check(subjects)).toBeFalsy()
  })

  it('all subjects with name matching .* should have subjects is true', () => {
    const rule = TSArch.defineThat()
      .all()
      .withNameMatching(/.*/)
      .should()
      .haveSubjects()
    expect(rule.check(subjects)).toBeTruthy()
  })

  it('should find all controllers', () => {
    const pipe = TSArch.defineThat()
      .all()
      .withNameMatching(/Controller/)
    expect(pipe.filterSubjects(subjects)).toMatchSnapshot()
  })

  it('should find all Dog stuff', () => {
    const pipe = TSArch.defineThat()
      .all()
      .withNameMatching(/Dog/)
    expect(pipe.filterSubjects(subjects)).toMatchSnapshot()
  })

  it('should find all Services by suffix', () => {
    const pipe = TSArch.defineThat()
      .all()
      .withNameSuffix('Service')
    expect(pipe.filterSubjects(subjects)).toMatchSnapshot()
  })

  it('should find all Dog things by prefix', () => {
    const pipe = TSArch.defineThat()
      .all()
      .withNamePrefix('Dog')
    expect(pipe.filterSubjects(subjects)).toMatchSnapshot()
  })

  it('should not find all Dog things by suffix', () => {
    const pipe = TSArch.defineThat()
      .all()
      .withNameSuffix('Dog')
    expect(pipe.filterSubjects(subjects)).toMatchSnapshot()
  })

  it('should not find all Services by prefix', () => {
    const pipe = TSArch.defineThat()
      .all()
      .withNamePrefix('Service')
    expect(pipe.filterSubjects(subjects)).toMatchSnapshot()
  })

  it('should find all Services by file suffix', () => {
    const pipe = TSArch.defineThat()
      .files()
      .withNameSuffix('Service')
    expect(pipe.filterSubjects(subjects)).toMatchSnapshot()
  })

  it('should find all Services by matching path', () => {
    const pipe = TSArch.defineThat()
      .files()
      .withPathMatching('.*service.*')
    expect(pipe.filterSubjects(subjects)).toMatchSnapshot()
  })
})
