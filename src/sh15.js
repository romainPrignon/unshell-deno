// test pipe sync
// run doit etre sync et return une function async
// run prend donc une cmd qui peut avoir deja ete exec

const run = (cmd, prev) => {
  return async () => {
    console.log(`[run]`, { cmd })
    const newCmd = await Promise.all(cmd.map(async c => typeof c === 'function' ? (await exec(c)).stdout : c).flat())
    console.log(`[run]`, { newCmd })

    const process = Deno.run({
      cmd: newCmd,
      stdout: 'piped',
      stderr: 'piped',
      stdin: 'piped'
    })

    console.log(`[run]`, { process, prev })
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
  const p = await process // todo verifier si necessaire
  console.log(`[resolve]`, { process: p })
  const status = await p.status()
  const stdout = new TextDecoder("utf-8").decode(await p.output())
  const stderr = new TextDecoder("utf-8").decode(await p.stderrOutput())

  console.log(`[resolve]`, { status, stdout, stderr })
  if (stderr) throw stderr
  return { status, stdout }
}

const exec = async (cmd) => {
  console.log(`[exec]`, { cmd })
  const _cmd = await cmd()
  console.log(`[exec]`, { _cmd })

  if (_cmd instanceof Deno.Process) {
    return resolve(_cmd)
  }

  return resolve(await run(_cmd)())
}


const handler = (cmd = []) => {
  console.log(`[handler]`, { cmd })
  let _cmd = [...cmd]
  return {
    get(_target, name) {
      // console.log(`[handler.get]`, { _target, name })

      // a tester sans les console.log interne
      // if (name === 'name') {
      // throw new Error('aaaaa')
      // }
      if (name === 'name') return // semble marcher // a mettre que quand je fais du du debug ?
      // if (_target !== {}) return {} // on peut plus call les fn apres: git()
      // peut-etre qu'il faut garder un compteur sur le nombre d'appel et throw ?

      name && _cmd.push(name)

      return new Proxy((...opts) => {
        _cmd.push(...opts)

        return new Proxy(() => { // resolu a caude de ca !!
          console.log('run call me')
          const cmdToRun = [..._cmd]
          _cmd = [_cmd[0]] // il faut cette ligne sinon on a foo bar
          return cmdToRun
        }, handler(_cmd))
      }, handler(_cmd))
    }
  }
}

const pipe = (f1, ...fns) => {
  return fns.reduce(
    (acc, fn) => {
      return run(fn(), acc)
    },
    run(f1())
  )
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

// const res1 = foo().bar.baz()
// console.log({ res }) // fait bugger => ajouter un console.warn si name === name que quand moi je debug
// console.log({ res: res1() }) // marche

// const apt_res = await exec(apt().update())
// console.log(apt_res)

// todo run inner command
const res = await exec(echo(which("deno")))
console.log('[res]', res)

console.log('------------------------')

const res2 = pipe(
  echo(which("deno")),
  base64(),
  base64()
)
// console.log('res2', await res2())
console.log('res2', await exec(res2))

// const a = await exec(echo('foo'))
// const b = await exec(echo('bar'))
