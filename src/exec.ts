import type { FutureProcess, RunOptions } from "../type/index.d.ts"
import { resolve } from "./resolve.ts"

export const exec = async (cmd: FutureProcess, opt?: RunOptions): Promise<string> => {
  const runner = cmd(opt)
  return resolve(typeof runner === "function" ? await runner() : await runner)
}
