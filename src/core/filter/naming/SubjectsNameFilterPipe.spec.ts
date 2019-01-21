import { generateFileSubjectMock } from "../../../../test/generators"
import { EmptyFilter } from "../EmptyFilter"
import { WithNameMatchingFilter } from "./WithNameMatchingFilter"
describe("SubjectsNameFilterPipe", () => {
	let input
	let pipe: WithNameMatchingFilter

	beforeEach(() => {
		input = new EmptyFilter()
		pipe = new WithNameMatchingFilter(input, /hello/)
	})

	it("should be empty when given no subjects", () => {
		expect(pipe.filter([])).toEqual([])
	})

	it("should filter given subjects correctly", () => {
		expect(
			pipe.filter([
				generateFileSubjectMock("a/hello world"),
				generateFileSubjectMock("a/hi world")
			])
		).toEqual([generateFileSubjectMock("a/hello world")])
	})
})
