import { assertEquals } from "testing/asserts.ts";

import { execIter } from "../src/execIter.ts";

Deno.test(
  "given a future process, when we execIter it, then we should get the result",
  async () => {
    const p = Deno.run({
      cmd: ["echo", "foo"],
      stdout: "piped",
      stderr: "piped",
      stdin: "piped",
    });
    const cmd = () => async () => await p;

    // When
    const { data: res, close } = await execIter(cmd);

    // Then
    for await (const r of res) {
      assertEquals(r, "foo");
    }
    close();

    // clean
    p.stdin?.close();
  },
);
