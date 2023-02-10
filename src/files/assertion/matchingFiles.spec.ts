import { gatherRegexMatchingViolations } from "./matchingFiles"
import { ProjectedNode } from "../../common/projection/projectNodes"

describe("matchingFiles", () => {
	describe("when not negated", () => {
		it("should find no violations because of prefiltering", () => {
			const edges = [node("bad/a"), node("bad/b"), node("bad/c")]
			const violations = gatherRegexMatchingViolations(edges, "b", ["good"], false)
			expect(violations).toEqual([])
		})

		it("should find no violations because check pattern is matching", () => {
			const edges = [node("good/az"), node("good/bz"), node("good/cz")]
			const violations = gatherRegexMatchingViolations(edges, "z", ["good"], false)
			expect(violations).toEqual([])
		})

		it("should find violations because not all edges are matching check pattern", () => {
			const edges = [node("good/a"), node("good/b"), node("good/c")]
			const violations = gatherRegexMatchingViolations(edges, "b", ["good"], false)
			expect(violations).toEqual([
				{ checkPattern: "b", projectedNode: { label: "good/a" } },
				{ checkPattern: "b", projectedNode: { label: "good/c" } }
			])
		})
	})

	describe("when negated", () => {
		it("should find no violations because of prefiltering", () => {
			const edges = [node("bad/a"), node("bad/b"), node("bad/c")]
			const violations = gatherRegexMatchingViolations(edges, "b", ["good"], true)
			expect(violations).toEqual([])
		})

		it("should find violations because check pattern is matching", () => {
			const edges = [node("good/az"), node("good/bz"), node("good/cz")]
			const violations = gatherRegexMatchingViolations(edges, "z", ["good"], true)
			expect(violations).toEqual([
				{ checkPattern: "z", projectedNode: { label: "good/az" } },
				{ checkPattern: "z", projectedNode: { label: "good/bz" } },
				{ checkPattern: "z", projectedNode: { label: "good/cz" } }
			])
		})

		it("should find violations because one edge is matching check pattern", () => {
			const edges = [node("good/a"), node("good/b"), node("good/c")]
			const violations = gatherRegexMatchingViolations(edges, "b", ["good"], true)
			expect(violations).toEqual([{ checkPattern: "b", projectedNode: { label: "good/b" } }])
		})
	})

	function node(label: string): ProjectedNode {
		return { label: label }
	}
})
