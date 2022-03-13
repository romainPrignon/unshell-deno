import { Command, Opts, Process, RunOptions } from "../type/index.d.ts"
import { bin } from './bin.ts'
import { opt } from './opt.ts'
import { run } from "./run.ts"

type RunOptionsWithPrev = RunOptions & { prev?: Process }

export const handler = <T>(cmd: Command = [], options?: RunOptions) => {
  return {
    get(_target: T, name: string): any {

      const cmdWithBin = bin(cmd, name)

      return new Proxy((...opts: Opts) => {

        const cmdWithOpt = opt(cmdWithBin, opts)

        return new Proxy((runOptions: RunOptionsWithPrev) => {
          const finalEnv = {...options?.env, ...runOptions?.env}
          const finalCwd = runOptions?.cwd ?? options?.cwd

          // @ts-expect-error prev
          return run(cmdWithOpt, { prev: runOptions?.prev, env: finalEnv, cwd: finalCwd })
        }, handler(cmdWithOpt, options))
      }, handler(cmdWithBin, options))
    }
  }
}
