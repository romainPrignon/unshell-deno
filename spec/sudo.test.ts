import { assert, assertRejects } from "testing/asserts.ts";

import unshell, { exec } from "../src/mod.ts";

Deno.test(
  `given cat bin, when we cat protected file without sudo, then there should be an error`,
  async () => {
    // Given
    const { cat } = unshell();

    // Then
    await assertRejects(() => exec(cat("/etc/shadow")));
  },
);

Deno.test(
  `given cat bin, when we cat protected file with sudo, then there should be no error`,
  { ignore: true },
  async () => {
    // Given
    const { sudo } = unshell();

    // When
    const res = await exec(sudo.cat("/etc/shadow"));

    // Then
    assert(typeof res === "string");
  },
);
