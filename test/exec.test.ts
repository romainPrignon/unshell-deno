import { assertEquals } from "../deps.ts"

import { exec } from '../src/exec.ts'


Deno.test(
  "given a future process, when we exec it, then we should get the result",
  async () => {
    const cmd = () => async () => await Deno.run({
      cmd: ['echo', 'foo'],
      stdout: 'piped',
      stderr: 'piped',
      stdin: 'piped'
    })

    // When
    const res = await exec(cmd)

    // Then
    assertEquals(res, 'foo\n') // TODO: \n
  }
);
