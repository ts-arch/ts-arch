import * as fs from "fs"
import * as path from "path"
import { Graph } from "./graph"
import { TechnicalError } from "../error/errors"

type Nodes = {
	[index: string]: Outgoing[]
}

type Outgoing = {
	source: string
	target: string
}

export function extractNxGraph(rootFolder?: string): Graph {
	const workspaceRoot = rootFolder ?? guessNxWorkspaceRoot()

	// The location of the project graph was moved from .nx/cache to .nx/workspace-data in Nx v19.2.0
	// If using Nx 19.2.0+ us the new location
	let projectGraphCacheDirectory = absolutePath(
		workspaceRoot,
		process.env["NX_PROJECT_GRAPH_CACHE_DIRECTORY"] ?? defaultWorkspaceDataDirectory(workspaceRoot)
	)
	// If using Nx <19.2.0 use the old location
	if (!fs.existsSync(path.join(projectGraphCacheDirectory, "project-graph.json"))) {
		projectGraphCacheDirectory = absolutePath(workspaceRoot, defaultCacheDirectory(workspaceRoot))
	}
	const depGraph = fs.readFileSync(path.join(projectGraphCacheDirectory, "project-graph.json"))
	const deps: Nodes = JSON.parse(depGraph.toString("utf-8")).dependencies
	return mapToGraph(deps)
}

function mapToGraph(nodes: Nodes): Graph {
	const entries = Object.values(nodes)
	return entries.flatMap((x) => {
		return x.map((y) => {
			return {
				source: y.source,
				target: y.target,
				external: y.target.startsWith("npm:")
			}
		})
	})
}

function absolutePath(root: string, pathName: string): string {
	if (path.isAbsolute(pathName)) {
		return pathName
	} else {
		return path.join(root, pathName)
	}
}

function defaultCacheDirectory(root: string) {
	if (fs.existsSync(path.join(root, "lerna.json")) && !fs.existsSync(path.join(root, "nx.json"))) {
		return path.join(root, "node_modules", ".cache", "nx")
	}
	return path.join(root, ".nx", "cache")
}

function defaultWorkspaceDataDirectory(root: string) {
	return path.join(root, ".nx", "workspace-data")
}

export function guessNxWorkspaceRoot(): string {
	const nxConfigFileName = guessLocationOfNxConfigRecursively(".")
	if (nxConfigFileName === undefined) {
		throw new TechnicalError(`Unable to extract dependency graph: No root folder 
of nx project was given and no nx config file could be resolved.`)
	}

	return path.dirname(nxConfigFileName)
}

function guessLocationOfNxConfigRecursively(pathName: string): string | undefined {
	const dir = fs.readdirSync(pathName)
	for (const fileName of dir) {
		if (path.basename(fileName) === "nx.json") {
			return path.resolve(pathName, "nx.json")
		}
	}
	const levelUp = path.resolve(pathName, "..")
	const pr = path.relative(levelUp, pathName)
	if (pr === "") {
		return undefined
	} else {
		return guessLocationOfNxConfigRecursively(levelUp)
	}
}
