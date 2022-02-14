// test avec concat

const run = (cmd, prev) => {
  console.log(cmd)
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
  const runner = cmd()
  return resolve(await runner())
}


const handler = (cmd = []) => {
  // let _cmd = [...cmd]
  return {
    get(_target, name) {

      if (name === 'name') return // comprendre ce truc !!!!!
      const cmdWithName = cmd.concat(name)

      return new Proxy((...opts) => {
        const c = cmdWithName.concat(...opts)
        // const cmdToRun = [..._cmd]
        // _cmd = [_cmd[0]]

        return new Proxy((previous) => { // resolu a caude de ca !!
          return run(c, previous) // on run ici
        }, handler(c))
      }, handler(cmdWithName))
    }
  }
}

const pipe = (f1, ...fns) => {
  return () => {
    return fns.reduce(
      (acc, fn) => {
        return fn(acc)
      },
      f1()
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
const res1 = foo().bar.baz()
foo('a').bar('b')()
res1()
