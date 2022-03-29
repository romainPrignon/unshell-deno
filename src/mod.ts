// for deno
import { unshell } from './unshell.ts'
export * from './exec.ts'
export * from './execIter.ts'
export * from './pipe.ts'

// TODO: no logic in this file
const main = () => {
  return unshell()
}

export default main
