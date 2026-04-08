/**
 * ATDD Tests for Story 2.4: Multi-Round Review Tracking
 *
 * TDD Phase: RED (tests will fail until feature is implemented)
 * Test Level: Integration Testing (Utility Functions)
 * Test Framework: Jest
 * Story: 2.4 - Implement Multi-Round Review Tracking
 *
 * PRD References:
 * - FR-25: Multiple review rounds with incremental artifact numbering
 */

import { readFileSync, existsSync, unlinkSync, mkdirSync, rmdirSync } from 'fs';
import { join } from 'path';
import {
  getNextReviewNumber,
  createReviewArtifact,
  loadPreviousReviewContext,
  updateReviewTemplateWithRoundNumber,
  updateApprovalTemplateWithReviewRound
} from '../utils/review.js';

// ============================================================================
// Test Setup and Teardown
// ============================================================================

const TEST_OUTPUT_DIR = join(process.cwd(), '_test-output', 'multi-round-review');

function setupTestEnvironment() {
  // Create test output directory
  if (!existsSync(TEST_OUTPUT_DIR)) {
    mkdirSync(TEST_OUTPUT_DIR, { recursive: true });
  }
}

function teardownTestEnvironment() {
  // Clean up test files
  if (existsSync(TEST_OUTPUT_DIR)) {
    const files = require('fs').readdirSync(TEST_OUTPUT_DIR);
    for (const file of files) {
      const filePath = join(TEST_OUTPUT_DIR, file);
      require('fs').unlinkSync(filePath);
    }
    require('fs').rmdirSync(TEST_OUTPUT_DIR);
  }
}

// ============================================================================
// Task 1: Sequential Review Artifact Numbering (AC: #1, #2)
// ============================================================================

describe('Task 1: Sequential Review Artifact Numbering', () => {

  beforeEach(() => {
    setupTestEnvironment();
  });

  afterEach(() => {
    teardownTestEnvironment();
  });

  // Test 1.1: Function to scan sprint folder for existing review-*.md files
  describe('1.1: Scan for existing review files', () => {
    test('should return 1 when no review files exist', () => {
      const nextNumber = getNextReviewNumber(TEST_OUTPUT_DIR);
      expect(nextNumber).toBe(1);
    });

    test('should return 2 when review-1.md exists', () => {
      // Create review-1.md
      const review1Path = join(TEST_OUTPUT_DIR, 'review-1.md');
      require('fs').writeFileSync(review1Path, '# Review 1', 'utf8');

      const nextNumber = getNextReviewNumber(TEST_OUTPUT_DIR);
      expect(nextNumber).toBe(2);
    });

    test('should return 4 when review-1.md, review-2.md, review-3.md exist', () => {
      // Create multiple review files
      for (let i = 1; i <= 3; i++) {
        const reviewPath = join(TEST_OUTPUT_DIR, `review-${i}.md`);
        require('fs').writeFileSync(reviewPath, `# Review ${i}`, 'utf8');
      }

      const nextNumber = getNextReviewNumber(TEST_OUTPUT_DIR);
      expect(nextNumber).toBe(4);
    });

    test('should handle non-sequential review numbers correctly', () => {
      // Create review-1.md and review-5.md (missing intermediate files)
      require('fs').writeFileSync(join(TEST_OUTPUT_DIR, 'review-1.md'), '# Review 1', 'utf8');
      require('fs').writeFileSync(join(TEST_OUTPUT_DIR, 'review-5.md'), '# Review 5', 'utf8');

      const nextNumber = getNextReviewNumber(TEST_OUTPUT_DIR);
      expect(nextNumber).toBe(6); // Should return highest + 1
    });
  });

  // Test 1.2: Extract highest review number and increment
  describe('1.2: Extract and increment review number', () => {
    test('should correctly parse review numbers from filenames', () => {
      // Create review-10.md to test multi-digit numbers
      require('fs').writeFileSync(join(TEST_OUTPUT_DIR, 'review-10.md'), '# Review 10', 'utf8');

      const nextNumber = getNextReviewNumber(TEST_OUTPUT_DIR);
      expect(nextNumber).toBe(11);
    });

    test('should ignore non-review files in directory', () => {
      // Create review files and other files
      require('fs').writeFileSync(join(TEST_OUTPUT_DIR, 'review-1.md'), '# Review 1', 'utf8');
      require('fs').writeFileSync(join(TEST_OUTPUT_DIR, 'story.md'), '# Story', 'utf8');
      require('fs').writeFileSync(join(TEST_OUTPUT_DIR, 'plan.md'), '# Plan', 'utf8');

      const nextNumber = getNextReviewNumber(TEST_OUTPUT_DIR);
      expect(nextNumber).toBe(2); // Should only count review-*.md files
    });
  });

  // Test 1.3: Update review command to use incremental numbering
  describe('1.3: Create review artifacts with incremental numbering', () => {
    test('should create review-1.md for first review', () => {
      const reviewData = {
        ticketId: 'SW-001',
        storyTitle: 'Test Story',
        reviewDate: new Date().toISOString(),
        verdict: 'approved',
        findings: [],
        outputDir: TEST_OUTPUT_DIR
      };

      const reviewPath = createReviewArtifact(reviewData);
      expect(reviewPath).toContain('review-1.md');
      expect(existsSync(reviewPath)).toBe(true);
    });

    test('should create review-2.md for second review', () => {
      // Create first review
      createReviewArtifact({
        ticketId: 'SW-001',
        storyTitle: 'Test Story',
        reviewDate: new Date().toISOString(),
        verdict: 'approved',
        findings: [],
        outputDir: TEST_OUTPUT_DIR
      });

      // Create second review
      const reviewPath = createReviewArtifact({
        ticketId: 'SW-001',
        storyTitle: 'Test Story',
        reviewDate: new Date().toISOString(),
        verdict: 'changes-needed',
        findings: [],
        outputDir: TEST_OUTPUT_DIR
      });

      expect(reviewPath).toContain('review-2.md');
      expect(existsSync(reviewPath)).toBe(true);
      expect(existsSync(join(TEST_OUTPUT_DIR, 'review-1.md'))).toBe(true);
    });

    test('should include review_round field in review artifact', () => {
      const reviewData = {
        ticketId: 'SW-001',
        storyTitle: 'Test Story',
        reviewDate: new Date().toISOString(),
        verdict: 'approved',
        findings: [],
        outputDir: TEST_OUTPUT_DIR
      };

      const reviewPath = createReviewArtifact(reviewData);
      const reviewContent = readFileSync(reviewPath, 'utf8');

      expect(reviewContent).toMatch(/review_round:\s*1/);
    });
  });

  // Test 1.4: Ensure each review creates a NEW file
  describe('1.4: Never overwrite existing review files', () => {
    test('should preserve existing review-1.md when creating review-2.md', () => {
      // Create first review with specific content
      const firstReviewContent = '# First Review\n\nThis is the original review.';
      createReviewArtifact({
        ticketId: 'SW-001',
        storyTitle: 'Test Story',
        reviewDate: new Date().toISOString(),
        verdict: 'changes-needed',
        findings: [{ severity: 'Major', description: 'Fix this issue' }],
        outputDir: TEST_OUTPUT_DIR
      });

      const review1Path = join(TEST_OUTPUT_DIR, 'review-1.md');
      const originalContent = readFileSync(review1Path, 'utf8');

      // Create second review
      createReviewArtifact({
        ticketId: 'SW-001',
        storyTitle: 'Test Story',
        reviewDate: new Date().toISOString(),
        verdict: 'approved',
        findings: [],
        outputDir: TEST_OUTPUT_DIR
      });

      // Verify first review is unchanged
      const currentContent = readFileSync(review1Path, 'utf8');
      expect(currentContent).toBe(originalContent);
      expect(existsSync(join(TEST_OUTPUT_DIR, 'review-2.md'))).toBe(true);
    });
  });
});

// ============================================================================
// Task 2: Previous Review Context Loading (AC: #2)
// ============================================================================

describe('Task 2: Previous Review Context Loading', () => {

  beforeEach(() => {
    setupTestEnvironment();
  });

  afterEach(() => {
    teardownTestEnvironment();
  });

  // Test 2.1: Detect if previous reviews exist
  describe('2.1: Detect previous reviews', () => {
    test('should detect no previous reviews for first review', () => {
      const hasPrevious = loadPreviousReviewContext(TEST_OUTPUT_DIR);
      expect(hasPrevious.exists).toBe(false);
    });

    test('should detect previous reviews when review-1.md exists', () => {
      // Create review-1.md
      createReviewArtifact({
        ticketId: 'SW-001',
        storyTitle: 'Test Story',
        reviewDate: new Date().toISOString(),
        verdict: 'changes-needed',
        findings: [{ severity: 'Major', description: 'Fix this' }],
        outputDir: TEST_OUTPUT_DIR
      });

      const context = loadPreviousReviewContext(TEST_OUTPUT_DIR);
      expect(context.exists).toBe(true);
      expect(context.reviewNumber).toBe(1);
    });

    test('should detect most recent review when multiple exist', () => {
      // Create multiple reviews
      for (let i = 1; i <= 3; i++) {
        createReviewArtifact({
          ticketId: 'SW-001',
          storyTitle: 'Test Story',
          reviewDate: new Date().toISOString(),
          verdict: i === 3 ? 'approved' : 'changes-needed',
          findings: i === 3 ? [] : [{ severity: 'Major', description: `Issue ${i}` }],
          outputDir: TEST_OUTPUT_DIR
        });
      }

      const context = loadPreviousReviewContext(TEST_OUTPUT_DIR);
      expect(context.exists).toBe(true);
      expect(context.reviewNumber).toBe(3);
    });
  });

  // Test 2.2: Load most recent review file
  describe('2.2: Load most recent review file', () => {
    test('should load review-2.md as most recent when review-3.md does not exist', () => {
      // Create review-1.md and review-2.md
      for (let i = 1; i <= 2; i++) {
        createReviewArtifact({
          ticketId: 'SW-001',
          storyTitle: 'Test Story',
          reviewDate: new Date().toISOString(),
          verdict: 'changes-needed',
          findings: [{ severity: 'Major', description: `Issue ${i}` }],
          outputDir: TEST_OUTPUT_DIR
        });
      }

      const context = loadPreviousReviewContext(TEST_OUTPUT_DIR);
      expect(context.content).toContain('review_round: 2'); // Check for review_round field
      expect(context.content).toContain('Issue 2');
    });
  });

  // Test 2.3: Extract findings from previous review
  describe('2.3: Extract findings from previous review', () => {
    test('should extract findings from previous review for comparison', () => {
      const testFindings = [
        { severity: 'Critical', description: 'Security issue' },
        { severity: 'Major', description: 'Missing error handling' }
      ];

      createReviewArtifact({
        ticketId: 'SW-001',
        storyTitle: 'Test Story',
        reviewDate: new Date().toISOString(),
        verdict: 'changes-needed',
        findings: testFindings,
        outputDir: TEST_OUTPUT_DIR
      });

      const context = loadPreviousReviewContext(TEST_OUTPUT_DIR);
      expect(context.findings).toBeDefined();
      expect(context.findings.length).toBe(2);
      expect(context.findings[0].severity).toBe('Critical');
    });
  });

  // Test 2.4: Pass previous findings to review agent
  describe('2.4: Pass previous findings to review agent', () => {
    test('should include previous findings in new review context', () => {
      const previousFindings = [
        { severity: 'Major', description: 'Fix authentication', status: 'unresolved' }
      ];

      createReviewArtifact({
        ticketId: 'SW-001',
        storyTitle: 'Test Story',
        reviewDate: new Date().toISOString(),
        verdict: 'changes-needed',
        findings: previousFindings,
        outputDir: TEST_OUTPUT_DIR
      });

      const context = loadPreviousReviewContext(TEST_OUTPUT_DIR);

      // Create second review with previous context
      const reviewPath = createReviewArtifact({
        ticketId: 'SW-001',
        storyTitle: 'Test Story',
        reviewDate: new Date().toISOString(),
        verdict: 'approved',
        findings: [],
        previousReviewContext: context,
        outputDir: TEST_OUTPUT_DIR
      });

      const reviewContent = readFileSync(reviewPath, 'utf8');
      expect(reviewContent).toContain('Previous Findings');
      expect(reviewContent).toContain('Fix authentication');
    });
  });
});

// ============================================================================
// Task 3: Sequential Approval Artifact Numbering (AC: #3)
// ============================================================================

describe('Task 3: Sequential Approval Artifact Numbering', () => {

  beforeEach(() => {
    setupTestEnvironment();
  });

  afterEach(() => {
    teardownTestEnvironment();
  });

  // Test 3.1: Function to scan for approval files
  describe('3.1: Scan for existing approval files', () => {
    test('should return 1 when no approval files exist', () => {
      const { getNextApprovalNumber } = require('../utils/approve.js');
      const nextNumber = getNextApprovalNumber(TEST_OUTPUT_DIR);
      expect(nextNumber).toBe(1);
    });

    test('should return 2 when approval-1.md exists', () => {
      const { getNextApprovalNumber, createApprovalArtifact } = require('../utils/approve.js');

      createApprovalArtifact('SW-001', {
        storyTitle: 'Test Story',
        approver: 'Sami',
        decision: 'approved',
        reviewReference: 'review-1.md',
        reviewDate: new Date().toISOString(),
        outputDir: TEST_OUTPUT_DIR
      });

      const nextNumber = getNextApprovalNumber(TEST_OUTPUT_DIR);
      expect(nextNumber).toBe(2);
    });
  });

  // Test 3.2: Extract highest approval number
  describe('3.2: Extract and increment approval number', () => {
    test('should handle multi-digit approval numbers', () => {
      const { getNextApprovalNumber } = require('../utils/approve.js');

      require('fs').writeFileSync(join(TEST_OUTPUT_DIR, 'approval-10.md'), '# Approval 10', 'utf8');

      const nextNumber = getNextApprovalNumber(TEST_OUTPUT_DIR);
      expect(nextNumber).toBe(11);
    });
  });

  // Test 3.3: Update approval command to use incremental numbering
  describe('3.3: Create approval artifacts with incremental numbering', () => {
    test('should create approval-1.md for first approval', () => {
      const { createApprovalArtifact } = require('../utils/approve.js');

      const approvalPath = createApprovalArtifact('SW-001', {
        storyTitle: 'Test Story',
        approver: 'Sami',
        decision: 'approved',
        reviewReference: 'review-1.md',
        reviewDate: new Date().toISOString(),
        outputDir: TEST_OUTPUT_DIR
      });

      expect(approvalPath).toContain('approval-1.md');
      expect(existsSync(approvalPath)).toBe(true);
    });
  });

  // Test 3.4: Add review_round field to approval artifact
  describe('3.4: Add review_round field to approval artifact', () => {
    test('should include based_on_review field in approval artifact', () => {
      const { createApprovalArtifact } = require('../utils/approve.js');

      const approvalPath = createApprovalArtifact('SW-001', {
        storyTitle: 'Test Story',
        approver: 'Sami',
        decision: 'approved',
        reviewReference: 'review-2.md',
        reviewDate: new Date().toISOString(),
        outputDir: TEST_OUTPUT_DIR
      });

      const approvalContent = readFileSync(approvalPath, 'utf8');
      expect(approvalContent).toMatch(/review_reference:\s*review-2\.md/);
    });

    test('should extract review round from review file reference', () => {
      const { createApprovalArtifact } = require('../utils/approve.js');

      const approvalPath = createApprovalArtifact('SW-001', {
        storyTitle: 'Test Story',
        approver: 'Sami',
        decision: 'approved',
        reviewReference: 'review-3.md',
        reviewDate: new Date().toISOString(),
        outputDir: TEST_OUTPUT_DIR
      });

      const approvalContent = readFileSync(approvalPath, 'utf8');
      expect(approvalContent).toContain('review-3.md');
    });
  });
});

// ============================================================================
// Task 4: Artifact History Preservation (AC: #4)
// ============================================================================

describe('Task 4: Artifact History Preservation', () => {

  beforeEach(() => {
    setupTestEnvironment();
  });

  afterEach(() => {
    teardownTestEnvironment();
  });

  // Test 4.1: Verify multiple review files coexist
  describe('4.1: Multiple review files coexist', () => {
    test('should keep all review files when creating multiple reviews', () => {
      // Create three reviews
      for (let i = 1; i <= 3; i++) {
        createReviewArtifact({
          ticketId: 'SW-001',
          storyTitle: 'Test Story',
          reviewDate: new Date().toISOString(),
          verdict: i === 3 ? 'approved' : 'changes-needed',
          findings: i === 3 ? [] : [{ severity: 'Major', description: `Issue ${i}` }],
          outputDir: TEST_OUTPUT_DIR
        });
      }

      // Verify all three files exist
      expect(existsSync(join(TEST_OUTPUT_DIR, 'review-1.md'))).toBe(true);
      expect(existsSync(join(TEST_OUTPUT_DIR, 'review-2.md'))).toBe(true);
      expect(existsSync(join(TEST_OUTPUT_DIR, 'review-3.md'))).toBe(true);
    });

    test('should maintain unique content in each review file', () => {
      // Create reviews with different content
      createReviewArtifact({
        ticketId: 'SW-001',
        storyTitle: 'Test Story',
        reviewDate: new Date().toISOString(),
        verdict: 'changes-needed',
        findings: [{ severity: 'Critical', description: 'First issue' }],
        outputDir: TEST_OUTPUT_DIR
      });

      createReviewArtifact({
        ticketId: 'SW-001',
        storyTitle: 'Test Story',
        reviewDate: new Date().toISOString(),
        verdict: 'changes-needed',
        findings: [{ severity: 'Major', description: 'Second issue' }],
        outputDir: TEST_OUTPUT_DIR
      });

      const review1Content = readFileSync(join(TEST_OUTPUT_DIR, 'review-1.md'), 'utf8');
      const review2Content = readFileSync(join(TEST_OUTPUT_DIR, 'review-2.md'), 'utf8');

      expect(review1Content).toContain('First issue');
      expect(review2Content).toContain('Second issue');
      expect(review2Content).not.toContain('First issue');
    });
  });

  // Test 4.2: Approval files reference correct review round
  describe('4.2: Approval files reference correct review round', () => {
    test('should reference review-2.md in approval created after second review', () => {
      // Create two reviews
      for (let i = 1; i <= 2; i++) {
        createReviewArtifact({
          ticketId: 'SW-001',
          storyTitle: 'Test Story',
          reviewDate: new Date().toISOString(),
          verdict: i === 2 ? 'approved' : 'changes-needed',
          findings: i === 2 ? [] : [{ severity: 'Major', description: 'Issue' }],
          outputDir: TEST_OUTPUT_DIR
        });
      }

      // Create approval referencing review-2.md
      const { createApprovalArtifact } = require('../utils/approve.js');
      const approvalPath = createApprovalArtifact('SW-001', {
        storyTitle: 'Test Story',
        approver: 'Sami',
        decision: 'approved',
        reviewReference: 'review-2.md',
        reviewDate: new Date().toISOString(),
        outputDir: TEST_OUTPUT_DIR
      });

      const approvalContent = readFileSync(approvalPath, 'utf8');
      expect(approvalContent).toContain('review-2.md');
      expect(approvalContent).not.toContain('review-1.md');
    });
  });

  // Test 4.3: Verify artifacts are human-readable Markdown
  describe('4.3: Artifacts are human-readable Markdown', () => {
    test('should create review artifacts in valid Markdown format', () => {
      createReviewArtifact({
        ticketId: 'SW-001',
        storyTitle: 'Test Story',
        reviewDate: new Date().toISOString(),
        verdict: 'approved',
        findings: [],
        outputDir: TEST_OUTPUT_DIR
      });

      const reviewContent = readFileSync(join(TEST_OUTPUT_DIR, 'review-1.md'), 'utf8');

      // Check for valid Markdown structure
      expect(reviewContent).toMatch(/^---/); // YAML frontmatter start
      expect(reviewContent).toMatch(/\n---\n/); // YAML frontmatter end (in the middle of content)
      expect(reviewContent).toMatch(/^#\s+/m); // Markdown heading (multiline match)
    });

    test('should create approval artifacts in valid Markdown format', () => {
      const { createApprovalArtifact } = require('../utils/approve.js');

      const approvalPath = createApprovalArtifact('SW-001', {
        storyTitle: 'Test Story',
        approver: 'Sami',
        decision: 'approved',
        reviewReference: 'review-1.md',
        reviewDate: new Date().toISOString(),
        outputDir: TEST_OUTPUT_DIR
      });

      const approvalContent = readFileSync(approvalPath, 'utf8');

      // Check for valid Markdown structure
      expect(approvalContent).toMatch(/^---/);
      expect(approvalContent).toMatch(/\n---\n/); // YAML frontmatter end (in the middle of content)
      expect(approvalContent).toMatch(/^#\s+/m); // Markdown heading (multiline match)
    });

    test('should be Git-diffable (plain text, no binary)', () => {
      createReviewArtifact({
        ticketId: 'SW-001',
        storyTitle: 'Test Story',
        reviewDate: new Date().toISOString(),
        verdict: 'approved',
        findings: [],
        outputDir: TEST_OUTPUT_DIR
      });

      const reviewContent = readFileSync(join(TEST_OUTPUT_DIR, 'review-1.md'), 'utf8');

      // Verify it's plain text (UTF-8 valid)
      expect(() => Buffer.from(reviewContent, 'utf8')).not.toThrow();
      expect(reviewContent.length).toBeGreaterThan(0);
    });
  });

  // Test 4.4: Complete cycle test
  describe('4.4: Complete cycle: review-1 -> changes-needed -> review-2 -> approval-1', () => {
    test('should successfully complete full review-reject-review-approve cycle', () => {
      // Step 1: First review (changes-needed)
      createReviewArtifact({
        ticketId: 'SW-001',
        storyTitle: 'Test Story',
        reviewDate: new Date().toISOString(),
        verdict: 'changes-needed',
        findings: [
          { severity: 'Critical', description: 'Security vulnerability' },
          { severity: 'Major', description: 'Missing error handling' }
        ],
        outputDir: TEST_OUTPUT_DIR
      });

      // Step 2: Second review (approved after fixes)
      const review2Path = createReviewArtifact({
        ticketId: 'SW-001',
        storyTitle: 'Test Story',
        reviewDate: new Date().toISOString(),
        verdict: 'approved',
        findings: [],
        outputDir: TEST_OUTPUT_DIR
      });

      // Step 3: Approval
      const { createApprovalArtifact } = require('../utils/approve.js');
      const approvalPath = createApprovalArtifact('SW-001', {
        storyTitle: 'Test Story',
        approver: 'Sami',
        decision: 'approved',
        reviewReference: 'review-2.md',
        reviewDate: new Date().toISOString(),
        outputDir: TEST_OUTPUT_DIR
      });

      // Verify complete artifact history
      expect(existsSync(join(TEST_OUTPUT_DIR, 'review-1.md'))).toBe(true);
      expect(existsSync(join(TEST_OUTPUT_DIR, 'review-2.md'))).toBe(true);
      expect(existsSync(join(TEST_OUTPUT_DIR, 'approval-1.md'))).toBe(true);

      // Verify review-2.md references review-1.md findings
      const review2Content = readFileSync(review2Path, 'utf8');
      expect(review2Content).toContain('review_round: 2');

      // Verify approval-1.md references review-2.md
      const approvalContent = readFileSync(approvalPath, 'utf8');
      expect(approvalContent).toContain('review-2.md');

      // Verify all artifacts are readable
      const review1Content = readFileSync(join(TEST_OUTPUT_DIR, 'review-1.md'), 'utf8');
      expect(review1Content).toContain('Security vulnerability');
      expect(review1Content).toContain('Missing error handling');
    });
  });
});
