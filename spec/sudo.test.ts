import { assert, assertEquals } from "../deps.ts"

import unshell, {exec} from '../src/mod.ts'

Deno.test(
  `given cat bin, when we cat protected file without sudo, then there should be an error`,
  async () => {
    // Given
    const { cat } = unshell()

    // When
    const { stdout, stderr } = await exec(cat('/etc/shadow'))

    // Then
    assertEquals(stdout, "")
    assertEquals(stderr, "cat: /etc/shadow: Permission denied")
  }
)

Deno.test(
  `given cat bin, when we cat protected file with sudo, then there should be no error`,
  async () => {
    // Given
    const { sudo } = unshell()

    // When
    const {stdout: res} = await exec(sudo.cat('/etc/shadow'))

    // Then
    assert(typeof res === 'string')
  }
)
