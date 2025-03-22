import type { ArgRecord, BinRecord, OptBuilder } from "../type/index.d.ts";
import { arg } from './arg.ts'

export const bin = () => {
  return {
    get(target: BinRecord, name: string): ArgRecord | OptBuilder {
      const binary = format(name)

      console.log({ binary })
      if (!isInPath(binary)) {
        throw new Error("not in path")
      }

      return arg().get(target as unknown as ArgRecord, binary)
    }
  }
}

export const isInPath = (name: string): boolean => {
  // TODO: perf ?
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

const readDir = (dir: string) => {
  try {
    return Deno.readDirSync(dir)
  } catch {
    // user may have directory in PATH that do not exist on file system
    // I do ¯\_(ツ)_/¯
    return []
  }
}

export const format = (name: string) => name.replace("_", "-")

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
