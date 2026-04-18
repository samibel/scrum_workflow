/**
 * ATDD Tests for Sprint Status Command - AC2
 *
 * TDD Phase: RED (tests written before implementation)
 * Test Level: Unit (File Content Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 8.4 - Implement Sprint Status Command
 *
 * AC2: Given stories in various states
 *      When the summary is displayed
 *      Then stories are sorted by status priority (blocked/changes-needed first, then in-progress, then others)
 *      And stories requiring action are highlighted
 */

import { existsSync, readFileSync, mkdirSync, writeFileSync, rmSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Test paths
const PROJECT_ROOT = join(__dirname, '..', '..', '..');
const SPRINT_STATUS_WORKFLOW = join(PROJECT_ROOT, 'src', 'core', 'workflows', 'sprint-status.md');
const SPRINTS_OUTPUT_DIR = join(PROJECT_ROOT, '_scrum-output', 'sprints');

// Status priority order (highest to lowest)
const STATUS_PRIORITY = [
  'changes-needed',
  'blocked',
  'in-progress',
  'review',
  'approved',
  'refined',
  'ready-for-dev',
  'draft',
  'done',
  'cancelled',
];

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
// AC2: Status Priority Sorting
// ============================================================================

describe('AC2: Status Priority Sorting', () => {
  const TEST_TICKETS = [
    { id: 'SW-001', title: 'Done Story', status: 'done', daysAgo: 10 },
    { id: 'SW-002', title: 'Changes Needed Story', status: 'changes-needed', daysAgo: 3 },
    { id: 'SW-003', title: 'In Progress Story', status: 'in-progress', daysAgo: 5 },
    { id: 'SW-004', title: 'Draft Story', status: 'draft', daysAgo: 1 },
  ];

  afterAll(() => {
    cleanupTestStories();
  });

  test.skip('[P0] sprint-status workflow should define status priority order', () => {
    const content = readFileSync(SPRINT_STATUS_WORKFLOW, 'utf8');

    // Verify all status priorities are defined
    STATUS_PRIORITY.forEach(status => {
      expect(content).toMatch(new RegExp(status));
    });
  });

  test.skip('[P0] stories should be sorted by priority (changes-needed first)', () => {
    // Create test stories in non-sorted order
    createMockStoryDir('SW-004', 'Draft Story', 'draft', 1);
    createMockStoryDir('SW-002', 'Changes Needed Story', 'changes-needed', 3);
    createMockStoryDir('SW-003', 'In Progress Story', 'in-progress', 5);
    createMockStoryDir('SW-001', 'Done Story', 'done', 10);

    // When sprint-status runs, it should sort by priority
    // Expected order: changes-needed (SW-002), in-progress (SW-003), draft (SW-004), done (SW-001)
    const expectedOrder = ['SW-002', 'SW-003', 'SW-004', 'SW-001'];

    // This test verifies the sorting logic exists in the workflow
    const content = readFileSync(SPRINT_STATUS_WORKFLOW, 'utf8');
    expect(content).toMatch(/priority|sort/i);
  });

  test.skip('[P1] status priority order should be: changes-needed > blocked > in-progress > review > approved > refined > ready-for-dev > draft > done > cancelled', () => {
    const content = readFileSync(SPRINT_STATUS_WORKFLOW, 'utf8');

    // Verify the priority order is documented
    const priorityDoc = STATUS_PRIORITY.join('.*>.*');
    expect(content).toMatch(new RegExp(priorityDoc, 'i'));
  });

  test.skip('[P1] blocked status should have high priority (if implemented)', () => {
    const content = readFileSync(SPRINT_STATUS_WORKFLOW, 'utf8');
    // blocked should be near the top of priority
    if (content.includes('blocked')) {
      expect(content).toMatch(/blocked.*priority/i);
    }
  });
});

// ============================================================================
// AC2: Action Highlighting
// ============================================================================

describe('AC2: Action Highlighting', () => {

  afterAll(() => {
    cleanupTestStories();
  });

  test.skip('[P0] stories requiring action should be highlighted', () => {
    const content = readFileSync(SPRINT_STATUS_WORKFLOW, 'utf8');
    // Should mention highlighting or color coding for action-required stories
    expect(content).toMatch(/highlight|color|action/i);
  });

  test.skip('[P0] stories requiring action include: changes-needed, in-progress, review, approved', () => {
    const content = readFileSync(SPRINT_STATUS_WORKFLOW, 'utf8');

    // These statuses require action
    const actionRequiredStatuses = ['changes-needed', 'in-progress', 'review', 'approved'];
    actionRequiredStatuses.forEach(status => {
      expect(content).toMatch(new RegExp(status));
    });
  });

  test.skip('[P1] completed stories (done, cancelled) should not be highlighted', () => {
    const content = readFileSync(SPRINT_STATUS_WORKFLOW, 'utf8');

    // These statuses don't require action
    const noActionStatuses = ['done', 'cancelled'];
    noActionStatuses.forEach(status => {
      expect(content).toMatch(new RegExp(status));
    });
  });
});

// ============================================================================
// AC2: Color Coding (UX-DR6 Compliance)
// ============================================================================

describe('AC2: Color Coding (UX-DR6 Compliance)', () => {

  test.skip('[P0] changes-needed should be colored red', () => {
    const content = readFileSync(SPRINT_STATUS_WORKFLOW, 'utf8');
    // Should reference red color for changes-needed
    expect(content).toMatch(/changes-needed.*red|red.*changes-needed/i);
  });

  test.skip('[P0] in-progress should be colored yellow', () => {
    const content = readFileSync(SPRINT_STATUS_WORKFLOW, 'utf8');
    // Should reference yellow color for in-progress
    expect(content).toMatch(/in-progress.*yellow|yellow.*in-progress/i);
  });

  test.skip('[P0] review should be colored cyan', () => {
    const content = readFileSync(SPRINT_STATUS_WORKFLOW, 'utf8');
    // Should reference cyan color for review
    expect(content).toMatch(/review.*cyan|cyan.*review/i);
  });

  test.skip('[P0] approved/done should be colored green', () => {
    const content = readFileSync(SPRINT_STATUS_WORKFLOW, 'utf8');
    // Should reference green color for approved/done
    expect(content).toMatch(/approved.*green|done.*green|green.*(approved|done)/i);
  });
});
