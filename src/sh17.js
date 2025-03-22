// on cherche a regler le souci des echo qui sont pas reset

const run = (cmd, prev) => {
  return async () => {
    const newCmd = await Promise.all(cmd.map(async c => typeof c === 'function' ? (await exec(c)).stdout : c).flat())

    const process = Deno.run({
      cmd: newCmd,
      stdout: 'piped',
      stderr: 'piped',
      stdin: 'piped'
    })

    if (prev) {
      const prevProcess = await prev()
      const output = await prevProcess.output()
      await process.stdin.write(output)
      process.stdin.close()
    }

    return process
  }
}

const resolve = async (process) => {
  const status = await process.status()
  const stdout = new TextDecoder("utf-8").decode(await process.output())
  const stderr = new TextDecoder("utf-8").decode(await process.stderrOutput())

  if (stderr) throw stderr
  return { status, stdout }
}

const exec = async (cmd) => {
  // return resolve(await cmd()())
  const _cmd = await cmd()
  if (_cmd instanceof Deno.Process) { // j'aime pas car dependant de deno, du type de command,....
    return resolve(_cmd)
  }

  const runner = run(cmd())
  const process = await runner()
  return resolve(process)
}


const handler = (cmd = []) => {
  let _cmd = [...cmd]
  return {
    get(_target, name) {

      if (name === 'name') return // comprendre ce truc !!!!!
      _cmd.push(name)

      return new Proxy((...opts) => {
        _cmd.push(...opts)

        // on test ca la => ca semble marcher
        const fullCmd = [..._cmd]
        _cmd = [_cmd[0]]

        return new Proxy(() => {
          return fullCmd
        }, handler(_cmd))
      }, handler(_cmd))
    }
  }
}

const pipe = (f1, ...fns) => {
  return () => {
    return fns.reduce(
      (prev, fn) => {
        const cmd = fn()
        return run(cmd, prev)
      },
      run(f1()) // j'aime moins car c'est pas un vrai pipe
    )
  }
}

const unshell = () => new Proxy({}, {
  get(_target, name) {
    return handler().get(_target, name)
  }
})

const {
  foo,
  apt,
  echo,
  which,
  base64
} = unshell()

console.log('------------------------')

const e1 = echo('foo')
const e2 = echo('bar')

const a = await exec(e1)
console.log('a', a)
const b = await exec(e2)
console.log('b', b)

console.log('------------------------')

const res2 = await exec(pipe(
  echo(which("deno")),
  base64(),
  base64()
)())// ca j'aime pas
console.log(res2)
