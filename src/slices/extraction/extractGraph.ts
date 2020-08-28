import ts from "typescript"
import fs from "fs"
import { Result, ok, err } from "neverthrow"
import { CompilerOptions } from "typescript"
import glob from "glob"
import path from "path"
import { Edge } from "../domain/graph"

async function guessProjectFiles(globPattern: string): Promise<string[]> {
	return new Promise<string[]>((resolve, reject) => {
		glob(globPattern, (err, files: string[]) => {
			if (err !== null) {
				reject(err)
				return
			}
			resolve(files)
		})
	})
}

// TODO write exception code free everywhere
export function guessLocationOfTsconfig(): string | undefined {
	return guessLocationOfTsconfigRecursively(".")
}

function guessLocationOfTsconfigRecursively(pathName: string): string | undefined {
	const dir = fs.readdirSync(pathName)
	for (const fileName of dir) {
		if (path.basename(fileName) === "tsconfig.json") {
			return path.resolve(pathName, "tsconfig.json")
		}
	}
	const levelUp = path.resolve(pathName, "..")
	if (path.relative(levelUp, pathName) === pathName) {
		return undefined
	} else {
		return guessLocationOfTsconfigRecursively(levelUp)
	}
}

// TODO - distinguish between different import kinds (types, function etc.)
export async function extractGraph(configFileName?: string): Promise<Result<Edge[], string>> {
	let configFile = configFileName
	if (configFile === undefined) {
		configFile = guessLocationOfTsconfig()
	}
	if (configFile === undefined) {
		return err("Could not find configuration file")
	}
	const config = ts.readConfigFile(configFile, (path: string) => {
		return fs.readFileSync(path).toString()
	})

	if (config.error !== undefined) {
		return err("invalid config file")
	}

	const parsedConfig: CompilerOptions = config.config

	const rootDir = path.dirname(path.resolve(configFile))

	// TODO: make configurable
	const globpattern = rootDir + "/**/*.{ts,tsx}"
	const files = await guessProjectFiles(globpattern)

	const host = ts.createCompilerHost(parsedConfig)

	const program = ts.createProgram({
		rootNames: files,
		options: parsedConfig,
		host
	})

	const imports: Edge[] = []

	for (const sourceFile of program.getSourceFiles()) {
		ts.forEachChild(sourceFile, (x) => {
			if (ts.isImportDeclaration(x)) {
				const specifier = x.moduleSpecifier
				const module = (specifier as { text?: string })["text"]
				if (module === undefined) {
					return
				}
				// TODO use module resolution cache
				const resolvedModule = ts.resolveModuleName(module, sourceFile.fileName, parsedConfig, host)
					.resolvedModule
				if (resolvedModule === undefined) {
					return
				}
				const { resolvedFileName, isExternalLibraryImport } = resolvedModule
				const normalizedSourceFileName = path.relative(rootDir, sourceFile.fileName)
				const normalizedTargetFileName = path.relative(rootDir, resolvedFileName)

				imports.push({
					source: normalizedSourceFileName,
					target: normalizedTargetFileName,
					external: isExternalLibraryImport ?? false
				})
			}
		})
	}

	return ok(imports)
}
