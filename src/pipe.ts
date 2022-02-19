
type Fn = (arg?: unknown) => unknown

export const pipe = (f1: Fn, ...fns: Array<Fn>) => {
  return () => {
    return fns.reduce(
      (acc, fn) => {
        return fn(acc)
      },
      f1()
    )
  }
}
