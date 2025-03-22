import { assertEquals } from "../deps.ts";

import unshell from '../src/mod.ts'


const binaries = [
  'git',
  'docker',
  'docker_compose',
  'apt',
  'pwd',
  'ls'
]

binaries.forEach(binary => {
  Deno.test(
    `given ${binary}, when we call ${binary}, then result should be an opt function`,
    () => {
      // Given
      const bin = unshell()[binary]

      // When
      const res = bin()

      // Then
      assertEquals(typeof res, 'function')
    }
  )
})

Deno.test(
  `given multiple binaries, when we destructure those binaries from unshell and call them, then result should be an opt function`,
  () => {
    // Given
    const {docker, docker_compose} = unshell()

    // When
    const docker_res = docker()
    const docker_compose_res = docker_compose()

    // Then
    assertEquals(typeof docker_res, 'function')
    assertEquals(typeof docker_compose_res, 'function')
  }
)
