import { asserts } from "../deps.ts";

import unshell from "../mod.ts";

Deno.test(
  "given a binary in path, when we destructure that binary from unshell, then there should be no error",
  () => {
    // When
    const { echo } = unshell();

    // Then
    asserts.assertExists(echo);
  },
);

Deno.test(
  "given a composed name binary in path, when we destructure that binary from unshell, then there should be no error",
  () => {
    // When
    const { docker_compose } = unshell();

    // Then
    asserts.assertExists(docker_compose);
  },
);

Deno.test(
  `given multiple binaries, when we destructure those binaries from unshell, then there should be no error`,
  () => {
    // Given
    const { docker, docker_compose } = unshell();

    // When
    const docker_res = docker();
    const docker_compose_res = docker_compose();

    // Then
    asserts.assertExists(docker_res);
    asserts.assertExists(docker_compose_res);
  },
);

Deno.test(
  "given a binary not in path, when we destructure that binary from unshell, then there should be an error",
  () => {
    asserts.assertThrows(() => {
      const { _notInPath } = unshell();
    });
  },
);

Deno.test(
  "given a binary in path, if path is not defined, when we destructure that binary from unshell, then there should be an error",
  () => {
    const pathEnv = Deno.env.get("PATH") || "";

    // given
    Deno.env.delete("PATH");

    // then
    asserts.assertThrows(() => {
      // deno-lint-ignore no-unused-vars
      const { echo } = unshell();
    });

    Deno.env.set("PATH", pathEnv);
  },
);
