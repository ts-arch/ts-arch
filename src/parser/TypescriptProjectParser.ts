import { File } from 'typescript-parser'
import { TypescriptParser } from 'typescript-parser/TypescriptParser'
import { default as G } from 'glob'
import { ArchProject } from '../api/core/ArchProject'
import { FileSubject } from '../api/core/subject/FileSubject'

export class TypescriptProjectParser {
  public static async parse(rootPath: string): Promise<ArchProject> {
    const parser = new TypescriptParser()
    const fileNames = await TypescriptProjectParser.getFileNames(rootPath + '/**/*.ts')
    const parsed: File[] = await parser.parseFiles(fileNames, 'ROOT')
    const project = new ArchProject()
    parsed.forEach(file => {
      const fileSubject = new FileSubject(file.parsedPath.base, file.parsedPath.dir)
      project.addSubject(fileSubject)
    })
    return project
  }

  public static async getFileNames(globPattern: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      G(globPattern, (err, files: string[]) => {
        if (err) {
          reject(err)
          return
        }
        resolve(files)
      })
    })
  }
}
