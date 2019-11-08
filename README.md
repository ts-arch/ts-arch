# TSArch

An architecture unit test framework for Typescript

## Build status

[![Travis](https://travis-ci.org/MaibornWolff/ts-arch.svg?branch=master)](https://travis-ci.org/MaibornWolff/ts-arch)

## Usage

```bash
npm install --save-dev tsarch
```

```typescript

import {TSArch} from 'tsarch'
import 'tsarch/dist/jest'

describe('Architecture', () => {

  it('defines that all files in dog folder should be called ...Dog.ts', async () => {

    const project = await TSArch.parseTypescriptProject('./src')

    const rule = TSArch.defineThat()
      .files()
      .withPathMatching(/.*dog.*/)
      .should()
      .matchName(/.+.Dog\.ts($|\n)/)
      .build()

    expect(project).toPass(rule)

  })

})

```

## Credits

This project is inspired by [TNG's Archunit](https://github.com/TNG/ArchUnit). Initially implemented by [@mrpatpat](https://github.com/mrpatpat) with contributions from:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind are welcome!
