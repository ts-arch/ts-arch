import { EntryPipe } from './api/core/pipe/EntryPipe'
import { TypescriptProjectParser } from './parser/TypescriptProjectParser'
import { FileSubject } from './api/core/subject/FileSubject'
import { ArchProject } from './api/core/ArchProject'

export class TSArch {
  static defineThat(): EntryPipe {
    return new EntryPipe()
  }

  static async parseTypescriptProject(path: string): Promise<ArchProject> {
    const parser = new TypescriptProjectParser()
    const files = await parser.parse(path)
    const project = new ArchProject()
    files.forEach(file => {
      const fileSubject = new FileSubject(file.parsedPath.base, file.parsedPath.dir)
      project.addSubject(fileSubject)
    })
    return project
  }
}
