import { ArgRecord, Command, OptBuilder } from "../type/index.d.ts";
import { opt } from "./opt.ts";
import {subarg} from './subarg.ts'


// export const arg = (cmd?: Command) => {
//   const _cmd = cmd || []

//   return {
//     get(_target: ArgRecord | OptBuilder, name: string) {

//       // if (name === 'name') return
//       // si name === 'name' // return ?
//       // if (name === 'name') return {} // semble pas marcher
//       // si target !== {} // return ?
//       // if (_target !== {}) return {} // on peut plus call les fn apres: git()
//       // peut-etre qu'il faut garder un compteur sur le nombre d'appel et throw ?


//       name && _cmd.push(name)
//       return subarg(opt(_cmd) as OptBuilder)(_cmd)
//     }
//   }
// }

export const arg = (cmd: Command = []) => { // rename command ?

  return {
    get(_target: ArgRecord, name: string): any {

      if (name === 'name') return // comprendre ce truc !!!!!
      const cmdWithArg = cmd.concat(name)

      return new Proxy((...opts: any[]) => {
        const cmdWithArgAndOpt = cmdWithArg.concat(...opts)

        return new Proxy(() => {
          return cmdWithArgAndOpt
          // @ts-expect-error find why
        }, arg(cmd))
        // @ts-expect-error find why
      }, arg(cmd))
    }
  }
}
