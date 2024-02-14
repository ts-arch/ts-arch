# TSArch

It's a library for checking architecture conventions in TypeScript&JavaScript projects using any test framework. You check dependencies between files, folders and slices, check for cyclic dependencies and more. It's similar to ArchUnit but for TS/JS projects.

## Build status

[![Build](https://github.com/ts-arch/ts-arch/actions/workflows/build.yaml/badge.svg)](https://github.com/ts-arch/ts-arch/actions/workflows/build.yaml)

## Installation

```bash
npm install --save-dev tsarch
```

## Usage

The project has currently two perspectives on architecture: file based architecture tests and slice based architecture tests.

### File API

```typescript
// imports and applies the jest extensions
import "tsarch/dist/jest"

// imports the files entrypoint
import {filesOfProject} from "tsarch"

describe("architecture", ()=> {

    // architecture tests can take a while to finish
    jest.setTimeout(60000);

    // we use async await in combination with jest since this project uses asynchronous calls
    it("business logic should not depend on the ui", async ()=> {
        const rule = filesOfProject()
            .inFolder("business")
            .shouldNot()
            .dependOnFiles()
            .inFolder("ui")

        await expect(rule).toPassAsync()
    })

    it("business logic should be cycle free", async ()=> {
        const rule = filesOfProject()
            .inFolder("business")
            .should()
            .beFreeOfCycles()

        await expect(rule).toPassAsync()
    })
})

```

An example without jest and further examples of the usage can be found in the integration tests
in `test/files/integration`. 

### Slices API

Assume that you have an architecture diagram (Plant Uml) as part of your documentation
in the `docs` folder of your project.

```typescript
import "tsarch/dist/jest"
import {slicesOfProject} from "tsarch" 
import * as path from "path"

describe("architecture", ()=> {
    jest.setTimeout(60000);

    it('the architecture adheres to the config', async () => {
    	const diagramLocation = path.resolve('docs', 'components.puml');
    
    	const rule = await slicesOfProject()
    		.definedBy('src/(**)/')
    		.should()
    		.adhereToDiagramInFile(diagramLocation)
    
    	await expect(rule).toPassAsync()
    });
})

```

An example without jest and further examples of the usage can be found in the integration tests
in `test/slices/integration`. 

### Path handling

The path of the project is always relative to a given `tsconfig.json`.
If no `tsconfig.json` is given `ts-arch` tries to find one in a parent
folder, e.g. if your `tsconfig.json` is in the same folder as your `src` folder, then all the paths 
begin with `src/...`

## Dependency checks on nx monorepositories

`ts-arch` supports dependency checks on nx monorepositories. It reads the project graph
and makes it accessible for the slices api.

The following example illustrates this:

```typescript
import "tsarch/dist/jest"
import {slicesOfProject} from "tsarch" 
import * as path from "path"

describe("architecture", ()=> {
    jest.setTimeout(60000);

    it('the architecture adheres to the diagram', async () => {
    	const diagramLocation = path.resolve('docs', 'components.puml');
    
    	const rule = await slicesOfNxProject()
			.ignoringExternalDependencies()
    		.should()
    		.adhereToDiagramInFile(diagramLocation)
			.check()
    
    	await expect(rule).toPassAsync()
    });
})

```
