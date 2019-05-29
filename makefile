help:
	deno run --allow-run src/cli.ts help

run:
	deno run --allow-run src/cli.ts run ${script}

test:
	deno run src/mod.test.ts
