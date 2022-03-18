// test restore

import { assertEquals } from "../deps.ts"

import unshell, { exec } from '../src/mod.ts'

Deno.test(
  `given echo bin, if we call it twice, then there should be no overlap between command`,
  async () => {
    // Given
    const { echo } = unshell()

    // When
    const { stdout: foo } = await exec(echo('foo'))
    const { stdout: bar } = await exec(echo('bar'))

    // Then
    assertEquals(foo, 'foo')
    assertEquals(bar, 'bar')
  }
)

Deno.test(
  `given echo bin, if we mix the calls, then there should be no overlap between command`,
  async () => {
    // Given
    const { echo } = unshell()

    // When
    const echoFoo = echo('foo')
    const { stdout: bar } = await exec(echo('bar'))
    const { stdout: foo } = await exec(echoFoo)

    // Then
    assertEquals(foo, 'foo')
    assertEquals(bar, 'bar')
  }
)

Deno.test(
  `overriding unshell options with exec options should work`,
  async () => {
    // Given
    const unshellEnv = {FOO: 'foo', BAR: 'bar' }
    const execEnv = {FOO: 'bar'}
    const { printenv } = unshell({env: unshellEnv})

    // When
    const {stdout: foo} = await exec(printenv('FOO'), { env: execEnv })
    const {stdout: bar} = await exec(printenv('BAR'), { env: execEnv })

    // Then
    assertEquals(foo, 'bar')
    assertEquals(bar, 'bar')
  }
)
