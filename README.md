# TSArch

An architecture unit test framework for Typescript

## Build status

[![Travis](https://travis-ci.org/MaibornWolff/ts-arch.svg?branch=main)](https://travis-ci.org/MaibornWolff/ts-arch)

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

## Architecture Notes

The data flow is extraction -> projection -> assertion and is coordinated by the fluentapi

### fluentapi
This is the api layer of this project. It is the layer that defines the language of rules and their possible combinations. 
It coordinates extraction, projection and assertion in order to get all violations according the given rule.

### extraction
This layer extracts data from the given project

### projection
The projection layer handles processing of extracted graph data into a specific format. The processed data can then be used for 
assertions or further projection.

### assertion
Assertions analyze the projected data and extract violations according to the given rule. They are allowed to make further 
projections in order to achieve their goal, e.g. filter projected edges before projecting them into cycles.

### error
Defines base errors which can be thrown

### util
Utility functions which are not tied to a specific layer
