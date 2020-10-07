import { NumberEdge, NumberNode } from "./Model"

export class CycleUtils {
	public static getOutgoingNeighbours(currentNode: NumberNode, graph: NumberNode[]): NumberNode[] {
		return currentNode.outgoing
			.map((edge) => edge.to)
			.map((id) => graph.find((n) => n.node === id))
			.filter((x) => x !== undefined) as NumberNode[]
	}

	public static transformEdgeData(edges: NumberEdge[]): NumberNode[] {
		const data: NumberNode[] = []

		const uniqueNodes: number[] = CycleUtils.findUniqueNodes(edges)

		uniqueNodes.forEach((id) => {
			data.push({
				node: id,
				incoming: edges.filter((x) => x.to === id),
				outgoing: edges.filter((x) => x.from === id)
			})
		})

		return data
	}

	public static findUniqueNodes(edges: NumberEdge[]): number[] {
		const uniqueNodes: number[] = []

		const pushIfNotFound = (value) => {
			if (uniqueNodes.indexOf(value) === -1) {
				uniqueNodes.push(value)
			}
		}

		edges.forEach((edge) => {
			pushIfNotFound(edge.from)
			pushIfNotFound(edge.to)
		})

		return uniqueNodes
	}
}
