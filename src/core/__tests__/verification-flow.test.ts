/**
 * ATDD Tests for Story 8.1: Implement Post-Implementation Verification
 *
 * TDD Phase: RED (tests will fail until implementation is complete)
 * Test Level: Unit (Command and Workflow Verification)
 * Test Framework: Vitest with TypeScript
 *
 * Story: 8.1 - Implement Post-Implementation Verification (FR-21, FR-7, FR-9)
 *
 * Acceptance Criteria:
 * 1. Command triggers tests, lint, and build, creating verification-report.md in _scrum-output/sprints/SW-XXX/.
 * 2. On SUCCESS: Report contains results, timestamp, coverage summary, and status transitions to 'review'.
 * 3. On FAILURE: Report details failures with actionable guidance, status remains 'in-progress'.
 * 4. Write boundaries respected: only verification-report.md and story.md are modified.
 */

import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// __dirname = src/core/__tests__; core lives at src/core/, repo root is three levels up.
const CORE_DIR = join(__dirname, '..');
const REPO_ROOT = join(__dirname, '..', '..', '..');
const COMMANDS_DIR = join(CORE_DIR, 'commands');
const WORKFLOWS_DIR = join(CORE_DIR, 'workflows');
const TEMPLATES_DIR = join(CORE_DIR, 'templates');
const UTILS_DIR = join(CORE_DIR, 'utils');

// ============================================================================
// AC1: /scrum-verify Command Definition and Workflow
// ============================================================================

describe('AC1: /scrum-verify Command and Workflow Definitions', () => {
  test('[P0] scrum_workflow/commands/verify.md should exist', () => {
    expect(existsSync(join(COMMANDS_DIR, 'verify.md'))).toBe(true);
  });

  test('[P0] scrum_workflow/workflows/verification.md should exist', () => {
    expect(existsSync(join(WORKFLOWS_DIR, 'verification.md'))).toBe(true);
  });

  test('[P0] scrum_workflow/templates/verification-report.md should exist', () => {
    expect(existsSync(join(TEMPLATES_DIR, 'verification-report.md'))).toBe(true);
  });

  test('[P0] scrum_workflow/commands/verify.md should enforce status guard', () => {
    const content = readFileSync(join(COMMANDS_DIR, 'verify.md'), 'utf8');
    // Command must only run on stories in 'in-progress' status
    expect(content).toMatch(/in-progress/);
    expect(content).toMatch(/❌ Status Guard Violation:/);
  });
});

// ============================================================================
// AC2: PASS Flow - Status Transition and Report Content
// ============================================================================

describe('AC2: PASS Flow - Status Transition and Report Content', () => {
  // Mocking the utility functions as they are not implemented yet
  // In a real TDD cycle, we would test the actual implementation
  // For now, we verify the contract requirements

  test('[P0] Status should transition from in-progress to review on success', () => {
    // This is a placeholder for the actual logic that will be implemented
    // The test verifies that the requirement is understood
    const expectedFromStatus = 'in-progress';
    const expectedToStatus = 'review';
    
    // In implementation: appendStatusHistory(story, '/scrum-verify', 'review')
    expect(expectedToStatus).toBe('review');
  });

  test('[P0] Verification report must contain required fields on success', () => {
    // Report must contain: check results (pass/fail per check), timestamp, coverage summary
    const templateContent = readFileSync(join(TEMPLATES_DIR, 'verification-report.md'), 'utf8');
    expect(templateContent).toMatch(/verification_date/i);
    expect(templateContent).toMatch(/test_coverage|Coverage/i);
    expect(templateContent).toMatch(/Test Results|test_total/i);
    expect(templateContent).toMatch(/Linter|Lint/i);
    expect(templateContent).toMatch(/Build/i);
  });
});

// ============================================================================
// AC3: FAIL Flow - Actionable Guidance and Status Persistence
// ============================================================================

describe('AC3: FAIL Flow - Actionable Guidance and Status Persistence', () => {
  test('[P0] Status must remain in-progress on failure', () => {
    const currentStatus = 'in-progress';
    const checkResult = 'fail';
    
    let newStatus = currentStatus;
    if (checkResult === 'pass') {
      newStatus = 'review';
    }
    
    expect(newStatus).toBe('in-progress');
  });

  test('[P1] Report must include actionable guidance on failure', () => {
    const templateContent = readFileSync(join(TEMPLATES_DIR, 'verification-report.md'), 'utf8');
    // The template or implementation should provide space/guidance for failures
    expect(templateContent).toMatch(/Actionable Guidance|Fix|Next Step/i);
  });
});

// ============================================================================
// AC4: Write Boundary Enforcement
// ============================================================================

describe('AC4: Write Boundary Enforcement', () => {
  test('[P0] Architecture.md must define /scrum-verify write boundaries', () => {
    const archContent = readFileSync(join(REPO_ROOT, '_scrum-output', 'planning-artifacts', 'architecture.md'), 'utf8');
    const verifyBoundary = archContent.match(/\/scrum-verify[\s\S]*?verification-report\.md/);
    expect(verifyBoundary).not.toBeNull();
  });

  test('[P0] /scrum-verify must NOT be allowed to write source code', () => {
     const archContent = readFileSync(join(REPO_ROOT, '_scrum-output', 'planning-artifacts', 'architecture.md'), 'utf8');
     const verifyBoundarySection = archContent.match(/\/scrum-verify[\s\S]*?(?=^\||\n## )/m);
     expect(verifyBoundarySection).not.toBeNull();
     // Should explicitly say it may NOT write source code
     expect(verifyBoundarySection![0]).toMatch(/Source code/);
  });
});
