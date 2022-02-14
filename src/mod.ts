// for deno
import { unshell } from './unshell.ts'

type UnknownDictionary = Record<string, unknown>

// TODO: no logic in this file
// TODO: bin et Command peut-être generaliser
const main = () => {
  return unshell()
}

export default main
