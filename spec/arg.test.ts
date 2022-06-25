import { asserts } from "../deps.ts";

import unshell from "../mod.ts";

Deno.test(
  `given a binary with arg, when we call with dot syntax, then there should be no error`,
  () => {
    // Given
    const { git } = unshell();

    // When
    const res = git.remotes();

    // Then
    asserts.assertExists(res);
  },
);

Deno.test(
  `given a binary with arg, when we call with opt syntax, then there should be no error`,
  () => {
    // Given
    const { git } = unshell();

    // When
    const res = git().remotes();

    // Then
    asserts.assertExists(res);
  },
);
