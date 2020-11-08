import { Args, Engine, Options, Script } from "../type/index.d.ts";

const defaultOptions = {
  env: {},
};

export const unshell = (opt: Options = defaultOptions): Engine => {
  return async (script: Script, ...args: Args): Promise<void> => {
    assertUnshellScript(script);

    const it = script(...args);
    let cmd = await it.next();

    while (cmd.done === false) {
      if (isEmptyCmd(cmd.value)) {
        cmd = await it.next();
        continue;
      }

      console.log(`• ${cmd.value}`);

      try {
        const commands = cmd.value.split(" ");

        const process = Deno.run({
          cmd: commands,
          env: opt.env,
          stdout: "piped",
        });
        const stdout = new TextDecoder("utf-8").decode(await process.output());

        if (stdout) {
          console.log(`➜ ${stdout}`);
        }

        cmd = await it.next(stdout);
      } catch (err) {
        console.error({
          cmd: err.cmd,
          stderr: err.stderr,
        });

        throw err;
      }
    }

    // last iteration
    if (cmd.done === true && cmd.value) {
      console.log(`• ${cmd.value}`);

      const commands = cmd.value.split(" ");

      const process = Deno.run({
        cmd: commands,
        env: opt.env,
        stdout: "piped",
      });
      const stdout = new TextDecoder("utf-8").decode(await process.output());

      if (stdout) {
        console.log(`➜ ${stdout}`);
      }
    }
  };
};

export function assertUnshellScript(fn: unknown): asserts fn is Script {
  if (!isFunction(fn)) {
    throw new Error("unshell: Invalid SCRIPT");
  }
  if (!(isGenerator(fn) || isAsyncGenerator(fn))) {
    throw new Error("unshell: Invalid SCRIPT");
  }
}

const isFunction = (fn: unknown): fn is () => unknown =>
  typeof fn === "function"

const isGenerator = (fn: () => unknown): fn is () => IterableIterator<string> =>
  fn.constructor.name === "GeneratorFunction";

const isAsyncGenerator = (
  fn: () => unknown,
): fn is () => AsyncIterableIterator<string> =>
  fn.constructor.name === "AsyncGeneratorFunction";

const isEmptyCmd = (cmd: string): boolean => !cmd.length;
