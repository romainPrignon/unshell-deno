import { RunOptions } from "../type/index.d.ts";
import { handler } from './handler.ts'

export const unshell = (options?: RunOptions) => {
  return new Proxy<any>({}, handler(undefined, options))
}
