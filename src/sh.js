const exec = async (cmd) => {

  const process = Deno.run({
    cmd: ["bash", "-c", cmd.join(' ')],
    stdout: 'piped',
    stderr: 'piped',
  })

  const stdout = new TextDecoder("utf-8").decode(await process.output())
  return stdout
}

let cmd = []
const handler = {
  get(_target, name) {
    console.log('invoke', name)
    name && cmd.push(name)
    return (...args) => {
      console.log('args', args)
      cmd = cmd.concat(...args)

      return new Proxy({}, {
        get: handler.get
      })
    }
  }
}

const rootProxyHandler = {
  get(_target, name) {
    const bin = name
    console.log({ bin })

    return handler.get(_target, name)
  }
}

// const git = new Proxy({}, handler)
// git.remote().show("origin", "upstream")
// console.log(await exec(["git", ...cmd]))

const sh = () => new Proxy({}, rootProxyHandler)

const { git } = sh()
git().status()
console.log(cmd)
console.log(await exec(cmd))
