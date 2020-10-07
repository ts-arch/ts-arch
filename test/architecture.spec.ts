import "../jest"
import path from "path"
import {slicesOfProject} from "../src/slices/fluentapi/slices";
import {filesOfProject} from "../src/files/fluentapi/files";

describe("architecture", () => {
	jest.setTimeout(60000);

	it("components follow their inner architecture", async () => {
		const diagramLocation = path.resolve("test", "components_inner.puml")

		const rules = ["common", "files", "slices"].map(c => {
			return slicesOfProject()
				.definedBy("src/" + c + "/(**)/")
				.should()
				.adhereToDiagramInFile(diagramLocation)
		})

		for (let i = 0; i < rules.length; i++) {
			await expect(rules[i]).toPassAsync()
		}
	})

	it("common should not depend on specific components", async () => {
		for (const c of ["files", "jest", "slices"]) {
			const rule = filesOfProject()
				.inFolder("src\/common")
				.shouldNot()
				.dependOnFiles()
				.inFolder("src\/"+c)

			await expect(rule).toPassAsync()
		}
	})

	it("files should not depend on forbidden components", async () => {
		for (const c of ["slices", "jest"]) {
			const rule = filesOfProject()
				.inFolder("src\/files")
				.shouldNot()
				.dependOnFiles()
				.inFolder("src\/"+c)

			await expect(rule).toPassAsync()
		}
	})

	it("slices should not depend on forbidden components", async () => {
		for (const c of ["files", "jest"]) {
			const rule = filesOfProject()
				.inFolder("src\/slices")
				.shouldNot()
				.dependOnFiles()
				.inFolder("src\/"+c)

			await expect(rule).toPassAsync()
		}
	})

	it("code should be cycle free", async () => {
		const rule = filesOfProject()
			.inFolder("src\/(common|files|slices|jest)")
			.should()
			.beFreeOfCycles()

		await expect(rule).toPassAsync()
	})
})
