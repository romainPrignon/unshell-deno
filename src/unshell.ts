import { handler } from './handler.ts'

export const unshell = () => {
  return new Proxy<any>({}, handler())
}
