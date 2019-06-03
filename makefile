.SILENT: help run test
.PHONY: help run test

help:
	deno run --allow-run src/cli.ts help

run:
	deno run --allow-run --allow-env src/cli.ts run ${script}

test:
	deno run src/mod.test.ts
