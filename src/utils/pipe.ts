export const pipe = (f1, ...fns) => {
  return (): Promise<unknown> => { // todo unknow
    const res = fns.reduce(
      async (prev: unknown, fn) => {
        return fn(await prev)
      },
      f1(),
    );

    return res
  }
}
