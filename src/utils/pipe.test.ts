// type
import { Options } from '../../type/index.d.ts'

import { test, assert } from '../../deps.ts'

// test
import { pipe } from './pipe.ts'


test(function it_should_return_a_function() {
  const f1 = () => {}

  const output = pipe(f1)

  assert(output instanceof Function)
})

test(function it_should_return_empty_string_on_call_with_no_args() {
  const f1 = () => {}

  const output = pipe(f1)()

  assert(output === ``)
})

test(function it_should_return_echo_hello_world_string_on_call_with_one_arg() {
  const f1 = (param) => `echo ${param}`

  const output = pipe(f1)(`hello world`)

  assert(output === `echo hello world`)
})

test(function it_should_return_echo_hello_world_pipe_grep_world_string_on_call_with_two_fn() {
  const f1 = (param) => `echo ${param}`
  const f2 = () => `grep world`

  const output = pipe(f1, f2)(`hello world`)

  assert(output === `echo hello world | grep world`)
})
