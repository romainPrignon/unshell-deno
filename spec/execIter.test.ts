import { asserts } from "../deps.ts";
import { path } from "../deps.ts";
import unshell, { execIter } from "../mod.ts";

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
      asserts.assertEquals(line, lines[lineNumber]);
      lineNumber++;
    }
    close();
  },
);
