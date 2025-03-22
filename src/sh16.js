// test pipe sync avec handler qui appel run

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
  const runner = cmd()
  return resolve(await runner())
}


const handler = (cmd = []) => {
  let _cmd = [...cmd]
  return {
    get(_target, name) {

      if (name === 'name') return // comprendre ce truc !!!!!
      name && _cmd.push(name)

      return new Proxy((...opts) => {
        _cmd.push(...opts)
        const cmdToRun = [..._cmd]
        _cmd = [_cmd[0]]

        return new Proxy((previous) => { // resolu a caude de ca !!
          return run(cmdToRun, previous) // on run ici
        }, handler(_cmd))
      }, handler(_cmd))
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

const res0 = echo('zero')
// console.log('res0', res0)
// console.log('res0()', res0())
// console.log('await res0()()', await res0()())
console.log('await exec(res0)', await exec(res0))

console.log('------------------------')

const res1 = foo().bar.baz()
// console.log({ res }) // fait bugger => ajouter un console.warn si name === name que quand moi je debug
console.log({ res1: res1 }) // marche

// const apt_res = await exec(apt().update())
// console.log(apt_res)

console.log('------------------------')

// todo run inner command
const res = await exec(echo(which("deno")))
console.log('res', res)

console.log('------------------------')

const res2 = pipe(
  echo(which("deno")),
  base64(),
  base64()
)
console.log('res2', await exec(res2))

console.log('------------------------')

const a = await exec(echo('foo'))
console.log('a', a)
const b = await exec(echo('bar'))
console.log('b', b)
