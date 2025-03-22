// iter avec la fonction DO pour exec la commande

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
      const output = await prev.output()
      await process.stdin.write(output)
      process.stdin.close()
    }

    return process
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

        const res = await exec(awaitedCmd)(prev)

        this.cmd = [this.cmd[0]] // restore command
        return res
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

const run = async (process) => {
  const p = await process()
  const status = await p.status()
  const stdout = new TextDecoder("utf-8").decode(await p.output())
  const stderr = new TextDecoder("utf-8").decode(await p.stderrOutput())
  return { status, stdout, stderr }
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
  git,
  docker_compose
} = unshell()

console.log('--- pipe ---')

console.log(`
await pipe(
  echo("foo"),
  base64()
)()
`)
console.log('\n')

console.log(await run(pipe(
  echo("foo"),
  base64(),
  base64()
)))

// pas sur que l'on puisse echaper au proxy async
// du cuop, deux syntax de lancement ()() ou passer par run
const compose = await run(docker_compose().help())
console.log({ compose })
