import { readLines } from "https://deno.land/std@0.115.1/io/mod.ts";

const exec = async (cmd, { stdin } = {}) => {
  const process = Deno.run({
    cmd,
    stdout: 'piped',
    stderr: 'piped',
    stdin: 'piped'
  })

  if (stdin) {
    process.stdin.write(new TextEncoder("utf-8").encode("utf-8"))
  }

  // if iter, return ca, sinon buffer et retourne tout
  for await (const line of readLines(process.stdout)) {
    console.log("line", line);
  }


  const status = await process.status()
  console.log('exec', cmd.join(' '), status)
  const stdout = new TextDecoder("utf-8").decode(await process.output())
  const stderr = new TextDecoder("utf-8").decode(await process.stderrOutput())
  return { stdout, stderr }
}

// une func -> {} ou une classe
const handler = (cmd) => ({
  cmd: cmd || [],
  get(_target, name) {

    name && this.cmd.push(name)
    return (...args) => {

      const newArgs = args.map(arg => {
        return typeof arg === 'function' ? arg() : arg
      })

      this.cmd = this.cmd.concat(...newArgs)

      return new Proxy(async () => {

        const awaitedCmd = await Promise.all(this.cmd)

        console.log({ cmd: this.cmd })
        console.log({ awaitedCmd: awaitedCmd })
        const { stdout, stderr } = await exec(awaitedCmd)
        console.log({ stdout, stderr })
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
  git,
  echo,
  docker,
  cat,
  less,
  sleep,
  wget,
  find,
  cd,
  ls,
  docker_compose,
  watch,
  read,
  history,
  alias,
  pwd,
  make,
  bash,
  sh,
  timeout,
  base64,
  which,
  grep,
  ps,
  sudo
} = unshell()
await git().status()()
await echo("hello")()
await docker().ps()()
await cat("makefile")()
await less("makefile")()
await less("src/unshell.ts")() // handle pager ?
await sleep(1)()
// await wget("-q", "-O", "/tmp/sh", "https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/apply")() // trop chiant de taper les args !
// const res = (await cat("/tmp/sh")()).substring(0, 15)
// console.log(res)

// find . -type f -name makefile
await find(".", "-type", "f", "-name", "makefile")()
// await cd("./utils")() // marche pas ! mais c'est normal
await ls()() // marche mais on aurait pu etre dans utils
// await top()() // marche pas ! => comment faire marcher un truc comme cela
await docker_compose().help()()

// ---- wait
const sleep5 = sleep(1)()
console.log('doing some stuff')
await sleep5
console.log('doing other stuff')
// ---- wait

// await watch("-n", 2, "'docker ps'")() est ce que ca pourrait marcher ?

// normal que ca ne marche pas
// const readRes = await read()()
// console.log({ readRes })

// await history()() // marche pas et c'est normal
// await alias()() // marche pas, normal
await pwd()()
await make()()
await make("run")()
// await make("foo")() // should exit with error: foo not found
await bash("-c", "echo hello")() // marche
await bash("-c", "echo", "hello")() // marche pas normal
await sh("-c", "echo hello")() // marche
await sh("-c", "echo", "hello")() // marche pas normal
await timeout(1, "sleep", 2)()

//faudra surement un truc du genre: echo("foo").stdout
// await base64(echo("foo"), { _in: "out de echofoo" })() // echo "foo" | base64 - ( trouver un moyen de faire marcher les commande par stdin)
await echo(which("deno"))() // echo $(which deno)
// et si on tst une function en arg mais qui viens pas de sh ?
const whichizzz = (str) => `whichizzz ${str}`
await echo(whichizzz("deno"))()

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

Deno.env.set("QUX", "qux")
await echo(Deno.env.get("QUX"))()

await make("success")() && await make("success")()
// console.log("should not run second command")
// await make("fail")() && await make("success")() // should not run second command
// console.log("should run second command")
// await make("success")() && await make("fail")() // should run second command

await sudo().apt().update()()
