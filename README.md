# TSArch

An architecture unit test framework for Typescript

## Build status

[![Travis](https://travis-ci.org/MaibornWolff/ts-arch.svg?branch=master)](https://travis-ci.org/MaibornWolff/ts-arch)

## Installation

```bash
npm install --save-dev tsarch
```

## Usage

The project has currently two perspectives on architecture: file based architecture tests and slice based architecture tests.

### File API

```typescript
import { TSArch } from 'tsarch';
import 'tsarch/dist/jest';

describe('Architecture', () => {
	it('defines that all files in dog folder should be called ...Dog.ts', async () => {
		const project = await TSArch.parseTypescriptProject('./src');

		const rule = TSArch.defineThat()
			.files()
			.withPathMatching(/.*dog.*/)
			.should()
			.matchName(/.+.Dog\.ts($|\n)/)
			.build();

		expect(project).toPass(rule);
	});
});
```

Further examples of the usage can be found in the integration tests
in `tests/files/integration`.

### Slices API

Assume that you have an architecture diagram as part of your documentation
in the `docs` folder of your project.

```typescript
it('the architecture adheres to the config', async () => {
	const diagramLocation = path.resolve('docs', 'components.puml');

	const violations = await slicesOfProject()
		.definedBy('src/(**)/')
		.should()
		.adhereToDiagramInFile(diagramLocation)
		.check();

	expect(violations._unsafeUnwrap()).toEqual([]);
});
```

### Path handling

The path of the project is always relative to a given `tsconfig.json`.
If no `tsconfig.json` is given `ts-arch` tries to find one in a parent
folder.

Further examples of the usage can be found in the integration tests
in `tests/files/integration`.
