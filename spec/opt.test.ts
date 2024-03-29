import { asserts } from "../deps.ts";

import unshell from "../mod.ts";

Deno.test(
  `given docker, when we call it with fn syntax and opt at every steps, then there should be no error`,
  () => {
    // Given
    const { docker } = unshell();

    // When
    const res = docker({ debug: true }).ps({ a: true, n: 1 });

    // Then
    asserts.assertExists(res);
  },
);

Deno.test(
  `given echo, when we call it with a command opt, then there should be no error`,
  () => {
    // Given
    const { echo, which } = unshell();

    // When
    const where_is_deno = echo(which("deno"));

    // Then
    asserts.assertExists(where_is_deno);
  },
);

Deno.test(
  `given ls, when we call it with a number opt, then there should be no error`,
  () => {
    // Given
    const { ls } = unshell();

    // Then
    asserts.assertExists(ls(1));
  },
);
