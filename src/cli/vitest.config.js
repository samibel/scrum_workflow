import { defineConfig } from 'vitest/config';

// Force picocolors to emit ANSI codes under vitest's non-TTY stdout so that
// accessibility tests (which parse the escape sequences) behave deterministically.
process.env.FORCE_COLOR = process.env.FORCE_COLOR ?? '1';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['test/**/*.test.js'],
    exclude: ['node_modules'],
    env: {
      FORCE_COLOR: '1'
    }
  }
});
