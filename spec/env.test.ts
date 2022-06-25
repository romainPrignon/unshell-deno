import { asserts } from "../deps.ts";

import unshell, { exec } from "../mod.ts";

Deno.test(
  `should be able to print env var througth js`,
  async () => {
    // Given
    Deno.env.set("QUX", "qux");
    const { echo } = unshell();

    // When
    const res = await exec(echo(Deno.env.get("QUX")));

    // Then
    asserts.assertEquals(res, "qux");
  },
);

Deno.test(
  `should be able to print env var througth unshell`,
  async () => {
    // Given
    Deno.env.set("QUX", "qux");
    const { printenv } = unshell();

    // When
    const res = await exec(printenv("QUX"));

    // Then
    asserts.assertEquals(res, "qux");
  },
);
