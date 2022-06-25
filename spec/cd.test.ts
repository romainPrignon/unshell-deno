import { asserts, path } from "../deps.ts";
import unshell, { exec } from "../mod.ts";

Deno.test(
  `calling cmd after changing dir with cd should work`,
  async () => {
    // Given
    const currentDir = Deno.cwd();
    const newDir = path.dirname(path.fromFileUrl(import.meta.url));
    const currentFile = path.basename(import.meta.url);

    const { ls, cd } = unshell();

    // When
    cd(newDir);
    const res = await exec(ls());
    cd(currentDir);

    // Then
    asserts.assert(res.includes(currentFile));
  },
);
