import { defineConfig } from '@tomjs/eslint';

export default defineConfig({
  type: 'lib',
  rules: {
    'no-console': 'off',
    'ts/explicit-function-return-type': 'off',
  },
});
