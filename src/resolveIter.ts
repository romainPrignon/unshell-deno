import type { Process } from "../type/index.d.ts";
import { readLines } from "io";

export const resolveIter = async (process: Process) => {
  const { success } = await process.status();
  const stderr = new TextDecoder("utf-8").decode(await process.stderrOutput());

  if (!success) {
    throw new Error(stderr.trim());
  }

  process.close();

  return {
    close() {
      process.stdout?.close();
    },
    data: readLines(process.stdout!),
  };
};
