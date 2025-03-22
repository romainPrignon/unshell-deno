import { assertEquals } from "../deps.ts";

import unshell from '../src/mod.ts'

Deno.test(
  `given git, when we call git remotes with dot syntax, then result should be xxx`,
  () => {
    // Given
    const { git } = unshell()

    // When
    const res = git.remotes()

    // Then
    assertEquals(typeof res, 'function')
  }
)

Deno.test(
  `given git, when we call git remotes with fn syntax, then result should be xxx`,
  () => {
    // Given
    const { git } = unshell()

    // When
    const res = git().remotes()

    // Then
    assertEquals(typeof res, 'function')
  }
)
