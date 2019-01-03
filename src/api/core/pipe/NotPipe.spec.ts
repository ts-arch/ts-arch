import { ArchRulePipe } from "../abstract/ArchRulePipe"
import { NotPipe } from "./NotPipe"

describe("NotPipe", () => {
	let input
	let pipe

	beforeEach(() => {
		input = jest.fn<ArchRulePipe>(() => {
			return {
				filterSubjects: subjects => subjects
			}
		})()
		pipe = new NotPipe(input)
	})

	it("should always return negation flag", () => {
		expect(pipe.hasNotModifier()).toBe(true)
	})
})
