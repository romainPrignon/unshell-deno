import { assertEquals, assertThrowsAsync } from "../deps.ts"

import { resolve } from '../src/resolve.ts'

Deno.test(
  `given a process, when we resolve it, there should be no error`,
  async () => {
    // Given
    const process = Deno.run({
      cmd: ['echo', 'foo'],
      stdout: 'piped',
      stderr: 'piped',
      stdin: 'piped'
    })

    // When
    const res = await resolve(process)

    // Then
    assertEquals(res, 'foo\n') // TODO: fix \n
  }
)

Deno.test(
  `given a broken process, when we resolve it, there should be an error`,
  async () => {
    // Given
    const process = Deno.run({
      cmd: ['git', 'foo'],
      stdout: 'piped',
      stderr: 'piped',
      stdin: 'piped'
    })

    // Then
    await assertThrowsAsync(() => resolve(process))
  }
)
