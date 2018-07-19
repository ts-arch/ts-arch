import { EntryPipe } from './pipe/EntryPipe'

export class TSArch {
  static defineThat(): EntryPipe {
    return new EntryPipe()
  }
}
