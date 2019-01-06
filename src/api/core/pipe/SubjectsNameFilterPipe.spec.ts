import { ArchRulePipe } from "../abstract/ArchRulePipe"
import { SubjectsNameFilterPipe } from "./SubjectsNameFilterPipe"
import { FileSubject } from "../subject/FileSubject"
import { generateFileSubjectMock } from "../../../../test/generators"
describe("SubjectsNameFilterPipe", () => {
	let input
	let pipe

	beforeEach(() => {
		input = jest.fn<ArchRulePipe>(() => {
			return {
				filterSubjects: subjects => subjects
			}
		})()
		pipe = new SubjectsNameFilterPipe(input, /hello/)
	})

	it("should be empty when given no subjects", () => {
		expect(pipe.filterSubjects([])).toEqual([])
	})

	it("should filter given subjects correctly", () => {
		expect(
			pipe.filterSubjects([
				generateFileSubjectMock("hello world", "a"),
				generateFileSubjectMock("hi world", "a")
			])
		).toEqual([generateFileSubjectMock("hello world", "a")])
	})
})
