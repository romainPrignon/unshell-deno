import { assertEquals } from "../deps.ts"

import unshell, { exec, pipe } from '../src/mod.ts'

Deno.test(`echo foo`, async () => {
  // Given
  const { echo } = unshell()

  // When
  const res = await exec(echo('foo'))

  // Then
  assertEquals(res, 'foo')
})

Deno.test(`echo $(which deno)`, async () => {
  // Given
  const { echo, which } = unshell()

  // When
  const res = await exec(echo(which('deno')))

  // Then
  assertEquals(res, '/home/romainprignon/.deno/bin/deno')
})

Deno.test(`git remote show origin -n | head -2`, async () => {
  // Given
  const { git, head } = unshell()

  // When
  const res = await exec(pipe(git.remote.show('origin', '-n'), head('-2')))

  // Then
  assertEquals(res, `* remote origin
  Fetch URL: git@github.com:romainPrignon/unshell-deno`)
})

Deno.test(`git log | uniq -c | tail -1`, async () => {
  // Given
  const { git, tail, uniq } = unshell()

  // When
  const cmd = pipe(
    git.log(),
    uniq({c: true}),
    tail('-1')
  )
  const res = await exec(cmd)

  // Then
  assertEquals(res, `1     initial commit`)
})

Deno.test(`pwd`, async () => {
  // Given
  const { pwd, basename } = unshell()

  // When
  const cwd = await exec(pwd())
  const name = await exec(basename(cwd))

  // Then
  assertEquals(name, "unshell-deno")
})

Deno.test(`find . -type f -name makefile`, async () => {
  // Given
  const { find } = unshell()

  // When
  const res = await exec(find('.', '-type', 'f', '-name', 'README.md'))

  // Then
  assertEquals(res, `./README.md`)
})

Deno.test(`wget -q -O /tmp/unshell/README.md https://raw.githubusercontent.com/romainPrignon/unshell/master/README.md`, async () => {
  // Given
  const { wget, rm, cat } = unshell()

  // When
  await exec(
    wget(
      { q: true }, '-O', '/tmp/unshell', 'https://raw.githubusercontent.com/romainPrignon/unshell/master/README.md'
    )
  )
  await exec(rm('/tmp/unshell'))

  // Then
  try {
    await exec(cat('/tmp/unshell'))
  } catch (err) {
    assertEquals(err.message, `cat: /tmp/unshell: No such file or directory`)
  }
})

Deno.test(`bash -c "echo hello"`, async () => {
  // Given
  const { bash } = unshell()

  // When
  const res = await exec(bash('-c', 'echo hello'))

  // Then
  assertEquals(res, `hello`)
})

Deno.test(`sleep 1`, async () => {
  // Given
  const { sleep } = unshell()

  // When
  console.time('sleep 1')
  await exec(sleep(1))
  console.timeEnd('sleep 1')
})

// cat
// less
