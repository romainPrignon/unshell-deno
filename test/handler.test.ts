import type { Command } from "../type/index.d.ts"
import { assert, assertExists } from "../deps.ts"

import { handler } from '../src/handler.ts'

Deno.test(
  `given a handler, it should return a new handler with bin as param`,
  () => {
    // Given
    const cmd: Command = []
    const name = "echo"

    const echo = handler(cmd).get({}, name)

    assertExists(echo.foo)
  }
)

Deno.test(
  `given a handler, it should be consumable with opt`,
  () => {
    // Given
    const cmd: Command = []
    const name = "echo"
    const foo = "foo"

    const echo = handler(cmd).get({}, name)

    assertExists(echo(foo))
  }
)

Deno.test(
  `given a handler, it should return a handler which return a handler which return...`,
  () => {
    // Given
    const cmd: Command = []
    const name = "echo"
    const foo = "foo"

    const echo = handler(cmd).get({}, name)

    assertExists(echo(foo))
    assertExists(echo(foo).foo)
    assertExists(echo(foo).foo())
    assertExists(echo(foo).foo().foo)
    assertExists(echo(foo).foo().foo())
  }
)

Deno.test(
  `given a handler, it should ultimatly return a process`,
  async () => {
    // Given
    const cmd: Command = []
    const name = "echo"
    const foo = "foo"

    // Then
    const echo = handler(cmd).get({}, name)
    const res = await echo(foo)()()

    res.stdout.close()
    res.stderr.close()
    res.close()

    // Then
    assert(res instanceof Deno.Process)
  }
)
