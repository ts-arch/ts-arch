import ts from "typescript"
import fs from "fs"
import path from "path"
import { Edge } from "./graph"
import { TechnicalError } from "../error/errors"
import { normalizeWindowsPaths } from "../util/pathUtils"

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

	const configFileContent = ts.readConfigFile(configFile, (filePath: string) => {
		return fs.readFileSync(filePath).toString()
	})

	if (configFileContent.error !== undefined) {
		throw new TechnicalError("invalid config path")
	}

	const rootDir = path.dirname(path.resolve(configFile))

	// Properly parse the tsconfig JSON into CompilerOptions + file list
	const parsedCommandLine = ts.parseJsonConfigFileContent(
		configFileContent.config,
		ts.sys,
		rootDir,
		undefined,
		configFile
	)

	if (parsedCommandLine.errors.length > 0) {
		// Log but don't throw — some errors may be non-fatal deprecation warnings in TS6
		const fatalErrors = parsedCommandLine.errors.filter(
			(e) => e.category === ts.DiagnosticCategory.Error
		)
		if (fatalErrors.length > 0) {
			throw new TechnicalError(
				"tsconfig parse errors: " +
					fatalErrors.map((e) => ts.flattenDiagnosticMessageText(e.messageText, "\n")).join("; ")
			)
		}
	}

	const compilerHost = ts.createCompilerHost(parsedCommandLine.options)

	// Use the file list from parseJsonConfigFileContent (respects include/exclude)
	const files = parsedCommandLine.fileNames

	if (files.length === 0) {
		throw new TechnicalError("compiler could not resolve project files")
	}

	const program = ts.createProgram({
		rootNames: files,
		options: parsedCommandLine.options,
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

				// ts.resolveModuleName handles path mappings natively when given
				// properly parsed CompilerOptions (including paths, baseUrl, etc.)
				const resolvedModule = ts.resolveModuleName(
					module,
					sourceFile.fileName,
					parsedCommandLine.options,
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
