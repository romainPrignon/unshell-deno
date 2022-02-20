import type { Command, Process, RunnableCommand } from "../type/index.d.ts"
import { exec } from "./exec.ts"

// todo: ce sera different pour asynciterable ?
// todo: export () => Promise<Process> if needed

export const run = (cmd: Command, prev?: () => Promise<Process>) => {
  return async () => {

    const process = doRun(await execNestedCmd(cmd))

    if (prev) {
      const prevProcess = await prev()
      await pipeProcess(prevProcess, process)
    }

    return process
  }
}

const execNestedCmd = (cmd: Command): Promise<RunnableCommand> => {
  return Promise.all(cmd.map(async c => typeof c === 'function' ? await exec(c) : c).flat())
}

const doRun = (cmd: RunnableCommand): Process => {
  return Deno.run({
    cmd: cmd,
    stdout: 'piped',
    stderr: 'piped',
    stdin: 'piped'
  })
}

const pipeProcess = async (process1: Process, process2: Process) => {
  const output = await process1.output()
  await process2.stdin?.write(output) // TODO: et si ya pas output mais une err dans process1 ?

  process1.stdin?.close()
  process1.stderr?.close()
  process1.close()
}

// export const run = async (process: () => Promise<Deno.Process>): Promise<string> => {
//   const decoder = new TextDecoder()

//   const p = await process()

//   const stdout = decoder.decode(await p.output())
//   const stderr = decoder.decode(await p.stderrOutput())

//   if (stderr) throw stderr // todo: trouver une bonne api
//   return stdout // trouver une bonne api
// }
