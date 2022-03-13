// for deno
import { RunOptions } from "../type/index.d.ts";
import { unshell } from './unshell.ts'
export * from './exec.ts'
export * from './pipe.ts'

// TODO: no logic in this file
const main = (options?: RunOptions) => {
  return unshell(options)
}

export default main
