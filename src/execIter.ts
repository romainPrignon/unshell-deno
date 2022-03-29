import type { FutureProcess, Process } from "../type/index.d.ts"
import { readLines } from "https://deno.land/std@0.132.0/io/mod.ts"

export const execIter = async (cmd: FutureProcess) => {
  const runner = cmd()
  // todo export this ?
  const x = typeof runner === "function" ? await runner() : await runner

  return resolveIter(x)
}

// todo: own file
const resolveIter = async (process: Process) => {
  const { success } = await process.status()
  const stderr = new TextDecoder("utf-8").decode(await process.stderrOutput())

  if (!success) {
    throw new Error(stderr.trim())
  }

  // ca va peter non ?
  process.close()
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
  return {
    close() {
      process.stdout?.close()
    },
    data: readLines(process.stdout!)
  }
}
