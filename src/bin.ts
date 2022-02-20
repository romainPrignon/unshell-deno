import { Command } from "../type/index.d.ts"

export const bin = (cmd: Command, name: string) => {

  // todo: check if necessary
  if (typeof name !== 'string') {
    return cmd
  }

  const binary = format(name)

  if (isArg(cmd)) {
    return cmd.concat(binary)
  }

  if (!isInPath(binary)) {
    throw new Error("not in path")
  }

  return cmd.concat(binary)
}


/**
 * TODO: better perf
 */
export const isInPath = (name: string): boolean => {
  const dirs = Deno.env.get('PATH')?.split(':') || []

  let isBin = false

  for (const dir of dirs) {
    const entries = readDir(dir)
    for (const entry of entries) {
      if (entry.name === name) {
        isBin = true
        break
      }
    }
  }

  return isBin
}

const format = (name: string) => name.replace("_", "-")

const readDir = (dir: string) => {
  try {
    return Deno.readDirSync(dir)
  } catch {
    // user may have directory in PATH that do not exist on file system
    // I do ¯\_(ツ)_/¯
    return []
  }
}

const isArg = (cmd: Command) => cmd.length

// format pour node
// const toCamel = (s) => {
//   return s.replace(/([-_][a-z])/ig, ($1) => {
//     return $1.toUpperCase()
//       .replace('-', '')
//       .replace('_', '');
//   });
// };

// format pour deno
// const camelToSnakeCase = str => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
