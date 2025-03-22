import { ArgRecord, Command, OptBuilder } from "../type/index.d.ts";
import { opt } from "./opt.ts";
import {subarg} from './subarg.ts'


export const arg = (cmd?: Command) => {
  const _cmd = cmd || []

  return {
    get(_target: ArgRecord | OptBuilder, name: string) {

      // if (name === 'name') return
      // si name === 'name' // return ?
      // if (name === 'name') return {} // semble pas marcher
      // si target !== {} // return ?
      // if (_target !== {}) return {} // on peut plus call les fn apres: git()
      // peut-etre qu'il faut garder un compteur sur le nombre d'appel et throw ?


      name && _cmd.push(name)
      return subarg(opt(_cmd) as OptBuilder)(_cmd)
    }
  }
}
