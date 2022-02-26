// import { StringReader, readLines } from "https://deno.land/std@0.115.1/io/mod.ts";
import type { Process } from "../type/index.d.ts"

export const resolve = async (process: Process) => {
  // const status = await process.status()
  const stdout = new TextDecoder("utf-8").decode(await process.output())
  const stderr = new TextDecoder("utf-8").decode(await process.stderrOutput())

  process.close()

  if (stderr) throw new Error(stderr) // todo: better error shape
  // return process?.stdout && readLines(process?.stdout) // TODO

  return stdout
}
