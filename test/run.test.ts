import { assert } from "../deps.ts"
import { run } from '../src/run.ts'

Deno.test(
  `given a command, when we run it, then we should get a process`,
  async () => {
    // Given
    const cmd = ['ls']

    // When
    const res = await run(cmd)()

    // clean
    // TODO: should run clean this ?
    res.stdout?.close()
    res.stderr?.close()
    res.close()

    // Then
    assert(res instanceof Deno.Process)
  }
)

Deno.test(
  `given a command with a nested command, when we run it, then we should get a process`,
  async () => {
    // Given
    const whichDeno = () => async () => {
      return await Deno.run({
        cmd: ['which', 'deno'],
        stdout: 'piped',
        stderr: 'piped',
        stdin: 'piped'
      })
    }
    const cmd = ['echo', whichDeno]

    // When
    const res = await run(cmd)()

    // clean
    // res.stdin?.close()
    res.stdout?.close()
    res.stderr?.close()
    res.close()

    // Then
    assert(res instanceof Deno.Process)
  }
)

Deno.test(
  `given a command with a prev process, when we run it, then we should get a process`,
  async () => {
    // Given
    const cmd = ['base64']
    const prev = async () => await Deno.run({
      cmd: ['echo', 'foo'],
      stdout: 'piped',
      stderr: 'piped',
      stdin: 'piped'
    })

    // When
    const res = await run(cmd, prev)()

    // clean
    res.stdin?.close()
    res.stdout?.close()
    res.stderr?.close()
    res.close()

    // Then
    assert(res instanceof Deno.Process)
  }
)
