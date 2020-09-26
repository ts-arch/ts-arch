import { Edge } from "./Model"

class Vertex {
	public index: number = -1
	public lowlink: number = -1
	public neighbours: number[] = []

	constructor(private _id: number) {}

	get id(): number {
		return this._id
	}

	equals(v: Vertex): boolean {
		return v._id === this._id
	}
}

export class TrajanSCC {
	private graph: Vertex[] = []
	private index: number = 0
	private stack: Vertex[] = []
	private sccs: Array<Edge[]> = []
	private edges: Edge[] = []

	public findStronglyConnectedComponents(edges: Edge[]): Array<Edge[]> {
		this.init(edges)

		this.graph.forEach((vertex) => {
			if (vertex.index < 0) {
				this.visit(vertex)
			}
		})
		return this.sccs
	}

	private visit(vertex: Vertex) {
		vertex.index = this.index
		vertex.lowlink = this.index
		this.index = this.index + 1
		this.stack.push(vertex)

		for (let i in vertex.neighbours) {
			let v = vertex
			let w = this.graph.find((x) => x.id === vertex.neighbours[i])!

			if (w.index < 0) {
				this.visit(w)
				v.lowlink = Math.min(v.lowlink, w.lowlink)
			} else if (this.stack.includes(w)) {
				v.lowlink = Math.min(v.lowlink, w.index)
			}
		}

		if (vertex.lowlink === vertex.index) {
			let scc: Vertex[] = []
			let w: Vertex = null as any
			if (this.stack.length > 0) {
				do {
					w = this.stack.pop()!
					scc.push(w)
				} while (!vertex.equals(w))
			}
			if (scc.length > 0) {
				const sccEdges: Edge[] = []
				this.edges.forEach((edge) => {
					if (scc.find((x) => x.id === edge.from) && scc.find((x) => x.id === edge.to)) {
						sccEdges.push(edge)
					}
				})
				if (sccEdges.length > 0) {
					this.sccs.push(sccEdges)
				}
			}
		}
	}

	private init(edges: Edge[]) {
		this.edges = edges
		this.graph = []
		edges.forEach((edge) => {
			let v = this.graph.find((x) => x.id === edge.from)
			if (v) {
				if (!v.neighbours.includes(edge.to)) {
					v.neighbours.push(edge.to)
				}
			} else {
				v = new Vertex(edge.from)
				v.neighbours.push(edge.to)
				this.graph.push(v)
			}

			if (!this.graph.find((x) => x.id === edge.to)) {
				this.graph.push(new Vertex(edge.to))
			}
		})
		this.index = 0
		this.stack = []
		this.sccs = []
	}
}
