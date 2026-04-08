import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  getNextReviewNumber,
  createReviewArtifact,
  loadPreviousReviewContext
} from '../../utils/review.js';
import { getNextApprovalNumber, createApprovalArtifact } from '../../utils/approve.js';
import { createTemporarySprintDir, cleanupTemporarySprintDir } from '../fixtures/sprint.fixture.ts';

const TICKET_ID = 'SW-TEST-2.4';

describe('Multi-Round Review Tracking (Story 2.4)', () => {
  let testOutputDir: string;

  beforeEach(() => {
    testOutputDir = createTemporarySprintDir(TICKET_ID);
  });

  afterEach(() => {
    cleanupTemporarySprintDir(TICKET_ID);
  });

  describe('AC 1: Incremental Review Artifact Numbering', () => {
    test('Scenario 1.1: should return 1 when no review files exist', () => {
      const nextNumber = getNextReviewNumber(testOutputDir);
      expect(nextNumber).toBe(1);
    });

    test('Scenario 1.2: should create review-1.md for first review', () => {
      const reviewData = {
        ticketId: TICKET_ID,
        storyTitle: 'Test Story',
        reviewDate: new Date().toISOString(),
        verdict: 'approved',
        findings: [],
        outputDir: testOutputDir
      };

      const reviewPath = createReviewArtifact(reviewData);
      expect(reviewPath).toContain('review-1.md');
      expect(existsSync(reviewPath)).toBe(true);
    });

    test('Scenario 1.2: should create review-2.md for second review', () => {
      // First review
      createReviewArtifact({
        ticketId: TICKET_ID,
        storyTitle: 'Test Story',
        reviewDate: new Date().toISOString(),
        verdict: 'changes-needed',
        findings: [{ severity: 'Major', description: 'Fix this' }],
        outputDir: testOutputDir
      });

      // Second review
      const reviewPath = createReviewArtifact({
        ticketId: TICKET_ID,
        storyTitle: 'Test Story',
        reviewDate: new Date().toISOString(),
        verdict: 'approved',
        findings: [],
        outputDir: testOutputDir
      });

      expect(reviewPath).toContain('review-2.md');
      expect(existsSync(join(testOutputDir, 'review-1.md'))).toBe(true);
      expect(existsSync(join(testOutputDir, 'review-2.md'))).toBe(true);
    });

    test('should handle multi-digit review numbers', () => {
      writeFileSync(join(testOutputDir, 'review-10.md'), '# Review 10', 'utf8');
      const nextNumber = getNextReviewNumber(testOutputDir);
      expect(nextNumber).toBe(11);
    });

    test('should ignore non-review files', () => {
      writeFileSync(join(testOutputDir, 'review-1.md'), '# Review 1', 'utf8');
      writeFileSync(join(testOutputDir, 'other.md'), '# Other', 'utf8');
      const nextNumber = getNextReviewNumber(testOutputDir);
      expect(nextNumber).toBe(2);
    });
  });

  describe('AC 2: Non-destructive History & Context Access', () => {
    test('Scenario 2.1: should preserve existing review-1.md when creating review-2.md', () => {
      const firstReviewPath = createReviewArtifact({
        ticketId: TICKET_ID,
        storyTitle: 'Test Story',
        reviewDate: new Date().toISOString(),
        verdict: 'changes-needed',
        findings: [{ severity: 'Major', description: 'Original issue' }],
        outputDir: testOutputDir
      });

      const originalContent = readFileSync(firstReviewPath, 'utf8');

      createReviewArtifact({
        ticketId: TICKET_ID,
        storyTitle: 'Test Story',
        reviewDate: new Date().toISOString(),
        verdict: 'approved',
        findings: [],
        outputDir: testOutputDir
      });

      const preservedContent = readFileSync(firstReviewPath, 'utf8');
      expect(preservedContent).toBe(originalContent);
    });

    test('Scenario 2.2: should provide previous review findings as context', () => {
      createReviewArtifact({
        ticketId: TICKET_ID,
        storyTitle: 'Test Story',
        reviewDate: new Date().toISOString(),
        verdict: 'changes-needed',
        findings: [{ severity: 'Major', description: 'Previous issue' }],
        outputDir: testOutputDir
      });

      const context = loadPreviousReviewContext(testOutputDir);
      expect(context.exists).toBe(true);
      expect(context.reviewNumber).toBe(1);
      expect(context.findings[0].description).toBe('Previous issue');

      const secondReviewPath = createReviewArtifact({
        ticketId: TICKET_ID,
        storyTitle: 'Test Story',
        reviewDate: new Date().toISOString(),
        verdict: 'approved',
        findings: [],
        previousReviewContext: context,
        outputDir: testOutputDir
      });

      const content = readFileSync(secondReviewPath, 'utf8');
      expect(content).toContain('Previous issue');
      expect(content).toContain('review-1');
    });
  });

  describe('AC 3: Incremental Approval Numbering & Referencing', () => {
    test('Scenario 3.1: should create approval-1.md for first approval', () => {
      const approvalPath = createApprovalArtifact(TICKET_ID, {
        storyTitle: 'Test Story',
        approver: 'Sami',
        decision: 'approved',
        reviewReference: 'review-1.md',
        reviewDate: new Date().toISOString(),
        outputDir: testOutputDir
      });

      expect(approvalPath).toContain('approval-1.md');
      expect(existsSync(approvalPath)).toBe(true);
    });

    test('Scenario 3.2: should include based_on_review field in approval artifact', () => {
      const approvalPath = createApprovalArtifact(TICKET_ID, {
        storyTitle: 'Test Story',
        approver: 'Sami',
        decision: 'approved',
        reviewReference: 'review-2.md',
        reviewDate: new Date().toISOString(),
        outputDir: testOutputDir
      });

      const content = readFileSync(approvalPath, 'utf8');
      expect(content).toContain('based_on_review: 2');
      expect(content).toContain('review_reference: review-2.md');
    });

    test('should handle multi-digit approval numbers', () => {
      writeFileSync(join(testOutputDir, 'approval-5.md'), '# Approval 5', 'utf8');
      const nextNumber = getNextApprovalNumber(testOutputDir);
      expect(nextNumber).toBe(6);
    });
  });

  describe('AC 4: Complete Cycle Verification', () => {
    test('should complete full cycle: review-1 -> review-2 -> approval-1', () => {
      // 1. First review
      createReviewArtifact({
        ticketId: TICKET_ID,
        storyTitle: 'Test Story',
        reviewDate: new Date().toISOString(),
        verdict: 'changes-needed',
        findings: [{ severity: 'Major', description: 'Issue 1' }],
        outputDir: testOutputDir
      });

      // 2. Second review
      const context = loadPreviousReviewContext(testOutputDir);
      const review2Path = createReviewArtifact({
        ticketId: TICKET_ID,
        storyTitle: 'Test Story',
        reviewDate: new Date().toISOString(),
        verdict: 'approved',
        findings: [],
        previousReviewContext: context,
        outputDir: testOutputDir
      });

      // 3. Approval
      const approvalPath = createApprovalArtifact(TICKET_ID, {
        storyTitle: 'Test Story',
        approver: 'Sami',
        decision: 'approved',
        reviewReference: 'review-2.md',
        reviewDate: new Date().toISOString(),
        outputDir: testOutputDir
      });

      expect(existsSync(join(testOutputDir, 'review-1.md'))).toBe(true);
      expect(existsSync(join(testOutputDir, 'review-2.md'))).toBe(true);
      expect(existsSync(join(testOutputDir, 'approval-1.md'))).toBe(true);

      const review2Content = readFileSync(review2Path, 'utf8');
      expect(review2Content).toContain('review_round: 2');
      expect(review2Content).toContain('Issue 1');

      const approvalContent = readFileSync(approvalPath, 'utf8');
      expect(approvalContent).toContain('based_on_review: 2');
    });
  });
});
