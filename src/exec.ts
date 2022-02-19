import type { Process } from "../type/index.d.ts"
import { resolve } from "./resolve.ts"

type FutureProcess = () => () => Promise<Process>

export const exec = async (cmd: FutureProcess) => {
  const runner = cmd()
  return resolve(await runner())
}
