import { Script } from '../type/index.d.ts'

import { red, resolve } from '../deps.ts'
import { unshell, assertUnshellScript } from './unshell.ts'


type MainOpt = { args: Array<string>, env: {} } //NodeJS.ProcessEnv

const help = async (): Promise<void> => {
  console.log(`Execute script through unshell runtime

Usage:
  unshell COMMAND [SCRIPT_PATH] [ARGS...]

Commands:
  help      Print this help message
  run       run a script through unshell runtime`)
}

const run = async ({ args, env }: MainOpt): Promise<void> => {
  const [_, __, scriptPath, ...rest] = args

  const script = await resolveScript(scriptPath)

  try {
    await unshell({ env })(script, ...rest)
  } catch (err) {
    // TODO: if code unshell
    const msg = `
      ${red('✘')} unshell: something went wrong
    `
    console.error(msg)

    throw err // or better depending on debug
  }
}

const resolveScript = async (scriptPath: string): Promise<Script> => {
  let script
  try {
    // script = await import(resolve(scriptPath)) // Not Supported
    script = function * () {
      yield `echo hello`
      return `echo world`
    }
  } catch (err) {
    console.error(`${red('✘')} unshell: Invalid SCRIPT_PATH`)
    throw err
  }

  try {
    assertUnshellScript(script)
  } catch (err) {
    console.error(`${red('✘')} ${err.message}`)

    throw err
  }

  return script
}

export const cli = async ({ args, env }: MainOpt): Promise<void> => {
  const [_, unshellCommand, ...rest] = args

  switch (unshellCommand) {
    case 'help': return help()
    case 'run': return run({ args, env })
    default: return help()
  }
}

if (import.meta.main) {
  const args = Deno.args
  const env = Deno.env()

  cli({ args, env })
    .then(() => Deno.exit(0))
    .catch(() => Deno.exit(1))
}
