import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs', 'iife'],
  // https://vitejs.dev/guide/build.html#browser-compatibility
  target: ['es2021', 'node16', 'chrome87', 'firefox78', 'safari14', 'edge88'],
  clean: true,
  dts: true,
  splitting: true,
  globalName: 'Tomjs',
});
