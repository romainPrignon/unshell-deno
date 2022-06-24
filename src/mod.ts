import { unshell } from "./unshell.ts";
export * from "./exec.ts";
export * from "./execIter.ts";
export * from "./pipe.ts";

const main = () => {
  return unshell();
};

export default main;
