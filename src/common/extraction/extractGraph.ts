import ts, { CompilerHost, TypeAcquisition } from "typescript"
import fs from "fs"
import { CompilerOptions } from "typescript"
import path from "path"
import { Edge } from "./graph"
import { TechnicalError } from "../error/errors"
import { normalizeWindowsPaths } from "../util/pathUtils"
import { ImportPathsResolver } from "@zerollup/ts-helpers"

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
	if (path.relative(levelUp, pathName) === "") {
		return undefined
	} else {
		return guessLocationOfTsconfigRecursively(levelUp)
	}
}

function getProjectFiles(
	rootDir: string,
	compilerHost: CompilerHost,
	config: CompilerOptions & TypeAcquisition
): string[] {
	const files = compilerHost.readDirectory
		? compilerHost.readDirectory(rootDir, ["ts", "tsx"], config.exclude ?? [], config.include ?? [])
		: undefined

	if (files === undefined) {
		throw new TechnicalError("compiler could not resolve project files")
	}
	return files
}

const graphCache: Map<string | undefined, Promise<Edge[]>> = new Map()

export async function extractGraph(configFileName?: string): Promise<Edge[]> {
	const there = graphCache.get(configFileName)
	if (there !== undefined) {
		return there
	} else {
		const computedResult = extractGraphUncached(configFileName)
		graphCache.set(configFileName, computedResult)
		return await computedResult
	}
}

// TODO - distinguish between different import kinds (types, function etc.)
export async function extractGraphUncached(configFileName?: string): Promise<Edge[]> {
	let configFile = configFileName
	if (configFile === undefined) {
		configFile = guessLocationOfTsconfig()
	}
	if (configFile === undefined) {
		throw new TechnicalError("Could not find configuration path")
	}
	const config = ts.readConfigFile(configFile, (path: string) => {
		return fs.readFileSync(path).toString()
	})

	if (config.error !== undefined) {
		throw new TechnicalError("invalid config path")
	}

	const parsedConfig: CompilerOptions = config.config

	const rootDir = path.dirname(path.resolve(configFile))

	const compilerHost = ts.createCompilerHost(parsedConfig)

	const files = getProjectFiles(rootDir, compilerHost, config?.config)

	const program = ts.createProgram({
		rootNames: files ?? [],
		options: parsedConfig,
		host: compilerHost
	})

	const imports: Edge[] = []

	// TODO currently the graph is made of imports as edges. Files that are not imported are not found in this graph.
	for (const sourceFile of program.getSourceFiles()) {
		ts.forEachChild(sourceFile, (x) => {
			if (ts.isImportDeclaration(x)) {
				const normalizedSourceFileName = path.relative(rootDir, sourceFile.fileName)

				const specifier = x.moduleSpecifier
				const module = (specifier as { text?: string })["text"]
				if (module === undefined) {
					return
				}
				const resolver = new ImportPathsResolver((parsedConfig as any).compilerOptions)

				const suggestion = resolver.getImportSuggestions(
					module,
					path.dirname(normalizedSourceFileName)
				)

				const bestGuess = suggestion !== undefined ? suggestion[0] : undefined

				// TODO use module resolution cache
				const resolvedModule = ts.resolveModuleName(
					bestGuess ?? module,
					sourceFile.fileName,
					parsedConfig,
					compilerHost
				).resolvedModule

				if (resolvedModule === undefined) {
					return
				}

				const { resolvedFileName, isExternalLibraryImport } = resolvedModule
				const normalizedTargetFileName = path.relative(rootDir, resolvedFileName)

				imports.push({
					source: normalizeWindowsPaths(normalizedSourceFileName),
					target: normalizeWindowsPaths(normalizedTargetFileName),
					external: isExternalLibraryImport ?? false
				})
			}
		})
	}

	return imports
}
