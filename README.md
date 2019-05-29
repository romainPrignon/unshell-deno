TODO
====
- Deno.env type
- Deno.Process.status => harden type (signal for example)
- import dir => not understandable
- Uncaught Other: Is a directory (os error 21)
    at DenoError (js/errors.ts:22:5)
    at maybeError (js/errors.ts:33:12)
    at maybeThrowError (js/errors.ts:39:15)
    at sendSync (js/dispatch.ts:82:5)
    at fetchModuleMetaData (js/os.ts:75:19)
    at _resolveModule (js/compiler.ts:256:38)
    at resolveModuleNames (js/compiler.ts:487:35)
    at compilerHost.resolveModuleNames (third_party/node_modules/typescript/lib/typescript.js:121106:138)
    at resolveModuleNamesWorker (third_party/node_modules/typescript/lib/typescript.js:88311:127)
    at resolveModuleNamesReusingOldState (third_party/node_modules/typescript/lib/typescript.js:88553:24)
- import/export from testing unclear
- coverage
- eslint/tslint
