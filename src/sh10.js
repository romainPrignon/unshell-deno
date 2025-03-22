// iter
// ya du mieux! on a compris qu'il fallai un string reader pour arriver a nos fin
// par contre, il faut ajouter une function externe pour faire le readline
// exec et le proxy doivent donc retorner un process ou une abstraction
// donc le pipe ne peut pas etre un pipe std
// car on doit consommer le process
// a moins que l'on puisse pipe les process sans les consule et la bingo

import { StringReader, readLines } from "https://deno.land/std@0.115.1/io/mod.ts";

const exec = (cmd) => {
  console.log(`[exec] ${cmd}`)
  const process = Deno.run({
    cmd,
    stdout: 'piped',
    stderr: 'piped',
    stdin: 'piped'
  })

  return async (prev) => {
    console.log('[prev]', { bool: !!prev, value: prev })
    if (prev) {
      const v = new StringReader(prev)

      for await (const line of readLines(v)) {
        console.log({ line })
        await process.stdin.write(new TextEncoder().encode(line))
      }
      process.stdin.close()
    }

    // return process

    console.log(`[process] ${cmd}`)
    const status = await process.status()
    const stdout = new TextDecoder("utf-8").decode(await process.output())
    const stderr = new TextDecoder("utf-8").decode(await process.stderrOutput())
    return { status, stdout, stderr }
  }
}

const handler = (cmd) => ({
  cmd: cmd || [],
  get(_target, name) {

    name && this.cmd.push(name)
    return (...args) => {

      const newArgs = args.map(arg => {
        return typeof arg === 'function' ? arg() : arg
      })

      this.cmd = this.cmd.concat(...newArgs)

      return new Proxy(async (prev) => {

        const awaitedCmd = await Promise.all(this.cmd)

        console.log({ awaitedCmd })
        // solution 1
        // const p = await exec(awaitedCmd)(prev)

        // const status = await p.status()
        // const stdout = new TextDecoder("utf-8").decode(await p.output())
        // const stderr = new TextDecoder("utf-8").decode(await p.stderrOutput())

        // console.log({ status, stdout, stderr })
        // console.log('\n')
        // this.cmd = [this.cmd[0]] // restore command

        // if (stderr) throw stderr
        // return stdout

        // solution 2
        const { stdout, stderr } = await exec(awaitedCmd)(prev)
        console.log({ stdout, stderr })
        console.log('\n')
        this.cmd = [this.cmd[0]] // restore command

        if (stderr) throw stderr
        return stdout
      }, {
        get: (t, n) => {
          return handler(this.cmd).get(t, n)
        }
      })
    }
  }
})

const formatBin = (name) => {
  return name.replace("_", "-")
}

const pipe = (f1, ...fns) => {
  return async () => {
    const res = fns.reduce(
      async (prev, fn) => {
        return fn(await prev)
      },
      f1(),
    );

    return await res
  }
}

const rootProxyHandler = {
  get(_target, name) {
    const bin = formatBin(name)
    console.log({ name, bin })

    return handler().get(_target, bin)
  }
}

const unshell = () => new Proxy({}, rootProxyHandler)

const {
  echo,
  base64,
  git
} = unshell()

console.log('--- pipe ---')

console.log(`
await pipe(
  echo("foo"),
  base64()
)()
`)
console.log('\n')


const piped = pipe(
  echo("foo"),
  base64(),
  base64()
)

const res = await piped()
console.log({ res })

