import { asserts } from "../deps.ts";

import { exec } from "../src/exec.ts";

Deno.test(
  "given a future process, when we exec it, then we should get the result",
  async () => {
    const p = Deno.run({
      cmd: ["echo", "foo"],
      stdout: "piped",
      stderr: "piped",
      stdin: "piped",
    });
    const cmd = () => async () => await p;

    // When
    const res = await exec(cmd);

    // clean
    p.stdin?.close();

    // Then
    asserts.assertEquals(res, "foo");
  },
);
