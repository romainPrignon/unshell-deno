// aller, on tente une derniere fois avec le .pipe
// c'est pas jojo xD

import { StringReader, readLines } from "https://deno.land/std@0.115.1/io/mod.ts";

const flow = (cmd) => {
  // const awaitedCmd = await Promise.all(cmd)
  // console.log({ awaitedCmd })

  console.log(`[flow]`, cmd)
  const process = Deno.run({
    cmd: cmd,
    stdout: 'piped',
    stderr: 'piped',
    stdin: 'piped'
  })

  return {
    process,
    pipe(next) {
      console.log(`[pipe]`, cmd, next)
      return {
        process: next.process,
        pipe: next.pipe,
        run: next.run(this)
      }
    },
    run: (prev) => async () => {
      console.log(`[run]`, cmd, prev)
      if (prev) {
        const { stdout: output } = await prev.run()
        // const output = await prev.process.output()
        console.log(output)
        await process.stdin.write(new TextEncoder().encode(output))
        process.stdin.close()
      }

      const status = await process.status() // c'est surment pas le premier process a lancer mais le dernier
      const stdout = new TextDecoder("utf-8").decode(await process.output())
      const stderr = new TextDecoder("utf-8").decode(await process.stderrOutput())
      return { status, stdout, stderr }
    }
  }
  // return new Proxy({
  //   pipe: (next) => {
  //     console.log(`[pipe] next`, next)
  //     next.run(process)

  //     return next
  //   },
  //   run: async (prev) => {
  //     console.log(`[run] prev`, prev)
  //     if (prev) {
  //       const output = await prev.output()
  //       await process.stdin.write(output)
  //       process.stdin.close()
  //     }

  //     const status = await process.status()
  //     const stdout = new TextDecoder("utf-8").decode(await process.output())
  //     const stderr = new TextDecoder("utf-8").decode(await process.stderrOutput())
  //     return { status, stdout, stderr }
  //   }
  // }, {
  //   get: (t, n) => {
  //     return handler(cmd).get(t, n)
  //   }
  // })
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

      const res = flow(this.cmd)
      this.cmd = [this.cmd[0]] // restore command

      return res
    }
  }
})

const formatBin = (name) => {
  return name.replace("_", "-")
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
} = unshell()


// ca marche avec un seul pipe
const r = await echo("foo").pipe(base64()).pipe(base64()).run()
console.log({ r })
