// type
import { Options, Command } from '../type/index.d.ts'

import {test, assert, assertThrowsAsync} from '../deps.ts'

// test
import { unshell } from './unshell.ts'


test(function it_should_return_an_async_function_if_called_with_options() {
  // Arrange
  const opt: Options = {
    env: {}
  }

  // Act
  const output = unshell(opt)

  // Assert
  assert(output instanceof Function)
})

test(function it_should_return_an_async_function_if_called_with_default_options() {
  // Act
  const output = unshell()

  // Assert
  assert(output instanceof Function)
})

test(async function it_should_throw_if_script_is_not_a_generator() {
  // Arrange
  const cmd = `echo OK`
  const script: any = function () {
    return cmd
  }

  assertThrowsAsync(() => unshell()(script), Error, 'unshell: Invalid SCRIPT')
})

// test(async function it_should_process_command() {
//   // Arrange
//   const cmd = `echo OK`
//   const script = function * (): IterableIterator<string> {
//     yield cmd
//   }

//   // Mock
//   // console.log = (string) => {
//     // assertEquals(string, 'expected')
//   // }

//   // Act
//   const res = await unshell()(script)

//   //assert(typeof res === 'void')
// })

// // mock
// jest.mock('util')
// import util from 'util'


// beforeEach(() => {
//   console.log = jest.fn()
//   console.error = jest.fn()
// })

// afterEach(() => {
//   // @ts-ignore
//   console.log.mockRestore()
//   // @ts-ignore
//   console.error.mockRestore()
// })

// describe('unshell', () => {
//   const cmd = `echo OK`
//   const stdout = `result of echo OK`
//   const stderr = `'Error: exec'`
//   const opt: Options = {
//     env: {}
//   }


//   it('should log command', async () => {
//     // Arrange
//     const script = function * (): IterableIterator<string> {
//       yield cmd
//     }

//     // Mock
//     const execMock = jest.fn(() => ({
//       stdout
//     }))

//     // @ts-ignore
//     util.promisify = jest.fn().mockImplementation(() => {
//       return execMock
//     })

//     // Act
//     await unshell(opt)(script)

//     // Assert
//     expect(console.log).toHaveBeenNthCalledWith(1, `• ${cmd}`)
//     expect(console.log).toHaveBeenNthCalledWith(2, `➜ ${stdout}`)
//   })

//   it('should process command', async () => {
//     // Arrange
//     const script = function* (): IterableIterator<string> {
//       yield cmd
//     }

//     // Mock
//     const execMock = jest.fn((cmd: Command, opt: Options) => ({
//       stdout
//     }))

//     // @ts-ignore
//     util.promisify = jest.fn().mockImplementation(() => {
//       return execMock
//     })

//     // Act
//     await unshell(opt)(script)

//     expect(execMock).toHaveBeenCalledWith(cmd, opt)
//   })

//   it('should not log undefined yielded command', async () => {
//     // Arrange
//     const script = function* (): IterableIterator<string> {
//       yield cmd
//     }

//     // Mock
//     const execMock = jest.fn((cmd: Command, opt: Options) => ({
//       stdout: undefined
//     }))

//     // @ts-ignore
//     util.promisify = jest.fn().mockImplementation(() => {
//       return execMock
//     })

//     // Act
//     await unshell(opt)(script)

//     // Assert
//     expect(console.log).toHaveBeenCalledTimes(1)
//     expect(console.log).toHaveBeenNthCalledWith(1, `• ${cmd}`)
//   })

//   it('should process several command', async () => {
//     // Arrange
//     const script = function* (): IterableIterator<string> {
//       yield cmd
//       yield cmd
//     }

//     // Mock
//     const execMock = jest.fn((cmd: Command, opt: Options) => ({
//       stdout
//     }))

//     // @ts-ignore
//     util.promisify = jest.fn().mockImplementation(() => {
//       return execMock
//     })

//     // Act
//     await unshell(opt)(script)

//     expect(execMock).toHaveBeenNthCalledWith(1, cmd, opt)
//     expect(execMock).toHaveBeenNthCalledWith(2, cmd, opt)
//   })

//   it('should handle command throwing error', async (done) => {
//     // Arrange
//     const script = function* (): IterableIterator<string> {
//       yield cmd
//     }

//     // Mock
//     const errMock: any = new Error(stderr)
//     errMock.stderr = stderr
//     errMock.cmd = cmd

//     const execMock = jest.fn((cmd: Command, opt: Options) => {
//       throw errMock
//     })

//     // @ts-ignore
//     util.promisify = jest.fn().mockImplementation(() => {
//       return execMock
//     })

//     // Act
//     try {
//       await unshell(opt)(script)

//       done(`It doesn't handle stderr properly`)
//     } catch (err) {
//       expect(console.error).toHaveBeenCalledWith({
//         cmd: errMock.cmd,
//         stderr: errMock.stderr
//       })

//       expect(err).toEqual(errMock)

//       done()
//     }
//   })

//   it('should log returned command', async () => {
//     // Arrange
//     const script = function* (): IterableIterator<string> {
//       return cmd
//     }

//     // Mock
//     const execMock = jest.fn((cmd: Command, opt: Options) => ({
//       stdout
//     }))

//     // @ts-ignore
//     util.promisify = jest.fn().mockImplementation(() => {
//       return execMock
//     })

//     // Act
//     await unshell(opt)(script)

//     // Assert
//     expect(console.log).toHaveBeenNthCalledWith(1, `• ${cmd}`)
//     expect(execMock).toHaveBeenCalledWith(cmd, opt)
//     expect(console.log).toHaveBeenNthCalledWith(2, `➜ ${stdout}`)
//   })

//   it('should not log undefined returned command', async () => {
//     // Arrange
//     const script = function* (): IterableIterator<string> {
//       return cmd
//     }

//     // Mock
//     const execMock = jest.fn((cmd: Command, opt: Options) => ({
//       stdout: undefined
//     }))

//     // @ts-ignore
//     util.promisify = jest.fn().mockImplementation(() => {
//       return execMock
//     })

//     // Act
//     await unshell(opt)(script)

//     // Assert
//     expect(console.log).toHaveBeenCalledTimes(1)
//     expect(console.log).toHaveBeenNthCalledWith(1, `• ${cmd}`)
//   })

//   it('should log yielded command and returned command', async () => {
//     // Arrange
//     const script = function* (): IterableIterator<string> {
//       yield cmd
//       return cmd
//     }

//     // Mock
//     const execMock = jest.fn((cmd: Command, opt: Options) => ({
//       stdout
//     }))

//     // @ts-ignore
//     util.promisify = jest.fn().mockImplementation(() => {
//       return execMock
//     })

//     // Act
//     await unshell(opt)(script)

//     // Assert
//     // yield
//     expect(console.log).toHaveBeenNthCalledWith(1, `• ${cmd}`)
//     expect(execMock).toHaveBeenNthCalledWith(1, cmd, opt)
//     expect(console.log).toHaveBeenNthCalledWith(2, `➜ ${stdout}`)

//     // return
//     expect(console.log).toHaveBeenNthCalledWith(3, `• ${cmd}`)
//     expect(execMock).toHaveBeenNthCalledWith(2, cmd, opt)
//     expect(console.log).toHaveBeenNthCalledWith(4, `➜ ${stdout}`)
//   })

//   it('should pass arguments to script', async () => {
//     // Arrange
//     const script = function* (...args: Array<number>) {
//       for (const arg of args) {
//         yield `echo ${arg}`
//       }
//     }

//     // Mock
//     const execMock = jest.fn((cmd: Command, opt: Options) => ({
//       stdout
//     }))

//     // @ts-ignore
//     util.promisify = jest.fn().mockImplementation(() => {
//       return execMock
//     })

//     // Act
//     await unshell(opt)(script, 1, 2)

//     // Assert
//     expect(console.log).toHaveBeenNthCalledWith(1, `• echo 1`)
//     expect(execMock).toHaveBeenNthCalledWith(1, 'echo 1', opt)
//     expect(console.log).toHaveBeenNthCalledWith(2, `➜ ${stdout}`)

//     expect(console.log).toHaveBeenNthCalledWith(3, `• echo 2`)
//     expect(execMock).toHaveBeenNthCalledWith(2, 'echo 2', opt)
//     expect(console.log).toHaveBeenNthCalledWith(4, `➜ ${stdout}`)
//   })
// })
