.SILENT: install update fmt lint run test coverage bin debug-src debug-test
.PHONY: install update fmt lint run test coverage bin debug-src debug-test

install:
	deno cache --reload --lock=lock.json deps.ts

update:
	deno cache --lock=lock.json --lock-write deps.ts

fmt:
	#echo "can not use specific config :(" RUST_BACKTRACE=1 deno fmt -c .prettierrc.js src/
	deno fmt src/

lint:
	echo TODO

run: ## make run cmd=help			make run cmd=run ./script.js
	deno run -c tsconfig.json --lock=lock.json --cached-only --allow-run --allow-env --allow-read src/cli.ts ${cmd}

test:
	deno test -c tsconfig.json --allow-run --allow-read --failfast src/*.test.ts

coverage:
	echo TODO

bin:
	deno install -f --root . --name unshell --allow-run --allow-env --allow-read ./src/cli.ts

debug-src:
	deno run -c tsconfig.json --inspect-brk -A ${file}

debug-test:
	deno test -c tsconfig.json --inspect-brk -A ${file}
