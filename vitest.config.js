import { defineConfig } from '/home/user/scrum_workflow/create-scrum-workflow/node_modules/vitest/dist/config.js';

export default defineConfig({
  test: {
    globals: true,
    include: ['tests/**/*.spec.ts'],
    root: '/home/user/scrum_workflow',
  },
});
