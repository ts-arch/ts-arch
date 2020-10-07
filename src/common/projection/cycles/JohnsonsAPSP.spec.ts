import { JohnsonsAPSP } from "./JohnsonsAPSP"

describe("Johnsons All Pairs Shortest Paths Algorithm", () => {
	function expectArrayElementsToBeEqual(arr1, arr2) {
		arr2.forEach((x) => expect(arr1).toContainEqual(x))
		arr1.forEach((x) => expect(arr2).toContainEqual(x))
		expect(arr1.length).toBe(arr2.length)
	}

	it.each`
		edges
		${[]}
		${[
	{ from: 0, to: 1 },
	{ from: 1, to: 2 }
]}
		${[
	{ from: 0, to: 1 },
	{ from: 1, to: 2 },
	{ from: 2, to: 3 }
]}
		${[
	{ from: 0, to: 1 },
	{ from: 2, to: 3 }
]}
	`("should detect no cycle", ({ edges }) => {
		const johnson = new JohnsonsAPSP()
		expect(johnson.findSimpleCycles(edges)).toEqual([])
	})

	it.each`
		edges | cycles
		${[
	{ from: 0, to: 1 },
	{ from: 1, to: 0 }
]} | ${[[
		{ from: 0, to: 1 },
		{ from: 1, to: 0 }
	]]}
		${[
	{ from: 0, to: 1 },
	{ from: 1, to: 0 },
	{ from: 1, to: 2 },
	{ from: 2, to: 0 }
]} | ${[
	[
		{ from: 0, to: 1 },
		{ from: 1, to: 0 }
	],
	[
		{ from: 0, to: 1 },
		{ from: 1, to: 2 },
		{ from: 2, to: 0 }
	]
]}
		${[
	{ from: 0, to: 1 },
	{ from: 1, to: 2 },
	{ from: 2, to: 0 }
]} | ${[[
		{ from: 0, to: 1 },
		{ from: 1, to: 2 },
		{ from: 2, to: 0 }
	]]}
		${[
	{ from: 1, to: 2 },
	{ from: 1, to: 5 },
	{ from: 2, to: 3 },
	{ from: 3, to: 1 },
	{ from: 3, to: 2 },
	{ from: 3, to: 4 },
	{ from: 3, to: 6 },
	{ from: 4, to: 5 },
	{ from: 5, to: 2 },
	{ from: 6, to: 4 }
]} | ${[
	[
		{ from: 1, to: 2 },
		{ from: 2, to: 3 },
		{ from: 3, to: 1 }
	],
	[
		{ from: 1, to: 5 },
		{ from: 5, to: 2 },
		{ from: 2, to: 3 },
		{ from: 3, to: 1 }
	],
	[
		{ from: 2, to: 3 },
		{ from: 3, to: 2 }
	],
	[
		{ from: 2, to: 3 },
		{ from: 3, to: 4 },
		{ from: 4, to: 5 },
		{ from: 5, to: 2 }
	],
	[
		{ from: 2, to: 3 },
		{ from: 3, to: 6 },
		{ from: 6, to: 4 },
		{ from: 4, to: 5 },
		{
			from: 5,
			to: 2
		}
	]
]}
	`("should detect exact cycles", ({ edges, cycles }) => {
		const johnson = new JohnsonsAPSP()
		expect(johnson.findSimpleCycles(edges)).toEqual(cycles)
	})
})
