import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['__tests__/**/*.test.{js,ts}', 'tests/**/*.test.{js,ts}', 'tests/**/*.spec.{js,ts}', '__tests__/**/*.spec.{js,ts}'],
    exclude: ['node_modules'],
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
  },
});
