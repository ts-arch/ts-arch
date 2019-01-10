import { Project } from "./core/Project"

describe("Project", () => {
	it("should have no subjects if not given", () => {
		const project = new Project()
		expect(project.getFiles()).toEqual([])
	})
})
