// type ArgBuilder = () => void // todo

type FutureProcess = (opt?: RunOptions) => () => Promise<Process>
type Command = Array<string | FutureProcess>
type RunnableCommand = Array<string>
type RunOptions = {
  env?: Record<string, string>,
  cwd?: string
}

type Process = Deno.Process
type OptObject = Record<string, string | number | boolean>
type Opt = string | OptObject
type Opts = Array<Opt>

interface OptBuilder {
  (...args: Opts): ArgRecord & ProcessBuilder
}
interface ProcessBuilder {
  (prev?: Process): Promise<Process>
}

export type BinRecord = Record<string, ArgRecord & OptBuilder>
export type ArgRecord = Record<string, OptBuilder>

// export type Target = OptBuilder | ProcessBuilder
