import unshell, { exec } from "https://deno.land/x/unshell/mod.ts";

const { docker } = unshell();

const pause = async (ids) => {
  for (const id of ids) {
    await exec(docker.pause(id)); // <---
  }
};

const fetchContainerIds = async () => {
  const ids = await exec(docker.ps({ q: true, no_trunc: true })); // <---

  return ids.split("\n").filter(Boolean);
};

await fetchContainerIds()
  .then(pause);
