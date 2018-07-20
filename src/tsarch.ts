import { EntryPipe } from './api/core/pipe/EntryPipe'
import { TypescriptProjectParser } from './parser/TypescriptProjectParser'
import { ArchProject } from './api/core/ArchProject'

export class TSArch {
  static defineThat(): EntryPipe {
    return new EntryPipe()
  }

  static async parseTypescriptProject(path: string): Promise<ArchProject> {
    const project = await TypescriptProjectParser.parse(path)
    return project
  }
}
