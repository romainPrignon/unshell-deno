.SILENT: install format lint run test coverage bundle debug-deno debug-unshell
.PHONY: install format lint run test coverage bundle debug-deno debug-unshell

install:
	deno fetch deps.ts

format:
	echo "can not use specific config :("
	# RUST_BACKTRACE=1 deno fmt -c .prettierrc.js src/

lint:
	echo TODO

run: ## make run cmd=help			make run cmd=run ./script.js
	deno run --allow-run --allow-env --allow-read src/cli.ts ${cmd}

test:
	deno run --allow-run src/mod.test.ts

coverage:
	echo TODO

bundle:
	deno bundle src/cli.ts bin/unshell
	chmod a+x bin/unshell

debug-deno:
	/home/romain/workspace/open/deno/target/release/deno run --allow-run --allow-env --allow-read src/cli.ts ${cmd}

debug-unshell: # make debug-unshell cmd=run ./script.js
	deno run https://deno.land/std/bundle/run.ts ./bin/unshell ${cmd}

