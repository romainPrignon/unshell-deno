import { runTests, test, assert, assertThrowsAsync, assertEquals } from '../deps.ts'

// test
import { cli } from './cli.ts'


// TODO: mock
test(async function it_should_display_error_if_called_with_no_script() {
  // Arrange
  const args: Array<string> = ['unshell', 'run']
  const env = {}

  // Mock

  // Assert
  // assertThrowsAsync(() => cli({ args, env }))
})
