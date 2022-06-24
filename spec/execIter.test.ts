import { assertEquals } from "testing/asserts.ts";
import * as path from "path";
import unshell, { execIter } from "../src/mod.ts";

Deno.test(
  `given less bin, if we use iter with less, then we should be able to iter line by line`,
  async () => {
    // Given
    const { less } = unshell();
    const currentFile = path.fromFileUrl(import.meta.url);
    const content = await Deno.readTextFile(currentFile);
    const lines = content.split("\n");

    // When
    const { close, data } = await execIter(less(currentFile));

    // Then
    let lineNumber = 0;
    for await (const line of data) {
      assertEquals(line, lines[lineNumber]);
      lineNumber++;
    }
    close();
  },
);
