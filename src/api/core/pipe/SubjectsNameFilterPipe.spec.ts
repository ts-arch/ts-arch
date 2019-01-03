import { ArchRulePipe } from "../abstract/ArchRulePipe"
import { SubjectsNameFilterPipe } from "./SubjectsNameFilterPipe"
import { FileSubject } from "../subject/FileSubject"

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
				new FileSubject("hello world", "a"),
				new FileSubject("hi world", "a")
			])
		).toEqual([new FileSubject("hello world", "a")])
	})
})
