import { asserts } from "../deps.ts";

import unshell, { exec } from "../mod.ts";

Deno.test(
  `given echo bin, if we call it twice, then there should be no overlap between command`,
  async () => {
    // Given
    const { echo } = unshell();

    // When
    const foo = await exec(echo("foo"));
    const bar = await exec(echo("bar"));

    // Then
    asserts.assertEquals(foo, "foo");
    asserts.assertEquals(bar, "bar");
  },
);

Deno.test(
  `given echo bin, if we mix the calls, then there should be no overlap between command`,
  async () => {
    // Given
    const { echo } = unshell();

    // When
    const echoFoo = echo("foo");
    const bar = await exec(echo("bar"));
    const foo = await exec(echoFoo);

    // Then
    asserts.assertEquals(foo, "foo");
    asserts.assertEquals(bar, "bar");
  },
);
