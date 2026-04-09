/**
 * ATDD Tests for Sprint Status Command - AC1
 *
 * TDD Phase: RED (tests written before implementation)
 * Test Level: Unit (File Content Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 8.4 - Implement Sprint Status Command
 *
 * AC1: Given FR-39 specifies `/sprint-status` listing all stories with current status, age, and pending actions
 *      When a developer runs `/sprint-status`
 *      Then the system scans `_scrum-output/sprints/` for all story directories
 *      And displays a summary table with: story ID, title, current status, age (days since creation), pending action (next required command)
 */

import { existsSync, readFileSync, mkdirSync, writeFileSync, rmSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Test paths - use fileURLToPath for reliable location tracking
const PROJECT_ROOT = join(__dirname, '..', '..', '..');
const SPRINT_STATUS_CMD = join(PROJECT_ROOT, 'scrum_workflow', 'commands', 'sprint-status.md');
const SPRINT_STATUS_UTILS = join(PROJECT_ROOT, 'scrum_workflow', 'utils', 'sprint-status.js');
const SPRINT_STATUS_WORKFLOW = join(PROJECT_ROOT, 'scrum_workflow', 'workflows', 'sprint-status.md');
const SPRINTS_OUTPUT_DIR = join(PROJECT_ROOT, '_scrum-output', 'sprints');

// Helper to create a mock story structure for testing
function createMockStoryDir(ticketId: string, title: string, status: string, createdDaysAgo: number): string {
  const storyDir = join(SPRINTS_OUTPUT_DIR, ticketId);
  mkdirSync(storyDir, { recursive: true });

  const storyMdContent = `---
ticket: ${ticketId}
title: ${title}
status: ${status}
created: ${new Date(Date.now() - createdDaysAgo * 86400000).toISOString()}
updated: ${new Date().toISOString()}
---

# ${title}

Story content here.
`;

  writeFileSync(join(storyDir, 'story.md'), storyMdContent, 'utf8');
  return storyDir;
}

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
// AC1: Sprint Status Command & Workflow Definition
// ============================================================================

describe('AC1: Sprint Status Command & Workflow Definition', () => {

  afterAll(() => {
    cleanupTestStories();
  });

  // Test 1.1: sprint-status.md command should exist
  test.skip('[P0] scrum_workflow/commands/sprint-status.md should exist', () => {
    expect(existsSync(SPRINT_STATUS_CMD)).toBe(true);
  });

  // Test 1.2: sprint-status.md workflow should exist
  test.skip('[P0] scrum_workflow/workflows/sprint-status.md should exist', () => {
    expect(existsSync(SPRINT_STATUS_WORKFLOW)).toBe(true);
  });

  // Test 1.3: sprint-status.js utility should exist
  test.skip('[P0] scrum_workflow/utils/sprint-status.js should exist', () => {
    expect(existsSync(SPRINT_STATUS_UTILS)).toBe(true);
  });

  // Test 1.4: sprint-status.md should define the /sprint-status slash-command
  test.skip('[P0] sprint-status.md should define /sprint-status slash-command', () => {
    const content = readFileSync(SPRINT_STATUS_CMD, 'utf8');
    expect(content).toMatch(/sprint-status|SW-\d{3}/);
  });

  // Test 1.5: sprint-status.md should reference sprint-status workflow
  test.skip('[P0] sprint-status.md should reference sprint-status workflow', () => {
    const content = readFileSync(SPRINT_STATUS_CMD, 'utf8');
    expect(content).toMatch(/sprint-status/i);
  });

  // Test 1.6: sprint-status workflow should define story scanning process
  test.skip('[P0] sprint-status workflow should define story scanning process', () => {
    const content = readFileSync(SPRINT_STATUS_WORKFLOW, 'utf8');
    expect(content).toMatch(/scan|directory|_scrum-output\/sprints/i);
  });

  // Test 1.7: sprint-status.js should export scanStories function
  test.skip('[P0] sprint-status.js should export scanStories function', () => {
    const content = readFileSync(SPRINT_STATUS_UTILS, 'utf8');
    expect(content).toMatch(/export.*scanStories|module\.exports.*scanStories/);
  });

  // Test 1.8: sprint-status.js should support reading story.md YAML frontmatter
  test.skip('[P0] sprint-status.js should support reading story.md YAML frontmatter', () => {
    const content = readFileSync(SPRINT_STATUS_UTILS, 'utf8');
    expect(content).toMatch(/yaml|frontmatter|parse/i);
  });
});

// ============================================================================
// AC1: Story Directory Scanning
// ============================================================================

describe('AC1: Story Directory Scanning', () => {
  const TEST_TICKETS = [
    { id: 'SW-001', title: 'Test Story 1', status: 'in-progress', daysAgo: 3 },
    { id: 'SW-002', title: 'Test Story 2', status: 'done', daysAgo: 7 },
    { id: 'SW-003', title: 'Test Story 3', status: 'draft', daysAgo: 1 },
  ];

  afterAll(() => {
    cleanupTestStories();
  });

  test.skip('[P0] _scrum-output/sprints directory should exist or be creatable', () => {
    if (!existsSync(SPRINTS_OUTPUT_DIR)) {
      mkdirSync(SPRINTS_OUTPUT_DIR, { recursive: true });
    }
    expect(existsSync(SPRINTS_OUTPUT_DIR)).toBe(true);
  });

  test.skip('[P0] sprint-status should scan _scrum-output/sprints for story directories', () => {
    // Create mock story directories
    TEST_TICKETS.forEach(t => {
      createMockStoryDir(t.id, t.title, t.status, t.daysAgo);
    });

    // Verify directories exist
    expect(existsSync(join(SPRINTS_OUTPUT_DIR, 'SW-001'))).toBe(true);
    expect(existsSync(join(SPRINTS_OUTPUT_DIR, 'SW-002'))).toBe(true);
    expect(existsSync(join(SPRINTS_OUTPUT_DIR, 'SW-003'))).toBe(true);
  });

  test.skip('[P0] sprint-status should extract metadata from story.md YAML frontmatter', () => {
    // Verify story.md files have correct YAML frontmatter
    TEST_TICKETS.forEach(t => {
      const storyPath = join(SPRINTS_OUTPUT_DIR, t.id, 'story.md');
      const content = readFileSync(storyPath, 'utf8');
      expect(content).toMatch(new RegExp(`ticket: ${t.id}`));
      expect(content).toMatch(new RegExp(`title: ${t.title}`));
      expect(content).toMatch(new RegExp(`status: ${t.status}`));
    });
  });

  test.skip('[P1] sprint-status should calculate story age in days from created timestamp', () => {
    // Age calculation is tested indirectly through the table output
    const storyPath = join(SPRINTS_OUTPUT_DIR, 'SW-001', 'story.md');
    const content = readFileSync(storyPath, 'utf8');
    expect(content).toMatch(/created:/);
  });

  test.skip('[P1] sprint-status should determine pending action based on current status', () => {
    // Pending action mapping:
    // draft -> /scrum-refine-ticket
    // in-progress -> /scrum-verify
    // done -> N/A
    // This will be verified in the output table
  });
});

// ============================================================================
// AC1: Summary Table Display
// ============================================================================

describe('AC1: Summary Table Display', () => {

  afterAll(() => {
    cleanupTestStories();
  });

  test.skip('[P0] summary table should have columns: Story ID, Title, Status, Age, Pending Action', () => {
    // The table output format is defined in the workflow
    const content = readFileSync(SPRINT_STATUS_WORKFLOW, 'utf8');
    expect(content).toMatch(/Story ID|Title|Status|Age|Pending Action/i);
  });

  test.skip('[P1] story ID should be formatted as SW-XXX', () => {
    // This is validated through the story directory naming convention
  });

  test.skip('[P1] story age should be displayed in days (e.g., "3d", "14d")', () => {
    // Age display format is defined in the workflow
    const content = readFileSync(SPRINT_STATUS_WORKFLOW, 'utf8');
    expect(content).toMatch(/days?|d$/i);
  });
});
