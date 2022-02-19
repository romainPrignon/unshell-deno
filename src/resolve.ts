// import { StringReader, readLines } from "https://deno.land/std@0.115.1/io/mod.ts";
import type { Process } from "../type/index.d.ts"

export const resolve = async (process: Process) => {
  // const status = await process.status()
  const stdout = new TextDecoder("utf-8").decode(await process.output())
  const stderr = new TextDecoder("utf-8").decode(await process.stderrOutput())

  if (stderr) throw stderr
  return stdout

  // defaut en stream ou pas ?
  // normalement ca n'affecte que le dernier process
  // c'est pas mal que ce soit par default car  c'est l'interet de passer par un lang de prog
  // on peut avoir un helper pour buffer le stream

  // todo: readLines(p.stdout)
// return readLines(new StringReader(p))
}
