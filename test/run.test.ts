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
    const p = Deno.run({
      cmd: ['which', 'deno'],
      stdout: 'piped',
      stderr: 'piped',
      stdin: 'piped'
    })
    const whichDeno = () => async () => await p
    const cmd = ['echo', whichDeno]

    // When
    const res = await run(cmd)()

    // clean
    p.stdin?.close()
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
    const p = Deno.run({
      cmd: ['echo', 'foo'],
      stdout: 'piped',
      stderr: 'piped',
      stdin: 'piped'
    })
    const prev = async () => await p

    // When
    const res = await run(cmd, { prev })()

    // clean
    p.stdin?.close()
    res.stdout?.close()
    res.stderr?.close()
    res.close()

    // Then
    assert(res instanceof Deno.Process)
  }
)

Deno.test(
  `given a command, when we run it with env params, then we should get a process`,
  async () => {
    // Given
    const cmd = ['ls']
    const env = {}

    // When
    const res = await run(cmd, { env })()

    // clean
    res.stdout?.close()
    res.stderr?.close()
    res.close()

    // Then
    assert(res instanceof Deno.Process)
  }
)

Deno.test(
  `given a command, when we run it with cwd params, then we should get a process`,
  async () => {
    // Given
    const cmd = ['ls']
    const cwd = '/tmp'

    // When
    const res = await run(cmd, { cwd })()

    // clean
    res.stdout?.close()
    res.stderr?.close()
    res.close()

    // Then
    assert(res instanceof Deno.Process)
  }
)
