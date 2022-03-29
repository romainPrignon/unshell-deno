import { path, assertEquals } from "../deps.ts"

import unshell, { exec, execIter } from '../src/mod.ts'

Deno.test(
  `xxx`,
  async () => {
    // Given
    const { less } = unshell()
    const currentFile = path.fromFileUrl(import.meta.url)
    const content = await Deno.readTextFile(currentFile)
    const lines = content.split('\n')

    // When
    const {close, data} = await execIter(less(currentFile))

    // Then
    let lineNumber = 0
    for await (const line of data) {
      assertEquals(line, lines[lineNumber])
      lineNumber++
    }
    close()
  }
)

// cat /dev/urandom | base32
