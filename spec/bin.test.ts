import { assertExists, assertThrows } from "../deps.ts";

import unshell from '../src/mod.ts'

Deno.test(
  "given a binary in path, when we destructure that binary from unshell, then there should be no error",
  () => {
    // When
    const { echo } = unshell()

    // Then
    assertExists(echo)
  }
);

Deno.test(
  "given a composed name binary in path, when we destructure that binary from unshell, then there should be no error",
  () => {
    // When
    const { docker_compose } = unshell()

    // Then
    assertExists(docker_compose)
  }
);

Deno.test(
  `given multiple binaries, when we destructure those binaries from unshell, then there should be no error`,
  () => {
    // Given
    const { docker, docker_compose } = unshell()

    // When
    const docker_res = docker()
    const docker_compose_res = docker_compose()

    // Then
    assertExists(docker_res)
    assertExists(docker_compose_res)
  }
)

Deno.test(
  "given a binary not in path, when we destructure that binary from unshell, then there should be an error",
  () => {
    assertThrows(() => {
      const { _notInPath } = unshell()
    });
  }
);

// si path undefined => throw not in path
Deno.test(
  "given a binary in path, if path is not defined, when we destructure that binary from unshell, then there should be an error",
  () => {
    const pathEnv = Deno.env.get('PATH') || ''

    // given
    Deno.env.delete('PATH')

    // then
    assertThrows(() => {
      const { echo } = unshell()
    })

    Deno.env.set('PATH', pathEnv)
  }
);
