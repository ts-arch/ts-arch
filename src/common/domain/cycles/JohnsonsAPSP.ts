import { Node, Cycle, Edge } from "./Model"
import { CycleUtils } from "./CycleUtils"

interface BlockedBy {
	blocked: Node
	by: Node
}

// see https://www.youtube.com/watch?v=johyrWospv0
export class JohnsonsAPSP {
	private blocked: Node[] = []
	private stack: Node[] = []
	private blockedMap: BlockedBy[] = []
	private graph: Node[] = []
	private start: Node = null as any
	private cycles: Array<Edge[]> = []

	public findSimpleCycles(edges: Edge[]): Array<Edge[]> {
		this.init(edges)
		this.graph.forEach((node) => {
			this.start = node
			this.stack.push(node)
			this.blocked.push(node)
			this.exploreNeighbours(node)
			this.removeFromGraph(node)
		})
		return this.cycles
	}

	private exploreNeighbours(currentNode: Node) {
		CycleUtils.getOutgoingNeighbours(currentNode, this.graph).forEach((neighbour) => {
			if (this.foundCycle(neighbour)) {
				this.cycles.push(this.buildCycle())
			}
			if (!this.isBlocked(neighbour)) {
				this.stack.push(neighbour)
				this.blocked.push(neighbour)
				this.exploreNeighbours(neighbour)
			}
		})
		this.stack.pop()
		if (this.isPartOfCurrentStartCycle(currentNode)) {
			this.unblock(currentNode)
		} else {
			CycleUtils.getOutgoingNeighbours(currentNode, this.graph).forEach((neighbour) => {
				if (this.isBlocked(neighbour)) {
					this.blockedMap.push({ blocked: currentNode, by: neighbour })
				}
			})
		}
	}

	private unblock(node: Node) {
		this.blocked = this.blocked.filter((x) => x !== node)
		const toRemove: BlockedBy[] = []
		this.blockedMap.forEach((blocker) => {
			if (blocker.by === node) {
				this.unblock(blocker.blocked)
				toRemove.push(blocker)
			}
		})
		this.blockedMap = this.blockedMap.filter((x) => !toRemove.includes(x))
	}

	private isPartOfCurrentStartCycle(currentNode: Node): boolean {
		return (
			this.cycles.filter(
				(x) => x[0].from === this.start.node && x.find((y) => y.from === currentNode.node)
			).length > 0
		)
	}

	private init(edges: Edge[]) {
		this.blocked = []
		this.stack = []
		this.blockedMap = []
		this.graph = CycleUtils.transformEdgeData(edges)
		this.cycles = []
	}

	private isBlocked(child: Node) {
		return this.blocked.indexOf(child) !== -1
	}

	private removeFromGraph(toRemove: Node) {
		this.graph.forEach((node) => {
			node.incoming = node.incoming.filter(
				(x) => x.from !== toRemove.node && x.to !== toRemove.node
			)
			node.outgoing = node.outgoing.filter(
				(x) => x.from !== toRemove.node && x.to !== toRemove.node
			)
		})
	}

	private foundCycle(currentNode: Node) {
		return currentNode === this.start
	}

	private buildCycle(): Edge[] {
		const cycleEdges: Edge[] = []
		this.stack
			.map((x) => x.node)
			.forEach((id, i) => {
				cycleEdges.push({ from: id, to: -1 })
				if (i >= 1) {
					cycleEdges[i - 1].to = id
				}
			})
		cycleEdges[cycleEdges.length - 1].to = this.start.node

		return cycleEdges
	}
}
