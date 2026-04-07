/**
 * ATDD Tests for AC3: Naming Convention Compliance
 *
 * TDD Phase: RED (tests will fail until feature is verified)
 * Test Level: Unit (File Content Validation + Naming Pattern Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 1.9 - Verify & Align Artifact Contract
 *
 * PRD References:
 * - FR-46: Artifact contract — predictable locations with consistent naming
 * - Architecture: Naming patterns — SW-XXX, review-{N}, approval-{N}, RR-XXX, DR-XXX, RN-XXX,
 *                  session-{YYYY-MM-DD}
 *
 * AC3: Given the Architecture specifies naming conventions (SW-XXX, review-{N}, approval-{N},
 *           RR-XXX, DR-XXX, RN-XXX)
 *      When artifacts are verified
 *      Then all artifacts follow the standardized naming patterns
 */

import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

// ============================================================================
// AC3: Story ID Format — SW-XXX (3-digit, zero-padded)
// ============================================================================

describe('AC3: Story ID Format — SW-XXX naming convention', () => {
  const commandFile = join(process.cwd(), 'scrum_workflow', 'commands', 'create-ticket.md');
  const workflowFile = join(process.cwd(), 'scrum_workflow', 'workflows', 'ticket-creation.md');
  const storyFile = join(
    process.cwd(),
    '_bmad-output',
    'implementation-artifacts',
    '1-9-verify-align-artifact-contract.md',
  );

  // Test 3.1: create-ticket command specifies SW-XXX format
  test.skip('[P0] create-ticket command should specify SW-XXX (3-digit, zero-padded) story ID format', () => {
    expect(existsSync(commandFile)).toBe(true);
    const content = readFileSync(commandFile, 'utf8');
    // Must reference SW-XXX with 3-digit zero-padded format description
    expect(content).toMatch(/SW-XXX|SW-\d{3}|zero-padded/i);
  });

  // Test 3.2: ticket-creation workflow specifies SW-XXX format
  test.skip('[P0] ticket-creation workflow should use SW-XXX format for story directory naming', () => {
    expect(existsSync(workflowFile)).toBe(true);
    const content = readFileSync(workflowFile, 'utf8');
    expect(content).toMatch(/SW-XXX|SW-\d{3}/);
  });

  // Test 3.3: Story documents the story ID format comparison (SW-XXX vs X-Y-name.md)
  test.skip('[P1] Story should document the story ID format delta (SW-XXX spec vs X-Y-name.md implementation)', () => {
    const content = readFileSync(storyFile, 'utf8');
    // Story must document both the FR-46 spec and the current implementation format
    expect(content).toMatch(/SW-XXX/);
  });
});

// ============================================================================
// AC3: Review Artifact Naming — review-{N}.md (sequential numbering)
// ============================================================================

describe('AC3: Review Artifact Naming — review-{N}.md convention', () => {
  const reviewCommandFile = join(process.cwd(), 'scrum_workflow', 'commands', 'review-story.md');
  const reviewWorkflowFile = join(process.cwd(), 'scrum_workflow', 'workflows', 'review-story.md');

  // Test 3.4: review-story command specifies review-N.md naming
  test.skip('[P0] review-story command should specify review-{N}.md sequential naming', () => {
    expect(existsSync(reviewCommandFile)).toBe(true);
    const content = readFileSync(reviewCommandFile, 'utf8');
    expect(content).toMatch(/review-N\.md|review-\{N\}\.md|review-1\.md|review-2\.md/);
  });

  // Test 3.5: review-story workflow specifies sequential review numbering
  test.skip('[P0] review-story workflow should specify sequential numbering for review artifacts', () => {
    expect(existsSync(reviewWorkflowFile)).toBe(true);
    const content = readFileSync(reviewWorkflowFile, 'utf8');
    // Workflow must document the sequential numbering logic
    expect(content).toMatch(/review-N\.md|review-\{N\}\.md|review-1\.md|sequential/i);
  });
});

// ============================================================================
// AC3: Approval Artifact Naming — approval-{N}.md (sequential numbering)
// ============================================================================

describe('AC3: Approval Artifact Naming — approval-{N}.md convention (deferred)', () => {
  const storyFile = join(
    process.cwd(),
    '_bmad-output',
    'implementation-artifacts',
    '1-9-verify-align-artifact-contract.md',
  );

  // Test 3.6: Story documents approval-N.md as a deferred artifact (Epic 2)
  test.skip('[P0] Story should document approval-{N}.md naming convention as deferred to Epic 2', () => {
    const content = readFileSync(storyFile, 'utf8');
    // approval-N.md is referenced in FR-46 but the command is deferred
    expect(content).toMatch(/approval-N\.md|approval-\{N\}\.md|approval-1\.md/i);
  });
});

// ============================================================================
// AC3: Research Report Naming — RR-XXX.md (3-digit, zero-padded)
// ============================================================================

describe('AC3: Research Report Naming — RR-XXX.md convention', () => {
  const technicalCommandFile = join(process.cwd(), 'scrum_workflow', 'commands', 'research-technical.md');
  const generalCommandFile = join(process.cwd(), 'scrum_workflow', 'commands', 'research-general.md');
  const technicalWorkflowFile = join(process.cwd(), 'scrum_workflow', 'workflows', 'research-technical.md');

  // Test 3.7: research-technical command specifies RR-XXX.md naming
  test.skip('[P0] research-technical command should specify RR-XXX.md (3-digit zero-padded) naming', () => {
    expect(existsSync(technicalCommandFile)).toBe(true);
    const content = readFileSync(technicalCommandFile, 'utf8');
    expect(content).toMatch(/RR-XXX\.md|RR-\d{3}\.md/);
  });

  // Test 3.8: research-general command specifies RR-XXX.md naming
  test.skip('[P0] research-general command should specify RR-XXX.md naming convention', () => {
    expect(existsSync(generalCommandFile)).toBe(true);
    const content = readFileSync(generalCommandFile, 'utf8');
    expect(content).toMatch(/RR-XXX\.md|RR-\d{3}\.md/);
  });

  // Test 3.9: research-technical workflow uses RR-XXX.md naming pattern
  test.skip('[P0] research-technical workflow should generate RR-XXX.md filenames', () => {
    expect(existsSync(technicalWorkflowFile)).toBe(true);
    const content = readFileSync(technicalWorkflowFile, 'utf8');
    expect(content).toMatch(/RR-XXX\.md|RR-\d{3}\.md/);
  });

  // Test 3.10: Actual RR-XXX.md files follow 3-digit zero-padded naming
  test.skip('[P0] Existing research artifacts in _scrum-output/memory/research/ should follow RR-XXX.md convention', () => {
    const outputDir = join(process.cwd(), '_scrum-output', 'memory', 'research');
    if (!existsSync(outputDir)) {
      // Directory doesn't exist yet — that's a separate AC2 check
      return;
    }
    const files = readdirSync(outputDir).filter((f) => f.endsWith('.md'));
    for (const file of files) {
      expect(file).toMatch(/^RR-\d{3}\.md$/);
    }
  });
});

// ============================================================================
// AC3: Decision Record Naming — DR-XXX.md (3-digit, zero-padded) — deferred
// ============================================================================

describe('AC3: Decision Record Naming — DR-XXX.md convention (deferred, Epic 7)', () => {
  const storyFile = join(
    process.cwd(),
    '_bmad-output',
    'implementation-artifacts',
    '1-9-verify-align-artifact-contract.md',
  );

  // Test 3.11: Story documents DR-XXX.md as a deferred artifact
  test.skip('[P1] Story should reference DR-XXX.md naming convention (deferred)', () => {
    const content = readFileSync(storyFile, 'utf8');
    // DR-XXX is mentioned in Architecture spec
    expect(content).toMatch(/DR-XXX\.md|DR-\d{3}\.md|decision.*record/i);
  });
});

// ============================================================================
// AC3: Risk Note Naming — RN-XXX.md (3-digit, zero-padded) — deferred
// ============================================================================

describe('AC3: Risk Note Naming — RN-XXX.md convention (deferred, Epic 7)', () => {
  const storyFile = join(
    process.cwd(),
    '_bmad-output',
    'implementation-artifacts',
    '1-9-verify-align-artifact-contract.md',
  );

  // Test 3.12: Story documents RN-XXX.md as a deferred artifact
  test.skip('[P1] Story should reference RN-XXX.md naming convention (deferred)', () => {
    const content = readFileSync(storyFile, 'utf8');
    expect(content).toMatch(/RN-XXX\.md|RN-\d{3}\.md|risk.*note/i);
  });
});

// ============================================================================
// AC3: Session Summary Naming — session-{YYYY-MM-DD}.md — deferred
// ============================================================================

describe('AC3: Session Summary Naming — session-{YYYY-MM-DD}.md convention (deferred, Epic 7)', () => {
  const storyFile = join(
    process.cwd(),
    '_bmad-output',
    'implementation-artifacts',
    '1-9-verify-align-artifact-contract.md',
  );

  // Test 3.13: Story documents session-YYYY-MM-DD.md as a deferred artifact
  test.skip('[P1] Story should reference session-{YYYY-MM-DD}.md naming convention (deferred)', () => {
    const content = readFileSync(storyFile, 'utf8');
    // session-{YYYY-MM-DD}.md is the session summary naming pattern
    expect(content).toMatch(/session-.*\.md|session.*summary|YYYY-MM-DD/i);
  });
});

// ============================================================================
// AC3: Architecture Document Naming Conventions Reference
// ============================================================================

describe('AC3: Architecture Specification — Naming Patterns Reference', () => {
  const architectureFile = join(process.cwd(), '_bmad-output', 'planning-artifacts', 'architecture.md');

  // Test 3.14: Architecture file exists
  test.skip('[P0] Architecture file should exist', () => {
    expect(existsSync(architectureFile)).toBe(true);
  });

  // Test 3.15: Architecture defines SW-XXX story ID format
  test.skip('[P0] Architecture should define SW-XXX (3-digit, zero-padded) story ID format', () => {
    const content = readFileSync(architectureFile, 'utf8');
    expect(content).toMatch(/SW-XXX|SW-\d{3}|zero-padded/i);
  });

  // Test 3.16: Architecture defines review-{N}.md naming
  test.skip('[P0] Architecture should define review-{N}.md sequential naming', () => {
    const content = readFileSync(architectureFile, 'utf8');
    expect(content).toMatch(/review-\{N\}|review-N\.md|review-1\.md/i);
  });

  // Test 3.17: Architecture defines RR-XXX.md naming
  test.skip('[P0] Architecture should define RR-XXX.md (3-digit zero-padded) naming', () => {
    const content = readFileSync(architectureFile, 'utf8');
    expect(content).toMatch(/RR-XXX\.md|RR-\d{3}\.md/);
  });

  // Test 3.18: Architecture defines code naming conventions (SKILL.md, workflow.md)
  test.skip('[P1] Architecture should define code naming conventions (SKILL.md uppercase, workflow.md lowercase)', () => {
    const content = readFileSync(architectureFile, 'utf8');
    expect(content).toMatch(/SKILL\.md|workflow\.md/);
  });
});
