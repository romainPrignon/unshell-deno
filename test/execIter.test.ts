import { assertEquals } from "../deps.ts"

import { execIter } from '../src/execIter.ts'

Deno.test(
  "given a future process, when we execIter it, then we should get the result",
  async () => {
    const p = Deno.run({
      cmd: ['echo', 'foo'],
      stdout: 'piped',
      stderr: 'piped',
      stdin: 'piped'
    })
    const cmd = () => async () => await p

    // When
    const res = await execIter(cmd).map((r: any) => r)

    // Then
    assertEquals(res, 'foo')

    // clean
    p.stdin?.close()
    p.stdout?.close() // why ?
    p.stderr?.close() // why ?
    p.close() // why ?
  }
);
