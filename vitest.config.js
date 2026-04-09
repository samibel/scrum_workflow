import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    include: ['tests/**/*.spec.ts', '__tests__/**/*.test.js'],
    testTimeout: 30000,
    // Ensure test files run sequentially to avoid directory cleanup race conditions
    maxWorkers: 1,
  },
});
