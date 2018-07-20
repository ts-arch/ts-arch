import { File, TypescriptParser } from 'typescript-parser'
import { Glob } from 'glob'
import { ArchProject } from '../api/core/ArchProject'
import { FileSubject } from '../api/core/subject/FileSubject'

export class TypescriptProjectParser {
  public async parse(rootPath: string): Promise<ArchProject> {
    const parser = new TypescriptParser()
    const fileNames = await this.getFileNames(rootPath + '/**/*.ts')
    const parsed: File[] = await parser.parseFiles(fileNames, 'ROOT')
    const project = new ArchProject()
    parsed.forEach(file => {
      const fileSubject = new FileSubject(file.parsedPath.base, file.parsedPath.dir)
      project.addSubject(fileSubject)
    })
    return project
  }

  public async getFileNames(globPattern: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      Glob(globPattern, (err, files: string[]) => {
        if (err) {
          reject(err)
          return
        }
        resolve(files)
      })
    })
  }
}
