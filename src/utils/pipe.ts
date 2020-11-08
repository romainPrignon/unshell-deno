export const pipe = <Args extends Array<unknown>>(f1: (...args: Args) => unknown, ...fns: Array<() => unknown>) =>
  (...args: Args) => {
    return fns.reduce(
      (res, fn) => `${res} | ${fn()}`,
      f1.apply(null, args) || ``,
    );
  }
