// test restore

import { assert, assertEquals } from "../deps.ts"

import unshell, { exec } from '../src/mod.ts'

Deno.test(
  `given echo bin, if we call it twice, then there should be no overlap between command`,
  async () => {
    // Given
    const { echo } = unshell()

    // When
    const foo = await exec(echo('foo'))
    const bar = await exec(echo('bar'))

    // Then
    assertEquals(foo, 'foo\n')
    assertEquals(bar, 'bar\n')
  }
)

Deno.test(
  `given echo bin, if we mix the calls, then there should be no overlap between command`,
  async () => {
    // Given
    const { echo } = unshell()

    // When
    const echoFoo = echo('foo')
    const bar = await exec(echo('bar'))
    const foo = await exec(echoFoo)

    // Then
    assertEquals(foo, 'foo\n')
    assertEquals(bar, 'bar\n')
  }
)
