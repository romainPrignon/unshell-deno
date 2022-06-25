import { asserts } from "../deps.ts";

import unshell, { exec } from "../mod.ts";

Deno.test(
  `given cat bin, when we cat protected file without sudo, then there should be an error`,
  async () => {
    // Given
    const { cat } = unshell();

    // Then
    await asserts.assertRejects(() => exec(cat("/etc/shadow")));
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
    asserts.assert(typeof res === "string");
  },
);
