import { Command, OptObject, Opts } from "../type/index.d.ts"


export const opt = (cmd: Command, opts: Opts) => {
  return cmd.concat(format(opts)).flat()
}

const format = (opts: Opts): Command => {
  return opts.map(opt => {
    switch (true) {
      case typeof opt === 'function': return (opt as unknown as Function)() // todo une fonction de type process
      case typeof opt === 'string': return [opt]
      case typeof opt === 'object' && opt !== null: return formatObject(opt as OptObject)
      default: throw new Error(formatError(opt))
    }
  })
}

const formatObject = (opt: OptObject): Command => {
  // @ts-expect-error todo: prefer typeguard over switch
  return Object.entries(opt).map(([key, val]) => {
    switch (true) {
      case key.length === 1: {
        switch (true) {
          case typeof val === 'boolean': return `-${key}` as string
          default: return `-${key}=${val}` as string
        }
      }
      case key.length > 1: {
        switch (true) {
          case typeof val === 'boolean': return `--${formatObjectKey(key)}` as string
          case typeof val === 'string' || typeof val === 'number': return `--${formatObjectKey(key)}=${val}` as string // --key=val or --key val ?
          default: throw new Error(formatObjectError(key, val))
        }
      }
    }
  })
}

const formatObjectKey = (name: string): string => name.replace("_", "-")

const formatError = (opt: unknown): string => {
  // console.log('opt', opt)
  return `Couldn't parse opt ${opt}
make sure to use either string or object syntax. see http://xxx
`
}

const formatObjectError = (key: string, val: unknown): string => `Couldn't parse opt ${key} with value ${val}
make sure to use either string or object syntax. see http://xxx
`
