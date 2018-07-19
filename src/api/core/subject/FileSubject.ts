import { ArchSubject } from '../abstract/ArchSubject'

export class FileSubject extends ArchSubject {
  constructor(name: string, private path: string) {
    super(name)
  }

  public getPath(): string {
    return this.path
  }
}
