import {gatherDependOnFileViolations} from "./dependOnFiles";
import {ProjectedEdge} from "../../common/projection/projectEdges";

describe("dependOnFiles", () => {
	describe("when negated", () => {
		it("should find violations", () => {
			const edges = [simpleEdge("a", "b"), simpleEdge("b", "c"), simpleEdge("a", "c")]
			const violations = gatherDependOnFileViolations(edges, ["a"], ["b"], true)
			expect(violations).toEqual([{"dependency": {"cumulatedEdges": [], "sourceLabel": "a", "targetLabel": "b"}}])
		})

		it("should find multiple violations", () => {
			const edges = [simpleEdge("a1", "b"), simpleEdge("a2", "c"), simpleEdge("b", "c")]
			const violations = gatherDependOnFileViolations(edges, ["a."], ["(b|c)"], true)
			expect(violations).toEqual([{"dependency": {"cumulatedEdges": [], "sourceLabel": "a1", "targetLabel": "b"}},
				{"dependency": {"cumulatedEdges": [], "sourceLabel": "a2", "targetLabel": "c"}}])
		})

		it("should throw a user error when no patterns are given", () => {
			expect(() => gatherDependOnFileViolations([], [], [], true))
				.toThrow("object and subject patterns must be set")
		})
	})

	describe("when not negated", () => {
		it("should throw a user error when no patterns are given", () => {
			expect(() => gatherDependOnFileViolations([], [], [], false))
				.toThrow("object and subject patterns must be set")
		})

		it("should find multiple violations", () => {
			const edges = [simpleEdge("a", "b"), simpleEdge("b", "c"), simpleEdge("a", "c")]
			const violations = gatherDependOnFileViolations(edges, ["a"], ["b"], false)
			expect(violations).toEqual([{"dependency": {"cumulatedEdges": [], "sourceLabel": "b", "targetLabel": "c"}},
				{"dependency": {"cumulatedEdges": [], "sourceLabel": "a", "targetLabel": "c"}}])
		})

		it("should not find violations", () => {
			const edges = [simpleEdge("a", "b")]
			const violations = gatherDependOnFileViolations(edges, ["a"], ["b"], false)
			expect(violations).toEqual([])
		})
	})

	function simpleEdge(from: string, to: string): ProjectedEdge {
		return {sourceLabel: from, targetLabel: to, cumulatedEdges:[]}
	}
})
