// gestion des args

const exec = async (cmd) => {
  console.log('[exec]', cmd)
  const process = Deno.run({
    cmd,
    stdout: 'piped',
    stderr: 'piped',
    stdin: 'piped'
  })

  const status = await process.status()
  const stdout = new TextDecoder("utf-8").decode(await process.output())
  const stderr = new TextDecoder("utf-8").decode(await process.stderrOutput())

  return { status, stdout, stderr }
}

const formatOpt = (name) => {
  return name.replace("_", "-")
}

const parseObject = (opt) => {
  return Object.entries(opt).map(([key, val]) => {
    switch (true) {
      case key.length === 1: {
        switch (true) {
          case typeof val === 'boolean': return `-${key}`
          default: return `-${key}=${val}` // = ou pas ? sans = il fauadrait split en deux arg je crois
        }
      }
      case key.length > 1: {
        switch (true) {
          case typeof val === 'boolean': return `--${formatOpt(key)}`
          case typeof val === 'string' || typeof val === 'number': return `--${formatOpt(key)}=${val}` // doit-on mettre le = ? certin util sont chiant ...
          default: throw new Error('not possible to parse object')
        }
      }
    }
  })
}

const cmd = (cmd, ...opts) => {
  console.log({ opts })
  const x = opts.map(opt => {
    switch (true) {
      case typeof opt === 'string': return opt
      case typeof opt === 'object' && opt !== null: return parseObject(opt)
      default: throw new Error('not possible to parse option')
    }
  })
  return [cmd].concat(...x)
}

let res

res = await exec(cmd('ls', '-lah'))
console.log({ res })
console.log('---\n')

res = await exec(cmd('ls', '-lah', '--color'))
console.log({ res })
console.log('---\n')

res = await exec(cmd('ls', '-lah', '--color=auto'))
console.log({ res })
console.log('---\n')

res = await exec(cmd('ls', '-lah', { color: 'auto' }))
console.log({ res })
console.log('---\n')

res = await exec(cmd('ls', '-l', '-a', '-h'))
console.log({ res })
console.log('---\n')

res = await exec(cmd('ls', '-l', '-a', '-h', '--color'))
console.log({ res })
console.log('---\n')

res = await exec(cmd('ls', '-l', '-a', '-h', '--color=auto'))
console.log({ res })
console.log('---\n')

res = await exec(cmd('ls', '-l', '-a', '-h', { color: 'auto' }))
console.log({ res })
console.log('---\n')

res = await exec(cmd('ls', '-l', '--all', '--human-readable', '--color'))
console.log({ res })
console.log('---\n')

res = await exec(cmd('ls', '-l', '--all', '--human-readable', '--color=auto'))
console.log({ res })
console.log('---\n')

res = await exec(cmd('ls', '-l', '--all', '--human-readable', { color: 'auto' }))
console.log({ res })
console.log('---\n')

res = await exec(cmd('ls', { l: true, a: true, h: true, color: 'auto' }))
console.log({ res })
console.log('---\n')

res = await exec(cmd('ls', { l: true, all: true, human_readable: true, color: 'auto' }))
console.log({ res })
console.log('---\n')

res = await exec(cmd('docker', 'ps', { a: true, n: 1 }))
console.log({ res })
console.log('---\n')

res = await exec(cmd('docker', 'ps', { all: true, last: 1 }))
console.log({ res })
console.log('---\n')

// il manque un truc du genre --foo bar sans le =
// genre docker ps -a -n=1
