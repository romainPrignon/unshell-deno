import { Options, Script, Args, Engine } from '../type/index.d.ts'


const defaultOptions = {
    env: {}
}

export const unshell = (opt: Options = defaultOptions): Engine => {
    return async (script: Script, ...args: Args): Promise<void> => {
        assertUnshellScript(script)

        const it = script(...args)
        let cmd = await it.next()

        while (cmd.done === false) {
            if (isEmptyCmd(cmd.value)) {
                cmd = await it.next()
                continue
            }

            console.log(`• ${cmd.value}`)

            try {
                const commands = cmd.value.split(' ')
                
                const process = Deno.run({
                    args: commands,
                    env: opt.env,
                    stdout: "piped"
                })
                const stdout = new Deno.Buffer(await process.output()).toString()
                
                if (stdout) {
                    console.log(`➜ ${stdout}`)
                }

                cmd = await it.next(stdout)
            } catch (err) {
                console.error({
                    cmd: err.cmd,
                    stderr: err.stderr
                })

                throw err
            }
        }

        // last iteration
        if (cmd.done === true && cmd.value) {
            console.log(`• ${cmd.value}`)
            
            const commands = cmd.value.split(' ')

            const process = Deno.run({
                args: commands,
                env: opt.env,
                stdout: "piped"
            })
            const stdout = new Deno.Buffer(await process.output()).toString()

            if (stdout) {
                console.log(`➜ ${stdout}`)
            }
        }
    }
}

export const assertUnshellScript = (fn: Function): fn is Script => {
    if (isGenerator(fn)) return true
    if (isAsyncGenerator(fn)) return true

    throw new Error('unshell: Invalid SCRIPT')
}

const isGenerator = (fn: Function): fn is () => IterableIterator<string> =>
    fn.constructor.name === 'GeneratorFunction'

const isAsyncGenerator = (fn: Function): fn is () => AsyncIterableIterator<string> =>
    fn.constructor.name === 'AsyncGeneratorFunction'

const isEmptyCmd = (cmd: string): boolean => !cmd.length
