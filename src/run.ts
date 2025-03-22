import { StringReader, readLines } from "https://deno.land/std@0.115.1/io/mod.ts";

// ce sera different pour node ou deno
export const run = async (process: () => Promise<Deno.Process>): Promise<string> => {
  const decoder = new TextDecoder()

  const p = await process()

  const stdout = decoder.decode(await p.output())
  const stderr = decoder.decode(await p.stderrOutput())

  if (stderr) throw stderr // todo: trouver une bonne api
  return stdout // trouver une bonne api

  // et ca ca marche ? readLines(p.stdout)
  // return readLines(new StringReader(p))
}

// todo: ce sera different pour asynciterable
