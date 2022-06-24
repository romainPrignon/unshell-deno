import { assertEquals } from "testing/asserts.ts";

import { pipe } from "../src/pipe.ts";

Deno.test(
  `given pipe and two funcion, when we call it, then res should be res from f1`,
  () => {
    // Given
    const res1 = "a";
    const f1 = () => res1;
    const f2 = (b: unknown) => b;

    const res2 = pipe(f1, f2);

    assertEquals(res2(), res1);
  },
);
