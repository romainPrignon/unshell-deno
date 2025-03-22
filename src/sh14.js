// reprise from scratch en separant la creation de la commande, du process et du run

const run = async (cmd, prev) => {
  console.log(`[run]`, { cmd })
  const _cmd = cmd()
  console.log(`[run]`, { _cmd })

  const newCmd = await Promise.all(_cmd.map(async c => typeof c === 'function' ? (await exec(c)).stdout : c).flat())
  console.log(`[run]`, { newCmd })

  const process = Deno.run({
    cmd: newCmd,
    stdout: 'piped',
    stderr: 'piped',
    stdin: 'piped'
  })

  console.log(`[run]`, { process })

  if (prev) {
    const output = await prev.output()
    await process.stdin.write(output)
    process.stdin.close()
  }

  return process
}

const resolve = async (process) => {
  const p = await process
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
  return typeof cmd === "function" ? resolve(await run(cmd)) : resolve(cmd)
}

// j'ai tout muter ! c'est pourri
const handler = (cmd = []) => {
  console.log(`[handler]`, { cmd })
  let _cmd = [...cmd]
  return {
    get(_target, name) {

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

        return new Proxy(() => { // necessaire pour chain
          console.log('run call me')
          const cmdToRun = [..._cmd]
          _cmd = [_cmd[0]] // il faut cette ligne sinon on a foo bar
          return cmdToRun
        }, handler(_cmd))
      }, handler(_cmd))
    }
  }
}

// c'est juste un pipe async avec run => on pourrait abstraire run
const pipe = (f1, ...fns) => {
  return fns.reduce(
    async (acc, fn) => {
      return run(fn, await acc)
    },
    run(f1)
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

const res1 = foo().bar.baz()
// console.log({ res }) // fait bugger => ajouter un console.warn si name === name que quand moi je debug
console.log({ res: res1() }) // marche

// const apt_res = await exec(apt().update())
// console.log(apt_res)

// todo run inner command
const res = await exec(echo(which("deno")))
console.log('[res]', res)

const res2 = pipe(
  echo("foo"),
  base64(),
  base64()
)
console.log('res2', await exec(res2))

// pipe peut ne pas retourner de fonction car pas de side effect      OK
// rendre pipe sync                                                   OK
// voir pour améliorer l'implem de pipe                               OK
// - surement pas besoin que run soit une double fn                   OK
// faire marcher avec et sans pipe                                    OK
//     - BUG la command n'est jamais restore on dirait                OK
// await pipe() => juste pipe()                                       OK
// exec doit pouvoir prendre un pipe en param comme une command       OK
// revoir l'immutable                                                 ok (pas sur qu'il y est mieux)
// dans sh15, run sync en HoF qui call run lui meme et pipe en sync   OK
// si on reset la cmd dans la function opt ?
// comprend ce truc: if (name === 'name') return
// voir comment ca se comporte si on appel sans exec et tout (ca consome le process et ya plus rien)

const a = await exec(echo('foo'))
const b = await exec(echo('bar'))
