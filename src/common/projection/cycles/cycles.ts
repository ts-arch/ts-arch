import { NumberEdge } from "./Model"
import { TrajanSCC } from "./TrajanSCC"
import { JohnsonsAPSP } from "./JohnsonsAPSP"

export function calculateCycles(idEdges: NumberEdge[]) {
	const cycles: Array<NumberEdge[]> = []
	const tarjan = new TrajanSCC()
	const stronglyConnectedComponents = tarjan.findStronglyConnectedComponents(
		idEdges as NumberEdge[]
	)
	stronglyConnectedComponents.forEach((scc) => {
		const johnson = new JohnsonsAPSP()
		if (scc.length > 1) {
			cycles.push(...johnson.findSimpleCycles(scc))
		}
	})
	return cycles
}
