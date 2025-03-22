import type { ArgRecord, Command, OptBuilder, ProcessBuilder } from "../type/index.d.ts"
import { arg } from "./arg.ts";

export const subarg = (target: OptBuilder | ProcessBuilder) =>
  (cmd: Command): ArgRecord | OptBuilder =>
    // @ts-expect-error arg(cmd)
    new Proxy(target, arg(cmd)) as ArgRecord | OptBuilder
