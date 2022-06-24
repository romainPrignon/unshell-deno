import { assertExists } from "testing/asserts.ts";

import unshell from "../src/mod.ts";

Deno.test(
  `given a binary with arg, when we call with dot syntax, then there should be no error`,
  () => {
    // Given
    const { git } = unshell();

    // When
    const res = git.remotes();

    // Then
    assertExists(res);
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
    assertExists(res);
  },
);
