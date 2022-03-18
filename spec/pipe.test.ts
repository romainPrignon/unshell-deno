import { assertThrowsAsync, assertEquals } from "../deps.ts"

import unshell, { exec, pipe } from '../src/mod.ts'

Deno.test(
  `given multiple binary, when we pipe them, then there should be no error`,
  async () => {
    // Given
    const { echo, base64 } = unshell()

    // When
    const {stdout: res} = await exec(pipe(echo('foo'), base64()))

    // Then
    assertEquals(res, 'Zm9vCg==')
  }
)

Deno.test(
  `given multiple binary, when we pipe them multiple times, then there should be no error`,
  async () => {
    // Given
    const { echo, base64 } = unshell()

    // When
    const { stdout: res } = await exec(pipe(echo('foo'), base64(), base64()))

    // Then
    assertEquals(res, 'Wm05dkNnPT0K')
  }
)

Deno.test(
  `given multiple binary and error in the first one, when we pipe them, then there should be an error`,
  async () => {
    // Given
    const { cat, base64 } = unshell()

    // Then
    await assertThrowsAsync(() => exec(pipe(cat('/etc/shadow'), base64())))
  }
)
