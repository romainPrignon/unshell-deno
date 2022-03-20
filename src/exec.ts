import type { FutureProcess } from "../type/index.d.ts"
import { resolve } from "./resolve.ts"

export const exec = async (cmd: FutureProcess): Promise<string> => {
  const runner = cmd()
  return resolve(typeof runner === "function" ? await runner() : await runner)
}
