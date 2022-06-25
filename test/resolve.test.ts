import { asserts } from "../deps.ts";

import { resolve } from "../src/resolve.ts";

Deno.test(
  `given a process, when we resolve it, there should be no error`,
  async () => {
    // Given
    const process = Deno.run({
      cmd: ["echo", "foo"],
      stdout: "piped",
      stderr: "piped",
      stdin: "piped",
    });

    // When
    const res = await resolve(process);

    // Clean
    process.stdin?.close();

    // Then
    asserts.assertEquals(res, "foo");
  },
);

Deno.test(
  `given a broken process, when we resolve it, there should be an error`,
  async () => {
    // Given
    const process = Deno.run({
      cmd: ["git", "foo"],
      stdout: "piped",
      stderr: "piped",
      stdin: "piped",
    });

    // Clean
    process.stdin?.close();

    // Then
    await asserts.assertRejects(() => resolve(process));
  },
);
