import { bin } from './bin.ts'

export const unshell = () => {
  return new Proxy({}, bin())
}
