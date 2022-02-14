//on abandonne l'idée du .pipe pour le moment qui est dur a mettre en place
const exec = (cmd) => {
  console.log(`[exec] ${cmd}`)
  const process = Deno.run({
    cmd,
    stdout: 'piped',
    stderr: 'piped',
    stdin: 'piped'
  })
  return async (prev) => {
    if (prev) {
      await process.stdin.write(new TextEncoder().encode(prev.stdout))
      process.stdin.close()
    }

    return {
      pipe: async (next) => {

        // donc call pipe déclenche le flow, c'est pas lazy
        const status = await process.status()
        const stdout = new TextDecoder("utf-8").decode(await process.output())
        const stderr = new TextDecoder("utf-8").decode(await process.stderrOutput())

        console.log({ next })
        if (next) {
          return await next({ stderr, stdout, status })
        } else {
          return { stderr, stdout, status }
        }
      }
    }
  }

  // return async (prev) => {
  //   console.log('[prev]', { bool: !!prev, value: prev })
  //   if (prev) {
  //     await process.stdin.write(new TextEncoder().encode(prev))
  //     process.stdin.close()
  //   }

  //   console.log(`[process] ${cmd}`)
  //   const status = await process.status()
  //   const stdout = new TextDecoder("utf-8").decode(await process.output())
  //   const stderr = new TextDecoder("utf-8").decode(await process.stderrOutput())
  //   // return { status, stdout, stderr }
  //   return stdout
  // }
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

const echoFoo = await exec(['echo', 'foo'])()
const res = await echoFoo.pipe(exec(['base64']))
const res1 = await res.pipe(exec(['base64']))
const res2 = res1.pipe(exec(['base64']))
console.log({ res: await res2.pipe() })
// on abandonne pour le moment
