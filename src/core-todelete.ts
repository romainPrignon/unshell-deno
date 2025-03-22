// python sh style
let commands = []

const cmd: any = []
const handler = {
  get: (target: any, name: any): any => {
    const prop = target[name]
    if (prop != null) { return prop }

    let isProp = true;
    return Promise.resolve().then(async () => {
      if (isProp) {
        console.log(`Undefined ${name} is Prop`)
        cmd.push(name)

        if (name === "then") {
          return cmd
        }

        target[name] = {}
        Reflect.set(target, name, {})

        return await new Proxy(target[name], {
          get: handler.get,
        });
      } else {
        console.log(`Undefined ${name} is Func`)
        cmd.push(name)

        return await new Proxy(target[name], {
          get: handler.get,
          apply: (...args) => {
            // console.log(args.slice(2)[0]) // handle args here
            cmd.push(...args.slice(2)[0])

            isProp = false
            return new Proxy({}, handler)
          }
        });
      }
    });
    // return new Proxy(() => {}, {
    //   get: handler.get,
    //   apply: (...args) => {
    //     // console.log(args.slice(2)[0]) // handle args here
    //     cmd.push(...args.slice(2)[0])

    //     isProp = false
    //     return new Proxy(() => {}, handler)
    //   }
    // });
  }
};

// const path = Deno.env.get("PATH")
// const pathItems = path?.split(':')
// pathItems?.map(async item => {
//   const dirEntries = Deno.readDir(item)
//   for await (const dirEntry of dirEntries ) {
//     commands.push([dirEntry.name], new Proxy({}, handler))
//   }
// })

const git: any = new Proxy({}, handler)
const g = await git
const remote = await g.remote
await remote.show("origin", "upstream")
console.log(cmd)

export const exec = async (cmd: string) => {
  // if string

  // if not empty
  if (cmd === "") {
    throw new Error("empty string")
  }

  // les options que l'on doit avoir son
  // gestion d'erreur (oop, fp) (try catch ou maybe) dans tout les cas on a pas la distinction stderr
  // gestion du verbose (affichage sur sortie std ou pas)
  // gestion du bash
  // gestion des stream
  const process = Deno.run({
    cmd: ["bash", "-c", cmd],
    stdout: 'piped',
    stderr: 'piped',
  })


  const stdout = new TextDecoder("utf-8").decode(await process.output())
  const stderr = new TextDecoder("utf-8").decode(await process.stderrOutput())

  process.close()

  // retour d'une classe ou d'un objet avec la sortie (res, all, output, ??) et le status
  return {stdout, stderr}
}
