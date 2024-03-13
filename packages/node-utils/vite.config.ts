/// <reference types="vitest" />

import fs from 'node:fs';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import target from 'vite-plugin-target';

export default defineConfig({
  build: {
    target: ['node16', 'es2021'],
    lib: {
      entry: 'src/index.ts',
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    minify: false,
    rollupOptions: {
      output: {
        exports: 'named',
      },
    },
  },
  plugins: [
    dts({
      rollupTypes: true,
      afterBuild: () => {
        fs.copyFileSync('dist/index.d.ts', 'dist/index.d.mts');
      },
    }),
    target({
      node: {},
    }),
  ],
  test: {
    globals: true,
  },
});
