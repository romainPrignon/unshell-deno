# ![un](./unshell.png) shell

> Set your shell free !

![](https://github.com/romainprignon/unshell-deno/workflows/ci/badge.svg)

Unshell try to fill the gap between shell commands and programming language.
Unshell let you use any binary in your PATH as a Deno function.

You can compose and pipe any function. Mix and match with Deno builtin function.
Unshell spawn processes under the hood.

/!\ Things might break. Use with caution.
Not all binary's options work at the moment


## Install
```ts
import unshell, { exec, execIter, pipe } from "https://deno.land/x/unshell/mod.ts"
```


## Usage

Given the script: `pause.js` to pause all docker containers
```js
import unshell, { exec } from "https://deno.land/x/unshell/mod.ts"

const { docker } = unshell() // import any binary from PATH

const pause = async (ids) => {
  for (const id of ids) {
    await exec(docker.pause(id)) // use like function
  }
}

const fetchContainerIds = async () => {
  const ids = await exec(docker.ps({ q: true, no_trunc: true }))  // use named params for options

  return ids.split('\n').filter(Boolean)
}

await fetchContainerIds()
  .then(pause)
```
- try to run a container `docker run -it --rm ubuntu bash`
- then `deno run --allow-read --allow-env --allow-run pause.js` 
- You just froze a container
- You can see other examples inside spec/ folder

## Contribute
- Please do :)
- See deno.jsonc or makefile

### TODO
- typechecking
- expose better typing info
- better ressource handling (process.close,...)
- port to node

## Inspiration
Unshell is inspired by these modules
- [sh](https://amoffat.github.io/sh/)


## License
The code is available under the [MIT license](LICENSE).
