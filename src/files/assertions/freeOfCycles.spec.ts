import {ProjectedEdge} from "../../common/processing/project";
import {gatherCycleViolations} from "./freeOfCycles";

describe("freeOfCycles", () => {
	describe("when not negated", () => {

		it("should find one violation", () => {
			const edges = [simpleEdge("a", "b"), simpleEdge("b", "c"), simpleEdge("c", "a")]
			const violations = gatherCycleViolations(edges, [])
			expect(violations).toEqual([{"cycle": [{"cumulatedEdges": [], "sourceLabel": "a", "targetLabel": "b"}, {"cumulatedEdges": [], "sourceLabel": "b", "targetLabel": "c"}, {"cumulatedEdges": [], "sourceLabel": "c", "targetLabel": "a"}]}])
		})

		it("should find two violations", () => {
			const edges = [simpleEdge("a", "b"), simpleEdge("b", "a"), simpleEdge("d", "a"), simpleEdge("a", "d")]
			const violations = gatherCycleViolations(edges, [])
			expect(violations).toEqual([{"cycle": [{"cumulatedEdges": [], "sourceLabel": "a", "targetLabel": "b"}, {"cumulatedEdges": [], "sourceLabel": "b", "targetLabel": "a"}]}, {"cycle": [{"cumulatedEdges": [], "sourceLabel": "a", "targetLabel": "d"}, {"cumulatedEdges": [], "sourceLabel": "d", "targetLabel": "a"}]}])
		})

		it("should find one violation because of preconditions", () => {
			const edges = [simpleEdge("aa", "ab"), simpleEdge("ab", "aa"), simpleEdge("fd", "fa"), simpleEdge("fa", "fd")]
			const violations = gatherCycleViolations(edges, ["a."])
			expect(violations).toEqual([{"cycle": [{"cumulatedEdges": [], "sourceLabel": "aa", "targetLabel": "ab"}, {"cumulatedEdges": [], "sourceLabel": "ab", "targetLabel": "aa"}]}])
		})

	})

	function simpleEdge(from: string, to: string): ProjectedEdge {
		return {sourceLabel: from, targetLabel: to, cumulatedEdges:[]}
	}
})
