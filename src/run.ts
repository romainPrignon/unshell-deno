import type { Command, Process, RunnableCommand, RunOptions } from "../type/index.d.ts"
import { exec } from "./exec.ts"

// todo: ce sera different pour asynciterable ?
// todo: export () => Promise<Process> if needed

type PrevProcess = () => Promise<Process>
type RunOptionsWithPrev = RunOptions & { prev?: PrevProcess }

export const run = (cmd: Command, opt?: RunOptionsWithPrev) => {
  return async () => {

    const process = doRun(await execNestedCmd(cmd), opt)

    if (opt?.prev) {
      const prevProcess = await opt.prev()
      await pipeProcess(prevProcess, process)
    } else {
      process.stdin?.close()
    }

    return process
  }
}

const execNestedCmd = (cmd: Command): Promise<RunnableCommand> => {
  return Promise.all(cmd.map(async c => typeof c === 'function' ? await exec(c) : c).flat())
}

const doRun = (cmd: RunnableCommand, opt?: RunOptions): Process => {
  return Deno.run({
    cmd: cmd,
    cwd: opt?.cwd,
    env: opt?.env,
    stdout: 'piped',
    stderr: 'piped',
    stdin: 'piped'
  })
}

const pipeProcess = async (process1: Process, process2: Process) => {
  const stdout = await process1.output()
  const stderr = new TextDecoder("utf-8").decode(await process1.stderrOutput())

  await process2.stdin?.write(stdout)
  process2.stdin?.close()
  process1.close()

  if (stderr) {
    process2.stdout?.close()
    process2.stderr?.close()
    process2.close()
    throw new Error(stderr.trim())
  }
}
