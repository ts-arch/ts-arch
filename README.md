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
// imports and applies the jest extensions
import "tsarch/jest"

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
import "tsarch/jest"
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
