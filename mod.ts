import { unshell } from "./src/unshell.ts";
export * from "./src/exec.ts";
export * from "./src/execIter.ts";
export * from "./src/pipe.ts";

const main = () => {
  return unshell();
};

export default main;
