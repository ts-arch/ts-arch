import { TrajanSCC } from "./TrajanSCC"

describe("Trajans Algorithm for finding strongly connected components in a directed graph", () => {
	function expectArrayElementsToBeEqual(arr1, arr2) {
		arr2.forEach(x => expect(arr1).toContainEqual(x))
		arr1.forEach(x => expect(arr2).toContainEqual(x))
		expect(arr1.length).toBe(arr2.length)
	}

	it.each`
		edges                                                                                                                                                                                                                                                                   | sccs
		${[{ from: 0, to: 1 }, { from: 1, to: 2 }]}                                                                                                                                                                                                                             | ${[]}
		${[{ from: 0, to: 1 }, { from: 1, to: 0 }]}                                                                                                                                                                                                                             | ${[[{ from: 0, to: 1 }, { from: 1, to: 0 }]]}
		${[{ from: 0, to: 1 }, { from: 1, to: 0 }, { from: 2, to: 3 }, { from: 3, to: 2 }]}                                                                                                                                                                                     | ${[[{ from: 0, to: 1 }, { from: 1, to: 0 }], [{ from: 2, to: 3 }, { from: 3, to: 2 }]]}
		${[{ from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 0 }]}                                                                                                                                                                                                         | ${[[{ from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 0 }]]}
		${[{ from: 0, to: 1 }, { from: 1, to: 0 }, { from: 2, to: 3 }, { from: 3, to: 4 }]}                                                                                                                                                                                     | ${[[{ from: 0, to: 1 }, { from: 1, to: 0 }]]}
		${[{ from: 0, to: 1 }, { from: 1, to: 0 }, { from: 1, to: 2 }, { from: 2, to: 3 }]}                                                                                                                                                                                     | ${[[{ from: 0, to: 1 }, { from: 1, to: 0 }]]}
		${[{ from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 0 }, { from: 6, to: 2 }, { from: 6, to: 0 }, { from: 6, to: 4 }, { from: 5, to: 6 }, { from: 5, to: 0 }, { from: 4, to: 5 }, { from: 3, to: 4 }, { from: 7, to: 5 }, { from: 3, to: 7 }, { from: 7, to: 3 }]} | ${[[{ from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 0 }], [{ from: 6, to: 4 }, { from: 5, to: 6 }, { from: 4, to: 5 }], [{ from: 3, to: 7 }, { from: 7, to: 3 }]]}
	`("should detect SCCs", ({ edges, sccs }) => {
		const trajan = new TrajanSCC()
		expect(trajan.findStronglyConnectedComponents(edges)).toEqual(sccs)
	})
})
