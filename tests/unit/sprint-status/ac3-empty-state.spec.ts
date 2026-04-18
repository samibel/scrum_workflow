/**
 * ATDD Tests for Sprint Status Command - AC3
 *
 * TDD Phase: RED (tests written before implementation)
 * Test Level: Unit (File Content Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 8.4 - Implement Sprint Status Command
 *
 * AC3: Given no stories exist
 *      When `/sprint-status` is run
 *      Then a helpful message is displayed: "No stories found. Start with /scrum-create-ticket"
 */

import { existsSync, readFileSync, mkdirSync, rmSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Test paths
const PROJECT_ROOT = join(__dirname, '..', '..', '..');
const SPRINT_STATUS_WORKFLOW = join(PROJECT_ROOT, 'src', 'core', 'workflows', 'sprint-status.md');
const SPRINT_STATUS_CMD = join(PROJECT_ROOT, 'src', 'core', 'commands', 'sprint-status.md');
const SPRINTS_OUTPUT_DIR = join(PROJECT_ROOT, '_scrum-output', 'sprints');

// Helper to cleanup test stories
function cleanupTestStories() {
  if (existsSync(SPRINTS_OUTPUT_DIR)) {
    const dirs = readdirSync(SPRINTS_OUTPUT_DIR);
    dirs.forEach(dir => {
      const fullPath = join(SPRINTS_OUTPUT_DIR, dir);
      if (statSync(fullPath).isDirectory()) {
        rmSync(fullPath, { recursive: true, force: true });
      }
    });
  }
}

// ============================================================================
// AC3: Empty State Handling
// ============================================================================

describe('AC3: Empty State Handling', () => {

  afterAll(() => {
    cleanupTestStories();
  });

  test.skip('[P0] sprint-status should handle empty sprints directory', () => {
    // Ensure sprints directory exists but is empty
    if (!existsSync(SPRINTS_OUTPUT_DIR)) {
      mkdirSync(SPRINTS_OUTPUT_DIR, { recursive: true });
    }

    // Clean up any existing test stories
    const dirs = readdirSync(SPRINTS_OUTPUT_DIR);
    dirs.forEach(dir => {
      const fullPath = join(SPRINTS_OUTPUT_DIR, dir);
      if (statSync(fullPath).isDirectory()) {
        rmSync(fullPath, { recursive: true, force: true });
      }
    });

    // Verify directory is empty
    const remaining = readdirSync(SPRINTS_OUTPUT_DIR);
    expect(remaining.length).toBe(0);
  });

  test.skip('[P0] sprint-status workflow should define empty state message', () => {
    const content = readFileSync(SPRINT_STATUS_WORKFLOW, 'utf8');

    // Should mention the empty state scenario
    expect(content).toMatch(/empty|no stories|no stories found/i);
  });

  test.skip('[P0] empty state message should be: "No stories found. Start with /scrum-create-ticket"', () => {
    const content = readFileSync(SPRINT_STATUS_WORKFLOW, 'utf8');

    // Should have the exact empty state message or close variation
    expect(content).toMatch(/No stories found.*scrum-create-ticket/i);
  });

  test.skip('[P1] empty state should suggest next action: /scrum-create-ticket', () => {
    const content = readFileSync(SPRINT_STATUS_WORKFLOW, 'utf8');

    // Should reference the create-ticket command as the next step
    expect(content).toMatch(/scrum-create-ticket|create-ticket/i);
  });
});

// ============================================================================
// AC3: Edge Cases
// ============================================================================

describe('AC3: Edge Cases', () => {

  afterAll(() => {
    cleanupTestStories();
  });

  test.skip('[P1] sprint-status should handle missing story.md gracefully', () => {
    // Create a story directory without story.md
    const storyDir = join(SPRINTS_OUTPUT_DIR, 'SW-999');
    mkdirSync(storyDir, { recursive: true });

    // Write only a readme, no story.md
    const readmeContent = '# SW-999\n\nEmpty story directory\n';
    require('fs').writeFileSync(join(storyDir, 'README.md'), readmeContent, 'utf8');

    // When sprint-status runs, it should handle missing story.md
    expect(existsSync(join(storyDir, 'story.md'))).toBe(false);
  });

  test.skip('[P1] sprint-status should handle malformed YAML gracefully', () => {
    // Create a story directory with malformed YAML
    const storyDir = join(SPRINTS_OUTPUT_DIR, 'SW-998');
    mkdirSync(storyDir, { recursive: true });

    // Write malformed YAML frontmatter
    const malformedContent = `---
ticket: SW-998
title: Malformed Story
status: invalid-status
created: [invalid date
---

# Malformed Story
`;
    require('fs').writeFileSync(join(storyDir, 'story.md'), malformedContent, 'utf8');

    // sprint-status should not crash on malformed YAML
  });

  test.skip('[P2] sprint-status should handle missing created timestamp', () => {
    // Create a story without created field
    const storyDir = join(SPRINTS_OUTPUT_DIR, 'SW-997');
    mkdirSync(storyDir, { recursive: true });

    const noCreatedContent = `---
ticket: SW-997
title: No Created Field Story
status: draft
---

# No Created Field Story
`;
    require('fs').writeFileSync(join(storyDir, 'story.md'), noCreatedContent, 'utf8');

    // Should show "?" or "unknown" for age
  });
});

// ============================================================================
// AC3: Output Format
// ============================================================================

describe('AC3: Output Format', () => {

  test.skip('[P0] output should be human-readable (terminal table format) per NFR-9', () => {
    const content = readFileSync(SPRINT_STATUS_WORKFLOW, 'utf8');

    // NFR-9: All output is human-readable (terminal table format)
    expect(content).toMatch(/human-readable|terminal|table/i);
  });

  test.skip('[P0] output should follow UX-DR7 (emoji prefixes)', () => {
    const content = readFileSync(SPRINT_STATUS_WORKFLOW, 'utf8');

    // UX-DR7: Emoji prefixes - info for empty state
    expect(content).toMatch(/info|ℹ/i);
  });

  test.skip('[P0] output should follow UX-DR9 (single line per message)', () => {
    const content = readFileSync(SPRINT_STATUS_WORKFLOW, 'utf8');

    // UX-DR9: Single line per message
    expect(content).toMatch(/single.*line|one.*line/i);
  });
});
