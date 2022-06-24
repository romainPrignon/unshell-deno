import type { FutureProcess } from "../type/index.d.ts";
import { resolveIter } from "./resolveIter.ts";

export const execIter = async (cmd: FutureProcess) => {
  const runner = cmd();

  // if runner is another unshell cmd, exec it
  const res = typeof runner === "function" ? await runner() : await runner;

  return resolveIter(res);
};
