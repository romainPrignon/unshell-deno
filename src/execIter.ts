import type { FutureProcess, Process } from "../type/index.d.ts"
import { readLines } from "https://deno.land/std@0.132.0/io/mod.ts"
import { iterateReader } from "https://deno.land/std/streams/conversion.ts"

export const execIter = (cmd: FutureProcess) => {
  return {
    pipe: async (next: any): Promise<any> => {
      const runner = cmd()
      // const p = typeof runner === "function" ? await runner() : await runner // peut-etre que yaura plus besoin de await si on revoit tout le fonctionnement interne
      console.log('avant')
      const n = await next(runner)()
      console.log('apres')
      return (cb: Function) => resolveIter(cb, n)

      //-----
      // console.log("p",p)
      // console.log("n",n)
      // const stderr = new TextDecoder("utf-8").decode(await p.stderrOutput())
      // if (stderr) {
      //   n.stdout?.close()
      //   n.stderr?.close()
      //   n.close()
      //   throw new Error(stderr.trim())
      // }

      // for await (const chunk of iterateReader(p.stdout!)) {
      //   n.stdin?.write(chunk)
      // }
      // p.close()
      // p.stdout!.close()
      // n.stdin?.close()
      //-----

      return this
    },
    map: async (cb: Function) => {
      const runner = cmd()
      // todo export this ? => nommer runPipe() !
      const x = typeof runner === "function" ? await runner() : await runner
      return resolveIter(cb, x)
    }
  }
}

// todo: own file
const resolveIter = async (cb: Function, process: Process) => {
  // si error ? voir si on peut utiliser le success

  for await (const chunk of readLines(process.stdout!)) {
    return cb(chunk)
  }
  process.stdout?.close()
  process.stderr?.close()
  process.close()


  // const { success } = await process.status()
  // const stderr = new TextDecoder("utf-8").decode(await process.stderrOutput())

  // on peut pas connaitre le success dans le cadre du iter car c'est sans fin :(
  // if (!success) {
    // throw new Error(stderr.trim())
  // }


  // on est obliger de close, mais si on close la on peut plus iter :(
  // on peut fournir une api autour du close pour donner le control a l'appelant ou alors iter ici et attendre une callback pour lui pusher la data (voir ex: map)
  // en gros soit on close, soit l'appelant close
  // - un signal global (qui vient de unshell (un truc statefull)) un handlerejection, signal rpocess,....
  // voir ce qui se fait au niveau du backpressure et callbag car c'est la meme ide
  // on peut fournir une fonction global close() qui close tous les process ?
  // par exmepl: const cmd = `echo foo`; execIter(cmd); close(cmd); close(cmd1,cmd2, cmd3,....)
  // ex map: await execIter(less(currentFile)).map(line => line) on peut buffer par exemple
  // si on fait ca, il faut aussi fournir une method map() pointfree
  // et si on retourne une fonction ? marche pas je crois
  // return {
  //   close() {
  //     process.close()
  //     process.stdout?.close()
  //     process.stderr?.close()
  //   },
  //   data: readLines(process.stdout!)
  // }
}
