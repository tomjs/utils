import { defineConfig } from 'tsup';

export default defineConfig((options) => {
  const isDev = !!options.watch;

  return {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs', 'iife'],
    globalName: 'Tomjs',
    target: 'node16',
    shims: true,
    clean: true,
    dts: true,
    sourcemap: isDev,
    splitting: true,
    minifyWhitespace: !isDev,
  };
});
