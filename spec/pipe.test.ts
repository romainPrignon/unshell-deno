import { asserts } from "../deps.ts";

import unshell, { exec, pipe } from "../mod.ts";

Deno.test(
  `given multiple binary, when we pipe them, then there should be no error`,
  async () => {
    // Given
    const { echo, base64 } = unshell();

    // When
    const res = await exec(pipe(echo("foo"), base64()));

    // Then
    asserts.assertEquals(res, "Zm9vCg==");
  },
);

Deno.test(
  `given multiple binary, when we pipe them multiple times, then there should be no error`,
  async () => {
    // Given
    const { echo, base64 } = unshell();

    // When
    const res = await exec(pipe(echo("foo"), base64(), base64()));

    // Then
    asserts.assertEquals(res, "Wm05dkNnPT0K");
  },
);

Deno.test(
  `given multiple binary and error in the first one, when we pipe them, then there should be an error`,
  async () => {
    // Given
    const { cat, base64 } = unshell();

    // Then
    await asserts.assertRejects(() => exec(pipe(cat("/etc/shadow"), base64())));
  },
);
