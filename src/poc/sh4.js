// comme sh3 mais test des pipe
import { readLines } from "https://deno.land/std@0.115.1/io/mod.ts";

const exec = (cmd, { stdin } = {}) => {
  console.log('[exec]', stdin)
  const process = Deno.run({
    cmd,
    stdout: 'piped',
    stderr: 'piped',
    stdin: stdin || 'piped'
  })

  // if iter, return ca, sinon buffer et retourne tout
  // for await (const line of readLines(process.stdout)) {
  //   console.log("line", line);
  // }

  return process
  // const status = await process.status()
  // console.log('exec', { cmd, status, stdin })
  // console.trace()
  // const stdout = new TextDecoder("utf-8").decode(await process.output())
  // const stderr = new TextDecoder("utf-8").decode(await process.stderrOutput())
  // return { stdout, stderr }
}

// une func -> {} ou une classe
const handler = (cmd, pro) => ({
  cmd: cmd || [],
  process: pro || undefined,
  stdout: "",
  get(_target, name) {
    console.log(`[${name}]`, 'get')
    console.log(`[${name}]`, { _target: _target.toString(), name, cmd: this.cmd, stdout: this.stdout, process: this.process })

    if (name === "pipe") {
      return (...ars) => {
        console.log(`[${name}]`, 'get() in pipe')
        console.log({ process: this.process, pro })
        const newArs = ars.map(arg => {
          return typeof arg === 'function' ? arg(this.cmd, this.process) : arg
        })
        console.log(`[${name}]`, { newArs }) // c'est la ou on dit au premier de pas s'exec ? on dirait que non

        return new Proxy(async (a, b) => {
          console.log(`[${name}]`, 'proxy async in pipe')
          console.log(`[${name}]`, { a, b })
          const awaitedNewArs = await Promise.all(newArs)
          console.log(`[${name}]`, { awaitedNewArs })
          return "bam"
        }, handler(this.cmd, this.process)) // on evoie quoi ? je crois rien, ce sera pas le meme handler; il faut faire un pipehandler pour dire que l'on peut chain que un pipe
      }
    }
    name && this.cmd.push(name)

    return (...args) => {
      console.log(`[${name}]`, 'get()')

      const newArgs = args.map(arg => {
        return typeof arg === 'function' ? arg() : arg
      })

      this.cmd = this.cmd.concat(...newArgs)
      this.process = exec(this.cmd)

      return new Proxy(async (c, p) => {
        console.log(`[${name}]`, 'proxy async')
        console.log(`[${name}]`, { c, p }) // c'est la! ou on passe la commade precedente

        if (p) {
          // const { stdout, stderr } = await exec(c, { stdin }) // c'est la ! comme c'est await mais on passe a la suite sans attendre
          // if (stderr) throw stderr
          // this.stdout = stdout
          // return this.stdout

          const process = Deno.run({
            cmd: c,
            stdout: 'piped',
            stderr: 'piped',
            stdin: 'piped'
          })
          await process.stdin.write(await p.output())
          process.stdin.close()
          const status = await process.status()
          const stdout = new TextDecoder("utf-8").decode(await process.output())
          const stderr = new TextDecoder("utf-8").decode(await process.stderrOutput())
          console.log(`[${name} stdin]`, { status, stdout, stderr })
          console.trace()
          if (stderr) throw stderr
          return { stdout, stderr }

          // need a way to set this.alreadycoputed = true
          // comme cela le deuxieme exec ce fait pas
        }

        const awaitedCmd = await Promise.all(this.cmd)

        console.log(`[${name}]`, { cmd: this.cmd, process: this.process })
        console.log(`[${name}]`, { awaitedCmd: awaitedCmd })
        // const { stdout, stderr } = await exec(awaitedCmd)
        // console.log(`[${name}]`, { stdout, stderr })
        // this.cmd = [this.cmd[0]] // restore command

        // if (stderr) throw stderr
        // this.stdout = stdout
        // return this.stdout

        // test avec le process
        const process = exec(awaitedCmd)
        //this.process = process
        console.log('this.process', this.process)
        this.cmd = [this.cmd[0]] // restore command
        const status = await process.status()
        // const stdout = new TextDecoder("utf-8").decode(await process.output())
        // const stderr = new TextDecoder("utf-8").decode(await process.stderrOutput())
        // console.log(`[${name}]`, { status, stdout, stderr })
        // console.trace()
        // if (stderr) throw stderr
        // return { stdout, stderr }

      }, {
        get: (t, n) => {
          // console.log('next proxy')
          // if (n === "pipe") {
          //   return (prox) => { // soit on prend tjr un proxy soit on travail au niveau des stdin
          //     const newAr = prox()
          //     console.log({ newAr })

          //     // return soit proxy(async function..) comme au dessus sois un autre pipe
          //     // du coup on retoure un handler.get ?
          //     // et on fait le if du name plus haut
          //     // si c'est pipe, on return handler.get et on bricole les stdin ?
          //     return {
          //       pipe: (otherProx) => {
          //         const newA = otherProx()
          //         console.log({ newA })
          //       }
          //     }
          //   }
          // }
          const next = handler(this.cmd, this.process).get(t, n)
          //console.log({ next: next("premier")() }) ya peut etre un truc a faire ici pour detecter que le suivant est un pipe et qu'il faut forward la cmd et pas exec
          return next
        }
      })
    }
  }
})

const formatBin = (name) => {
  return name.replace("_", "-")
}

// super util pour scope la cmd au binaire
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
  // git,
  // docker,
  // cat,
  // less,
  // sleep,
  // wget,
  // find,
  // cd,
  // ls,
  // docker_compose,
  // watch,
  // read,
  // history,
  // alias,
  // pwd,
  // make,
  // bash,
  // sh,
  // timeout,
  // which,
  // grep,
  // ps,
  // sudo
} = unshell()

// doit tjr marcher
// await echo(which("deno"))() // echo $(which deno)
// // et si on tst une function en arg mais qui viens pas de sh ?
// const whichizzz = (str) => `whichizzz ${ str } `
// await echo(whichizzz("deno"))()

console.log('--- pipe ---')

// console.log(echo("foo"))
// echo("foo")

// console.log(await echo("foo"))
// await echo("foo")

// console.log('\n')
// console.log('echo("foo").pipe(base64())')
// console.log('\n')
// echo("foo").pipe(base64())

console.log('\n')
console.log('await echo("foo").pipe(base64())()')
console.log('\n')
await echo("foo").pipe(base64())()

// console.log('\n')
// console.log('await echo("foo").pipe(base64()).pipe(base64())')
// console.log('\n')
// await echo("foo").pipe(base64()).pipe(base64())

// console.log('\n')
// console.log('const res = await echo("foo").pipe(base64()).pipe(base64())()')
// console.log('\n')
// const res = await echo("foo").pipe(base64()).pipe(base64())()
// console.log({ res }) // bam

// console.log(await echo("foo").pipe().pipe().pipe()())

//faudra surement un truc du genre: echo("foo").stdout
// await base64(echo("foo"), { _in: "out de echofoo" })() // echo "foo" | base64 - ( trouver un moyen de faire marcher les commande par stdin)


//console.log(echo("foo").stdout) // pour que cela marche il faut declencher le deno.run au au tot, garder le process en this et dans le executor, faire un appel a la command et close

// git log --pretty=format: --name-only | sort | uniq -c | sort -rg | head -10
// await uniq(sort(git.log("--pretty=format: --name-only")))() // meme delire faut pipe stdin
// uniq.stdin(sort.stdin(git.log("--name-only"))) // test de syntax
// git.log("--name-only").pipe(sort()).pipe(uniq())() // test de syntax
// pipe(
//   git.log("--name-only"),
//   sort,
//   uniq
// )() // test de syntax
// sort({ _stdin: git.log('--name-only')})() // test de syntax
// sort()({ _stdin: git.log('--name-only')()}) // test de syntax
// git.log('--name-only')(sort()(uniq())) // test de syntax
