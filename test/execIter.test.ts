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
    const res = await execIter(cmd)

    // Then
    for await (const r of res) {
      assertEquals(r, 'foo')
    }

    // clean
    p.stdin?.close()
    p.stdout?.close() // why ?
  }
);
