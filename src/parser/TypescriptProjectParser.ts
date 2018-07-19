import { File, TypescriptParser } from 'typescript-parser'
import { Glob } from 'glob'

export class TypescriptProjectParser {
  public async parse(rootPath: string): Promise<File[]> {
    const parser = new TypescriptParser()
    const fileNames = await this.getFileNames(rootPath + '/**/*.ts')
    const parsed: File[] = await parser.parseFiles(fileNames, 'ROOT')
    return parsed
  }

  public async getFileNames(globPattern: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      Glob(globPattern, (err, files) => {
        if (err) {
          reject(err)
          return
        }
        resolve(files)
      })
    })
  }
}
