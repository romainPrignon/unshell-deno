import { Command } from "../type/index.d.ts";

// todo: est-ce qu'on ajoute un tag verbose pour afficher dans la console ?
export const process = (cmd: Command) => {
  console.log(`[process] ${cmd}`)
  const process = Deno.run({
    cmd,
    stdout: 'piped',
    stderr: 'piped',
    stdin: 'piped'
  })

   // todo: peut etre pas besoin de double fonction
  return async (prev?: Deno.Process): Promise<Deno.Process> => {
    if (prev) {
      const output = await prev.output()
      await process.stdin.write(output)
      process.stdin.close()
    }

    return process
  }
}
