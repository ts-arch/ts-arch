import { Edge } from "../../common/extraction/graph"
import { safeArrayGet } from "../../common/util/arrayUtils"
import {MapFunction, MappedEdge} from "../../common/projection/projectEdges";

export function sliceByPattern(pattern: string): MapFunction {
	const regexp = pattern.replace("(**)", "([\\w].+)")
	return sliceByRegex(new RegExp(`^${regexp}`))
}

export function sliceByRegex(regexp: RegExp): MapFunction {
	return function slice(edge: Edge): MappedEdge | undefined {
		let source = edge.source
		let target = edge.target
		if (!edge.external) {
			const strippedSource = stripSlice(source, regexp)
			if (strippedSource === undefined) {
				return undefined
			}

			const strippedTarget = stripSlice(target, regexp)
			if (strippedTarget === undefined) {
				return undefined
			}

			if (strippedSource === strippedTarget) {
				return undefined
			}

			return {
				sourceLabel: strippedSource,
				targetLabel: strippedTarget
			}
		} else {
			return undefined
		}
	}
}

function stripSlice(relativeFileName: string, stripRegexp: RegExp): string | undefined {
	const strippedFileName = stripRegexp.exec(relativeFileName)
	if (strippedFileName === null) {
		return undefined
	}
	const match = safeArrayGet(strippedFileName, 1)
	if (match === undefined) {
		return undefined
	}
	return strippedFileName[1] ?? undefined
}

export function sliceByFileSuffix(labeling: Map<string, string>): MapFunction {
	return function slice(edge: Edge): MappedEdge | undefined {
		let sourceMatch: string | undefined = undefined
		let targetMatch: string | undefined = undefined
		for (const [suffix, label] of labeling.entries()) {
			if (edge.source.endsWith(`${suffix}.ts`)) {
				sourceMatch = label
			}
			if (edge.target.endsWith(`${suffix}.ts`)) {
				targetMatch = label
			}
			if (sourceMatch !== undefined && targetMatch !== undefined) {
				return {
					sourceLabel: sourceMatch,
					targetLabel: targetMatch
				}
			}
		}
		return undefined
	}
}
