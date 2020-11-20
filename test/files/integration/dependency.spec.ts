import "../../../jest"
import {FileConditionBuilder, filesOfProject} from "../../../src/files/fluentapi/files";

describe("dependency related integration", () => {

	let files: FileConditionBuilder

	beforeAll(()=>{
		files = filesOfProject(__dirname + "/samples/dependency/tsconfig.json")
	})

	// architecture tests can take a while to finish
	jest.setTimeout(60000);

	it('Component A should not depend on Component B when using relative import paths', async () => {
		const rule = files
			.inFolder('components/ComponentA')
			.shouldNot()
			.dependOnFiles()
			.inFolder('components/ComponentB');

		await expect(rule).toPassAsync();
	});
})
