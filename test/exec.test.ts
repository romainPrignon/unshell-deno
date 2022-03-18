import type { RunOptions } from "../type/index.d.ts";
import { path } from "../deps.ts";
import { assertEquals, assert } from "../deps.ts"

import { exec } from '../src/exec.ts'


Deno.test(
  "given a future process, when we exec it, then we should get the result",
  async () => {
    const p = Deno.run({
      cmd: ['echo', 'foo'],
      stdout: 'piped',
      stderr: 'piped',
      stdin: 'piped'
    })
    const cmd = () => async () => await p

    // When
    const { stdout: res } = await exec(cmd)

    // clean
    p.stdin?.close()

    // Then
    assertEquals(res, 'foo')
  }
);

Deno.test(
  "given a future process, when we exec it with env param, then we should get the result",
  async () => {
    let p: Deno.Process
    const cmd = (opt?: RunOptions) => async () => {
      p = Deno.run({
        cmd: ['printenv', 'FOO'],
        env: opt?.env,
        stdout: 'piped',
        stderr: 'piped',
        stdin: 'piped'
      })
      return await p
    }

    // Given
    const env = {FOO: 'bar'}

    // When
    const { stdout: res } = await exec(cmd, { env })

    // clean
    // @ts-expect-error p should be assigned by now
    p?.stdin?.close()

    // Then
    assertEquals(res, 'bar')
  }
);

Deno.test(
  "given a future process, when we exec it with cwd param, then we should get the result",
  async () => {
    let p: Deno.Process
    const cmd = (opt?: RunOptions) => async () => {
      p = Deno.run({
        cmd: ['ls'],
        cwd: opt?.cwd,
        stdout: 'piped',
        stderr: 'piped',
        stdin: 'piped'
      })
      return await p
    }

    // Given
    const cwd = path.dirname(path.fromFileUrl(import.meta.url));
    const currentFile = path.basename(import.meta.url)

    // When
    const res = await exec(cmd, { cwd })

    // clean
    // @ts-expect-error p should be assigned by now
    p?.stdin?.close()

    // Then
    assert(res.stdout.includes(currentFile))
  }
);
