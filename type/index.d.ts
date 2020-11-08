interface MyIterableIterator<T, TReturn = any, TNext = undefined> extends Iterator<T, TReturn, TNext> {
  [Symbol.iterator](): MyIterableIterator<T, TReturn, TNext>;
}

interface MyAsyncIterableIterator<T, TReturn = any, TNext = undefined> extends AsyncIterator<T, TReturn, TNext> {
  [Symbol.iterator](): MyAsyncIterableIterator<T, TReturn, TNext>;
}

// ----

export type Options = {
  env: {}
}

export type Command = string

export type Args = Array<any>

export type Script = (...args: Args) => MyIterableIterator<Command, Command, Command> | MyAsyncIterableIterator<Command, Command, Command>

export type Engine = (script: Script, ...args: Args) => Promise<void>
