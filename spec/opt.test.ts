import { assertEquals } from "../deps.ts";

import unshell from '../src/mod.ts'

Deno.test(
  `given ls, when we call it with multiple short opt, then there should be no error`,
  () => {
    // Given
    const { ls } = unshell()

    // When
    const res = ls('-l', '-a', '-h')

    // Then
    assertEquals(typeof res, 'function')
  }
)

Deno.test(
  `given ls, when we call it with multiple short and long opt, then there should be no error`,
  () => {
    // Given
    const { ls } = unshell()

    // When
    const res = ls('-l', '-a', '-h', '--color')

    // Then
    assertEquals(typeof res, 'function')
  }
)

Deno.test(
  `given ls, when we call it with multiple short and long with val opt, then there should be no error`,
  () => {
    // Given
    const { ls } = unshell()

    // When
    const res = ls('-l', '-a', '-h', '--color=auto')

    // Then
    assertEquals(typeof res, 'function')
  }
)

Deno.test(
  `given ls, when we call it with multiple short and long as obj opt, then there should be no error`,
  () => {
    // Given
    const { ls } = unshell()

    // When
    const res = ls('-l', '-a', '-h', {color: 'auto'})

    // Then
    assertEquals(typeof res, 'function')
  }
)

Deno.test(
  `given ls, when we call it with multiple short concat opt, then there should be no error`,
  () => {
    // Given
    const { ls } = unshell()

    // When
    const res = ls('-lah')

    // Then
    assertEquals(typeof res, 'function')
  }
)

Deno.test(
  `given ls, when we call it with multiple short concat and long opt, then there should be no error`,
  () => {
    // Given
    const { ls } = unshell()

    // When
    const res = ls('-lah', '--color')

    // Then
    assertEquals(typeof res, 'function')
  }
)

Deno.test(
  `given ls, when we call it with multiple short concat and long with val opt, then there should be no error`,
  () => {
    // Given
    const { ls } = unshell()

    // When
    const res = ls('-lah', '--color=auto')

    // Then
    assertEquals(typeof res, 'function')
  }
)

Deno.test(
  `given ls, when we call it with multiple short concat and long as obj opt, then there should be no error`,
  () => {
    // Given
    const { ls } = unshell()

    // When
    const res = ls('-lah', { color: 'auto' })

    // Then
    assertEquals(typeof res, 'function')
  }
)

Deno.test(
  `given ls, when we call it with multiple long opt, then there should be no error`,
  () => {
    // Given
    const { ls } = unshell()

    // When
    const res = ls('-l', '--all', '--human-readable', '--color')

    // Then
    assertEquals(typeof res, 'function')
  }
)

Deno.test(
  `given ls, when we call it with multiple long with val opt, then there should be no error`,
  () => {
    // Given
    const { ls } = unshell()

    // When
    const res = ls('-l', '--all', '--human-readable', '--color=auto')

    // Then
    assertEquals(typeof res, 'function')
  }
)

Deno.test(
  `given ls, when we call it with multiple long and obj with val opt, then there should be no error`,
  () => {
    // Given
    const { ls } = unshell()

    // When
    const res = ls('-l', '--all', '--human-readable', {color: 'auto'})

    // Then
    assertEquals(typeof res, 'function')
  }
)

Deno.test(
  `given ls, when we call it with multiple short obj opt, then there should be no error`,
  () => {
    // Given
    const { ls } = unshell()

    // When
    const res = ls({ l: true, a: true, h: true})

    // Then
    assertEquals(typeof res, 'function')
  }
)

Deno.test(
  `given ls, when we call it with multiple long obj opt, then there should be no error`,
  () => {
    // Given
    const { ls } = unshell()

    // When
    const res = ls({ l: true, all: true, human_readable: true, color: 'auto' })

    // Then
    assertEquals(typeof res, 'function')
  }
)

Deno.test(
  `given docker, when we call it with dot syntax and opt, then there should be no error`,
  () => {
    // Given
    const { docker } = unshell()

    // When
    const res = docker.ps({ a: true, n: 1 })

    // Then
    assertEquals(typeof res, 'function')
  }
)

Deno.test(
  `given docker, when we call it with fn syntax and opt, then there should be no error`,
  () => {
    // Given
    const { docker } = unshell()

    // When
    const res = docker().ps({ a: true, n: 1 })

    // Then
    assertEquals(typeof res, 'function')
  }
)

Deno.test(
  `given docker, when we call it with fn syntax and opt at every steps, then there should be no error`,
  () => {
    // Given
    const { docker } = unshell()

    // When
    const res = docker({debug: true}).ps({ a: true, n: 1 })

    // Then
    assertEquals(typeof res, 'function')
  }
)

Deno.test(
  `given echo, when we call it with a command opt, then there should be no error`,
  () => {
    // Given
    const { echo, which } = unshell()

    // When
    const where_is_deno = echo(which("deno"))
    const where_is_node = echo(which("node"))

    // notre souci ici est que which("deno") n'a pas close son process
    // a moins de faire run(which("deno")) ?
    // faut revoir le designe entierement pour cette feature

    // Then
    assertEquals(typeof where_is_deno, 'function')
    assertEquals(typeof where_is_node, 'function')
  }
)

// tester des truc pas formatable pour tester les exection
