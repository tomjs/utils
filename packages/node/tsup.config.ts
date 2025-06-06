import { defineConfig } from 'tsup';

export default defineConfig((options) => {
  const isDev = !!options.watch;

  return {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    target: 'node16',
    shims: true,
    clean: true,
    dts: true,
    sourcemap: isDev,
    splitting: true,
  };
});
