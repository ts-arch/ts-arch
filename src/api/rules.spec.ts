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
})
