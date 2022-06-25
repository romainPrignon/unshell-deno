import { asserts } from "../deps.ts";

import { cd } from "../src/cd.ts";

Deno.test(
  `we should only allow string name parameters, otherwise return cmd`,
  () => {
    // Given
    const newPath = "/tmp";

    // Given
    cd(newPath);

    // Then
    asserts.assertEquals(Deno.cwd(), newPath);
  },
);
