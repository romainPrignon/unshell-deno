import type { FutureProcess } from "../type/index.d.ts"
import { resolve } from "./resolve.ts"

export const exec = async (cmd: FutureProcess) => {
  const runner = cmd()
  return resolve(await runner())
}