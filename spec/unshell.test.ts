import { assertEquals } from "../deps.ts"

import unshell from '../src/mod.ts'

// todo: add multipletest
const binaries = [
  'git',
  'docker',
  'docker_compose',
  'apt',
  'pwd',
  'ls'
]

// Deno.test(`git`, () => {
//     // Given
//     const { git } = unshell()

//     // When
//     const res = git() // todo: finish using exec

//     // Then
//     assertEquals(res, 'xxx')
//   }
// )
