import { assertExists, assertEquals } from "../deps.ts"

import unshell, { exec, pipe } from '../src/mod.ts'

Deno.test(
  `given multiple binary, when we pipe them, then there should be no error`,
  async () => {
    // Given
    const { echo, base64 } = unshell()

    // When
    const res = await exec(pipe(echo('foo'), base64()))

    // Then
    assertEquals(res, 'Zm9vCg==\n')
  }
)

Deno.test(
  `given multiple binary, when we pipe them multiple times, then there should be no error`,
  async () => {
    // Given
    const { echo, base64 } = unshell()

    // When
    const res = await exec(pipe(echo('foo'), base64(), base64()))

    // Then
    assertEquals(res, 'Wm05dkNnPT0K\n')
  }
)
