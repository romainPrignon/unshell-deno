import { assertEquals } from "../deps.ts"

Deno.test({
  name: "it_should_exec_from_a_yield_and_return_of_a_command",
  fn: async () => {

  }
})

Deno.test("it_should_exec_from_a_yield_and_return_of_a_command", async () => {
  // Given
  const cliPath = `${Deno.cwd()}/src/cli.ts`
  const unshellCommand = 'run'
  const scriptPath = `${Deno.cwd()}/fixtures/scripts/yieldAndReturnCommand.js`

  // When
  const process = Deno.run({
    cmd: `deno run --allow-run --allow-env --allow-read ${cliPath} ${unshellCommand} ${scriptPath}`.split(' '),
    stdout: 'piped'
  })
  const stdout = new TextDecoder('utf-8').decode(await process.output())

  // Then
  Deno.close(process.rid)
  assertEquals(stdout, '• echo hello\n➜ hello\n\n• echo world\n➜ world\n\n')
})
