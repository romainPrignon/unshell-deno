import { Command, Opts, Process } from "../type/index.d.ts"
import { bin } from './bin.ts'
import { opt } from './opt.ts'
import { run } from "./run.ts"


export const handler = <T>(cmd: Command = []) => {
  return {
    get(_target: T, name: string): any {

      const cmdWithBin = bin(cmd, name)

      return new Proxy((...opts: Opts) => {

        const cmdWithOpt = opt(cmdWithBin, opts)

        return new Proxy((prev: Process) => {
          // @ts-expect-error prev
          return run(cmdWithOpt, prev)
        }, handler(cmdWithOpt))
      }, handler(cmdWithBin))
    }
  }
}
