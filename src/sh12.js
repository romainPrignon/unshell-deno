// test du bake

import { StringReader, readLines } from "https://deno.land/std@0.115.1/io/mod.ts";

const exec = (cmd) => {
  console.log(`[exec] ${cmd}`)
  const process = Deno.run({
    cmd,
    stdout: 'piped',
    stderr: 'piped',
    stdin: 'piped'
  })

  return async (prev) => {
    console.log('[prev]', { bool: !!prev, value: prev })
    if (prev) {
      const output = await prev.output()
      await process.stdin.write(output)
      process.stdin.close()
    }

    return process
  }
}

const handler = (cmd) => {
  let command = cmd || []
  return {
    get(_target, name) {

      // ca fait nimp ici quand on passe dans status la cmd est vide

      console.log('push before', command)
      name && command.push(name)
      console.log('push after', command)

      return (...args) => {

        const newArgs = args.map(arg => {
          return typeof arg === 'function' ? arg() : arg
        })

        console.log('concat before', command)
        command = command.concat(...newArgs)
        console.log('concat after', command)

        return new Proxy(async (prev) => {

          const awaitedCmd = await Promise.all(command)

          console.log({ awaitedCmd })

          const res = await exec(awaitedCmd)(prev)

          console.log('restore before', command)
          command = [command[0]] // restore command
          console.log('restore after', command)

          return res
        }, {
          get: (t, n) => {
            return handler([command[0]]).get(t, n) // CA MARCHE A CAUSE DE CA
          }
        })
      }
    }
  }
}

const formatBin = (name) => {
  return name.replace("_", "-")
}

const pipe = (f1, ...fns) => {
  return async () => {
    const res = fns.reduce(
      async (prev, fn) => {
        return fn(await prev)
      },
      f1(),
    );

    return await res
  }
}

const run = async (pro) => {
  const p = await pro()
  const status = await p.status()
  const stdout = new TextDecoder("utf-8").decode(await p.output())
  const stderr = new TextDecoder("utf-8").decode(await p.stderrOutput())

  if (stderr) throw stderr
  return { status, stdout }
}

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
  docker
} = unshell()

// test si on doit faire un truc en plus sur les var d'env
// Deno.env.set("GIT_TRACE", "true")
// console.log((await run(git().status())).stdout)

// Deno.env.set("DOCKER_HIDE_LEGACY_COMMANDS", "true") // c'est bien le cas
// console.log((await run(docker())).stdout)

// const mygit = git()
// console.log(await mygit.status()())
// console.log(await mygit.log()())

const mygit = git()
console.log(await run(mygit.status()))
console.log(await run(mygit.log())) // [ "git", "status", "log" ] !!!!!!!!!!

// const myothergit = git()
// console.log(await run(myothergit.log())) // [ "git", "status", "log", "log" ] !!!!!!!!!!
