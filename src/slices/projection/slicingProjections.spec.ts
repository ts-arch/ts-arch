import { sliceByPattern } from "./slicingProjections"

describe("slicingProjections", () => {
	it("slices sub directories", () => {
		const edge = {
			source: "src/service/blub/Service.ts",
			target: "src/facade/bla/Facade.ts",
			external: false,
			typeOnly: false
		}
		expect(sliceByPattern("src/(**)/")(edge)?.sourceLabel).toEqual("service")
		expect(sliceByPattern("src/(**)/")(edge)?.targetLabel).toEqual("facade")
	})

	it("slices on top level", () => {
		const edge = {
			source: "src/service/Service.ts",
			target: "src/facade/Facade.ts",
			external: false,
			typeOnly: false
		}
		expect(sliceByPattern("src/(**)")(edge)?.sourceLabel).toEqual("service")
		expect(sliceByPattern("src/(**)")(edge)?.targetLabel).toEqual("facade")
	})

	it("detects missing '(**)' in slice pattern", () => {
		expect(() => sliceByPattern("src/(*")).toThrowError()
	})

	it("slices too many occurances of '(**)' in slice pattern", () => {
		expect(() => sliceByPattern("src/(**)/(**)")).toThrowError()
	})
})
