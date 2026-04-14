import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { executeScrumReview } from '../../utils/review.js';
import { executeScrumApprove } from '../../utils/approve.js';
import { createTemporarySprintDir, cleanupTemporarySprintDir } from '../fixtures/sprint.fixture.ts';

const TICKET_ID = 'SW-TEST-YAML';

describe('YAML Parsing and Status History Preservation', () => {
  let testOutputDir: string;
  let storyPath: string;

  beforeEach(() => {
    testOutputDir = createTemporarySprintDir(TICKET_ID);
    storyPath = join(testOutputDir, 'story.md');
    
    // Create initial story with some history
    const initialStory = `---
schema_version: 1
ticket: ${TICKET_ID}
title: "Test YAML Preservation"
status: "review"
updated: "2026-04-01T12:00:00Z"
status_history:
  - from: "in-progress"
    to: "review"
    timestamp: "2026-04-01T12:00:00Z"
    trigger: "/scrum-dev-story"
    actor: "agent"
---

# Story Content
`;
    writeFileSync(storyPath, initialStory, 'utf8');
    
    // Create a dummy review-1.md for approval test
    const review1Path = join(testOutputDir, 'review-1.md');
    writeFileSync(review1Path, '---\nreview_date: 2026-04-01T12:00:00Z\n---\n# Review 1', 'utf8');
  });

  afterEach(() => {
    cleanupTemporarySprintDir(TICKET_ID);
  });

  test('executeScrumReview should preserve existing status_history', () => {
    const options = {
      findings: [],
      reviewer: 'test-agent',
      storyPath: storyPath,
      projectRoot: process.cwd()
    };

    const result = executeScrumReview(TICKET_ID, options);
    if (!result.success) console.log('executeScrumReview Error:', result.error);
    expect(result.success).toBe(true);

    const updatedStory = readFileSync(storyPath, 'utf8');
    
    // Check if both the original and the new history entries exist
    expect(updatedStory).toContain('from: "in-progress"');
    expect(updatedStory).toContain('to: "review"');
    expect(updatedStory).toContain('trigger: "/scrum-dev-story"');
    
    expect(updatedStory).toContain('from: "review"');
    expect(updatedStory).toContain('to: "approved"');
    expect(updatedStory).toContain('trigger: "/scrum-review-story"');
  });

  test('executeScrumApprove should preserve existing status_history', () => {
    // First, set story to approved status
    const approvedStory = `---
schema_version: 1
ticket: ${TICKET_ID}
title: "Test YAML Preservation"
status: "approved"
updated: "2026-04-01T12:00:00Z"
status_history:
  - from: "in-progress"
    to: "review"
    timestamp: "2026-04-01T12:00:00Z"
    trigger: "/scrum-dev-story"
    actor: "agent"
  - from: "review"
    to: "approved"
    timestamp: "2026-04-01T12:10:00Z"
    trigger: "/scrum-review-story"
    actor: "agent"
---

# Story Content
`;
    writeFileSync(storyPath, approvedStory, 'utf8');

    const options = {
      approver: 'Sami',
      reasoning: 'Good work',
      reviewReference: 'review-1.md',
      storyPath: storyPath,
      projectRoot: process.cwd()
    };

    const result = executeScrumApprove(TICKET_ID, options);
    expect(result.success).toBe(true);

    const updatedStory = readFileSync(storyPath, 'utf8');
    
    // Check if the whole history chain is preserved
    expect(updatedStory).toContain('from: "in-progress"');
    expect(updatedStory).toContain('to: "review"');
    expect(updatedStory).toContain('from: "review"');
    expect(updatedStory).toContain('to: "approved"');
    expect(updatedStory).toContain('from: "approved"');
    expect(updatedStory).toContain('to: "done"');
  });
});
