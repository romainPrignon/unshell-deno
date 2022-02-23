// for deno
import { unshell } from './unshell.ts'
export * from './exec.ts'

// TODO: no logic in this file
const main = () => {
  return unshell()
}

export default main
