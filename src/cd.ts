export const cd = (path: string): void => {
  Deno.chdir(path);
};
