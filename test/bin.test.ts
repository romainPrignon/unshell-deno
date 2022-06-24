import { assertEquals, assertThrows } from "testing/asserts.ts";

import { bin } from "../src/bin.ts";

Deno.test(
  `we should only allow string name parameters, otherwise return cmd`,
  () => {
    // Given
    const cmd = ["echo"];
    const name = 1 as unknown as string;

    // Given
    const res = bin(cmd, name);

    // Then
    assertEquals(res, cmd);
  },
);

Deno.test(
  `given a command, when we add an arg with underscore, then res should be a command containing binary and formatted arg`,
  () => {
    // Given
    const cmd = ["foo"];
    const name = "bar_baz";

    // Given
    const res = bin(cmd, name);

    // Then
    assertEquals(res, ["foo", "bar-baz"]);
  },
);

Deno.test(
  `given an empty command, when we call with a binary not in path, then there should be an error`,
  () => {
    // Given
    const cmd: Array<string> = [];
    const name = "foo";

    // Then
    assertThrows(() => bin(cmd, name));
  },
);

Deno.test(
  `given an empty command, if path is not defined, when we call with a binary in path, then there should be an error`,
  () => {
    // Given
    const pathEnv = Deno.env.get("PATH") || "";
    Deno.env.delete("PATH");
    const cmd: Array<string> = [];
    const name = "deno";

    // Then
    assertThrows(() => bin(cmd, name));

    Deno.env.set("PATH", pathEnv);
  },
);

Deno.test(
  `given an empty command, when we call with a binary in path, then there should be no error`,
  () => {
    // Given
    const cmd: Array<string> = [];
    const name = "deno";

    // Given
    const res = bin(cmd, name);

    // Then
    assertEquals(res, [name]);
  },
);
