.SILENT: help run test debug
.PHONY: help run test debug

help:
	deno run --allow-run src/cli.ts help

run:
	deno run --allow-run --allow-env src/cli.ts run ${script}

test:
	deno run --allow-run src/mod.test.ts

debug:
	/home/romainprignon/workspace/open/deno/target/release/deno run --allow-run --allow-env src/cli.ts run ${script}
