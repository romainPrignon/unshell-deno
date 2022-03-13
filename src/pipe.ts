
type Fn = (arg?: unknown) => any // TODO

export const pipe = (f1: Fn, ...fns: Array<Fn>) => {
  return () => {
    return fns.reduce(
      (acc, fn) => {
        return fn({prev: acc}) // not a common pipe anymore :/
      },
      f1()
    )
  }
}
