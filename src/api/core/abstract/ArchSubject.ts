export abstract class ArchSubject {
  constructor(private name: string)

  public getName(): string {
    return this.name
  }
}
