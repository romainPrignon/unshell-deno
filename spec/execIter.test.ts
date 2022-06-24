import { path, assertEquals } from "../deps.ts"

import unshell, { exec, execIter, pipe } from '../src/mod.ts'

// Deno.test(
//   `xxx`,
//   async () => {
//     // Given
//     const { less } = unshell()
//     const currentFile = path.fromFileUrl(import.meta.url)
//     const content = await Deno.readTextFile(currentFile)
//     const lines = content.split('\n')

//     // When
//     const {close, data} = await execIter(less(currentFile))

//     // Then
//     let lineNumber = 0
//     for await (const line of data) {
//       assertEquals(line, lines[lineNumber])
//       lineNumber++
//     }
//     close()
//   }
// )

Deno.test(
  `yyy`,
  async () => {
    // Given
    const { cat, base32 } = unshell()
    const randomFile = "./random.txt" // todo: fixtures

    // When
    // const res = await execIter(cat(randomFile))
    // const res = await execIter(pipe(cat(randomFile), base32()))
    const res = await execIter(cat(randomFile)).pipe(base32())
    console.log('res', res)
    // Then
    // console.log(res.length)
    // res.slice
  }
)
