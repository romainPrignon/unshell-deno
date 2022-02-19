import { assertEquals } from "../deps.ts"

import { opt } from '../src/opt.ts'

// todo: tester des truc pas formatable pour tester les exection

Deno.test(
  `given ls, when we call it with multiple short opt, then there should be no error`,
  () => assertEquals(opt(['ls'], ['-l', '-a', '-h']), ['ls', '-l', '-a', '-h'])
)

Deno.test(
  `given ls, when we call it with multiple short and long opt, then there should be no error`,
  () => assertEquals(opt(['ls'], ['-l', '-a', '-h', '--color']), ['ls', '-l', '-a', '-h', '--color'])
)

Deno.test(
  `given ls, when we call it with multiple short and long with val opt, then there should be no error`,
  () => assertEquals(opt(['ls'], ['-l', '-a', '-h', '--color=auto']), ['ls', '-l', '-a', '-h', '--color=auto'])
)

Deno.test(
  `given ls, when we call it with multiple short and long as obj opt, then there should be no error`,
  () => assertEquals(opt(['ls'], ['-l', '-a', '-h', { color: 'auto' }]), ['ls', '-l', '-a', '-h', '--color=auto'])
)

Deno.test(
  `given ls, when we call it with multiple short concat opt, then there should be no error`,
  () => assertEquals(opt(['ls'], ['-lah']), ['ls', '-lah'])
)

Deno.test(
  `given ls, when we call it with multiple short concat and long opt, then there should be no error`,
  () => assertEquals(opt(['ls'], ['-lah', '--color']), ['ls', '-lah', '--color'])
)

Deno.test(
  `given ls, when we call it with multiple short concat and long with val opt, then there should be no error`,
  () => assertEquals(opt(['ls'], ['-lah', '--color=auto']), ['ls', '-lah', '--color=auto'])
)

Deno.test(
  `given ls, when we call it with multiple short concat and long as obj opt, then there should be no error`,
  () => assertEquals(opt(['ls'], ['-lah', { color: 'auto' }]), ['ls', '-lah', '--color=auto'])
)

Deno.test(
  `given ls, when we call it with multiple long opt, then there should be no error`,
  () => assertEquals(
    opt(['ls'], ['-l', '--all', '--human-readable', '--color']),
    ['ls', '-l', '--all', '--human-readable', '--color']
  )
)

Deno.test(
  `given ls, when we call it with multiple long with val opt, then there should be no error`,
  () => assertEquals(
    opt(['ls'], ['-l', '--all', '--human-readable', '--color=auto']),
    ['ls', '-l', '--all', '--human-readable', '--color=auto']
  )
)

Deno.test(
  `given ls, when we call it with multiple long and obj with val opt, then there should be no error`,
  () => assertEquals(
    opt(['ls'], ['-l', '--all', '--human-readable', { color: 'auto' }]),
    ['ls', '-l', '--all', '--human-readable', '--color=auto']
  )
)

Deno.test(
  `given ls, when we call it with multiple short obj opt, then there should be no error`,
  () => assertEquals(opt(['ls'], [{ l: true, a: true, h: true }]), ['ls', '-l', '-a', '-h'])
)

Deno.test(
  `given ls, when we call it with multiple long obj opt, then there should be no error`,
  () => assertEquals(
    opt(['ls'], [{ l: true, all: true, human_readable: true, color: 'auto' }]), ['ls', '-l', '--all', '--human-readable', '--color=auto']
  )
)

Deno.test(
  `given docker, when we call it with dot syntax and opt, then there should be no error`,
  () => assertEquals(opt(['docker', 'ps'], [{ a: true, n: 1}]), ['docker', 'ps', '-a', '-n=1'])
)
