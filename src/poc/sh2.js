const exec = async (cmd) => {

  const process = Deno.run({
    cmd: ["bash", "-c", cmd.join(' ')],
    stdout: 'piped',
    stderr: 'piped',
  })

  const stdout = new TextDecoder("utf-8").decode(await process.output())
  return stdout
}




const handler = {
  cmd: [],
  get(_target, name) {
    console.log('invoke', name)
    name && this.cmd.push(name)
    return (...args) => {
      console.log('args', args)
      this.cmd = this.cmd.concat(...args)

      return new Proxy(async () => {
        console.log({ cmd: this.cmd })
        const res = await exec(this.cmd)
        console.log(res)
      }, {
        get: (t, n) => {
          console.log({ t, n }) // THIS IS THE NEXT ONE
          return handler.get(t, n)
        }
      })
    }
  }
}

// LE SEUL MOYEN QUE JE VOIS DE LANCER SANS CHANGER L4API
// utiliser le process.nexttick ou similaire pour faire le exec

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

const { git, echo } = sh()
await git().status()()
await echo("hello")()
// console.log(cmd)
// console.log(await exec(cmd))

// -----------

// const hand = {
//   prop: [],
//   get(t, n) {
//     console.log(t, n)
//     this.prop.push(n)
//     return () => new Proxy(() => {
//       // t() // le fait d'appeler t() appel la funtion dans le proxy pls fois
//       console.log('exec ', this.prop)
//     }, hand)

//     // method avec apply sans ta CA MARCHE PAS
//     // return () => new Proxy({}, hand)
//   },
//   // apply(ta, thi, arg) {
//   //   // console.log('apply', ta, thi, arg)
//   //   // ta() // apply sans ta ca appel pas le exec; du coup faut appeler ta
//   //   // ou mettre la logique ici et faire un proxy de type {} CA MARCHE PAS
//   //   console.log('exec ', this.prop)
//   // }
// }

// const git = new Proxy(() => {
//   console.log('top level')
// }, hand)

// const res = git.foo().bar().baz()()
// console.log(res)
