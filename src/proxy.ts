// todo: extract me
type UnknownDictionary = Record<string, unknown> // pas sur car ya aussi les function

export const proxy = <T extends UnknownDictionary>(target: T, name: string, cb: any): T =>
{
  // console.log({target, name, cb: cb.toString()})
  // const { target: nextTarget, name: nextName, cb: nextCb } = cb(target, name)

  const handler: ProxyHandler<T> = {
    get(_target: T, _name: string) {

      const { target: nextTarget, name: nextName, cb: nextCb } = cb(_target, _name)
      console.log({ target: nextTarget, name: nextName, cb: nextCb })
      return proxy(nextTarget, nextName, nextCb) // ou alors nextCb est une HOF et on inject target et name
    }
  }

  return new Proxy<T>(target, handler)
  // return new Proxy<T>(nextTarget, handler) // peut etre next handler ? le créer dynamiquement
}

