import { Command, Process } from "../type/index.d.ts";
import { process } from './process.ts'
import { run } from './run.ts'

export const exec = (cmd: Command) => async (prev: Process): Promise<Process> => {
  const awaitedCmd = await Promise.all(cmd)
  console.log('[exec]', awaitedCmd)
  // awaitedCmd contient des process (du return res de wich)
  // soit ont map et run() ici
  // soit on retourn stdout et throw stderr et on voit comment ca marhce dans le pipe

  const res = await process(awaitedCmd)(prev)

  cmd = [cmd[0]] // restore command (todo: do it better)

  // return run(async () => res) // A CHANGER
  return res
}


