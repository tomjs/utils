import fs from 'node:fs';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    target: ['node16', 'chrome87', 'firefox78', 'safari14', 'edge88'],
    lib: {
      entry: 'src/index.ts',
      fileName: 'index',
      name: 'Tomjs',
      formats: ['es', 'cjs', 'iife'],
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
  ],
});
