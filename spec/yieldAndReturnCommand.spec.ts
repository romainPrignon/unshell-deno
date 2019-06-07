import { test, assertEquals } from '../deps.ts'

test(async function it_should_exec_from_a_yield_and_return_of_a_command() {
  // Given
  const cliPath = `${Deno.cwd()}/src/cli.ts`
  const unshellCommand = 'run'
  const scriptPath = `${Deno.cwd()}/fixtures/scripts/yieldAndReturnCommand.ts`

  // When
  const process = Deno.run({
    args: `deno run --allow-run --allow-env ${cliPath} ${unshellCommand} ${scriptPath}`.split(' '),
    stdout: 'piped'
  })
  const stdout = new TextDecoder('utf-8').decode(await process.output())

  // Then
  assertEquals(stdout, '• echo hello\n➜ hello\n\n• echo world\n➜ world\n\n')
})
