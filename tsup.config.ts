import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    target: ['es2021', 'node16'],
    clean: false,
    dts: true,
    minify: false,
    splitting: true,
  },
  {
    entry: ['src/index.ts'],
    format: ['iife'],
    platform: 'browser',
    // https://vitejs.dev/guide/build.html#browser-compatibility
    target: ['chrome87', 'firefox78', 'safari14', 'edge88'],
    clean: false,
    dts: false,
    minify: true,
    globalName: 'Tomjs',
  },
]);
