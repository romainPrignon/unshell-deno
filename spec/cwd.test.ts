import { path, assert } from "../deps.ts"
import unshell, { exec } from '../src/mod.ts'

Deno.test(
  `overriding unshell cwd options with exec cwd options should work`,
  async () => {
    const cwd = path.dirname(path.fromFileUrl(import.meta.url));
    const currentFile = path.basename(import.meta.url)

    // Given
    const unshellCwd = '/tmp'
    const execCwd = cwd
    const { ls } = unshell({ cwd: unshellCwd })

    // When
    const res = await exec(ls(), { cwd: execCwd })

    // Then
    assert(res.includes(currentFile))
  }
)
