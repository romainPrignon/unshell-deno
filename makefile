run:
	deno run -c tsconfig.json --lock=lock.json --cached-only --allow-run --allow-env --allow-read src/cli.ts ${cmd}
