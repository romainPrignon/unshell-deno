// QUID de retourner un proxy qu retourne une function(...args) pour pouvoir faire un git.status
// ou un git().status()

const exec = async (cmd) => {
  console.log('[exec]', cmd)
  const process = Deno.run({
    cmd,
    stdout: 'piped',
    stderr: 'piped',
    stdin: 'piped'
  })

  const status = await process.status()
  const stdout = new TextDecoder("utf-8").decode(await process.output())
  const stderr = new TextDecoder("utf-8").decode(await process.stderrOutput())

  return { status, stdout, stderr }
}

const handler = (cmd) => ({
  cmd: cmd || [],
  get(_target, name) {

    // pusher seulement si last(this.cmd) !== name
    // mais ya peut etre un truc plus smart
    if ([...this.cmd].pop() !== name) {
      name && this.cmd.push(name)
    }

    return new Proxy((...args) => { // ca marche a cause de ca
      const newArgs = args.map(arg => {
        return typeof arg === 'function' ? arg() : arg
      })

      this.cmd = this.cmd.concat(...newArgs)

      return new Proxy(async () => {

        const awaitedCmd = await Promise.all(this.cmd)
        const { stdout, stderr } = await exec(awaitedCmd)

        this.cmd = [this.cmd[0]] // restore command

        if (stderr) throw stderr
        return stdout
      }, {
        get: (t, n) => {
          // console.log('inner', { t, n })
          return handler(this.cmd).get(t, n)
        }
      })
    }, { // ca marche a causes de ca
      get: (t, n) => {
        // console.log('outer', { t, n })
        // const newcmd = this.cmd.concat(n)
        return handler(this.cmd).get(t, n)
      }
    })
  }
})

const formatBin = (name) => {
  return name.replace("_", "-")
}

const rootProxyHandler = {
  get(_target, name) {
    const bin = formatBin(name)
    // console.log({ name, bin })

    return handler().get(_target, bin)
  }
}

const unshell = () => new Proxy({}, rootProxyHandler)

const {
  echo,
  git
} = unshell()

const res1 = await git.status()() // ca marche !!!
console.log({ res1 })

console.log('----')

const res2 = await git().status()()
console.log({ res2 })

const mygit = git()
const res3 = await mygit.status()()
console.log({ res3 })

const mygit2 = git
const res4 = await mygit2().status()()
console.log({ res4 })

const res5 = await mygit2().log()() // meme bug que 12
console.log({ res5 })
