/**
 * ATDD Tests — AC2: Approval Decision Record Extraction
 * Story 7.1: Implement Decision Record Extraction
 *
 * AC2: Given an approval via /scrum-approve includes reasoning
 *      When the approval reasoning contains a decision
 *      Then a decision record is extracted and stored
 */

import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { existsSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import {
  detectDecisionSignals,
  extractDecisionsFromApproval,
  executeApprovalWorkflowWithDecisionExtraction,
} from '../../utils/decision-extraction.js';

const PROJECT_ROOT = join(process.cwd());
const TEST_DECISIONS_DIR = join(PROJECT_ROOT, '_test-output', 'memory', 'decisions');

// ─── Factories ────────────────────────────────────────────────────────────────

/**
 * Creates a mock approval-N.md content with decision reasoning
 */
function createApprovalWithDecision(overrides = {}) {
  return {
    ticketId: overrides.ticketId ?? 'SW-001',
    approvalNumber: overrides.approvalNumber ?? 1,
    content: overrides.content ?? `---
schema_version: 1.0.0
ticket: SW-001
status: done
approver: Sami
approval_date: 2026-04-09T10:00:00Z
decision: approved
reasoning: "Approved because WebSockets chosen over SSE for bidirectional communication requirements"
---

# Approval: SW-001

## Reasoning

Approved because WebSockets chosen over SSE. The bidirectional nature of the chat
feature requires full-duplex communication which SSE cannot provide. WebSockets
were selected as the primary transport layer for all real-time features.

## Review Reference

Based on review-1.md with no blocking findings.
`,
    sourceFile: overrides.sourceFile ?? '_scrum-output/sprints/SW-001/approval-1.md',
  };
}

/**
 * Creates a mock approval with reasoning but NO decision signals
 */
function createApprovalWithoutDecision(overrides = {}) {
  return {
    ticketId: overrides.ticketId ?? 'SW-002',
    approvalNumber: overrides.approvalNumber ?? 1,
    content: overrides.content ?? `---
schema_version: 1.0.0
ticket: SW-002
status: done
approver: Sami
approval_date: 2026-04-09T11:00:00Z
decision: approved
reasoning: "All acceptance criteria met, no blockers found"
---

# Approval: SW-002

## Reasoning

All acceptance criteria have been verified. Implementation is complete and
the code review found no major issues. Proceeding to done status.
`,
    sourceFile: overrides.sourceFile ?? '_scrum-output/sprints/SW-002/approval-1.md',
  };
}

/**
 * Creates a mock approval with changes-needed (not approved)
 */
function createApprovalChangesNeeded(overrides = {}) {
  return {
    ticketId: overrides.ticketId ?? 'SW-003',
    approvalNumber: overrides.approvalNumber ?? 1,
    content: overrides.content ?? `---
schema_version: 1.0.0
ticket: SW-003
status: approved
approver: Sami
approval_date: 2026-04-09T12:00:00Z
decision: changes-needed
reasoning: "Changes needed: we should use REST over GraphQL for simpler client integration"
---

# Approval: SW-003

Changes needed: use REST over GraphQL. GraphQL adds unnecessary complexity for
this use case where simple CRUD endpoints suffice.
`,
    sourceFile: overrides.sourceFile ?? '_scrum-output/sprints/SW-003/approval-1.md',
  };
}

// ─── Fixtures ─────────────────────────────────────────────────────────────────

function createTemporaryDecisionsDir() {
  if (!existsSync(TEST_DECISIONS_DIR)) {
    mkdirSync(TEST_DECISIONS_DIR, { recursive: true });
  }
  return TEST_DECISIONS_DIR;
}

function cleanupTemporaryDecisionsDir() {
  const testOutputDir = join(PROJECT_ROOT, '_test-output', 'memory');
  if (existsSync(testOutputDir)) {
    rmSync(testOutputDir, { recursive: true, force: true });
  }
}

// ─── Test Suite ───────────────────────────────────────────────────────────────

describe('AC2: Approval Decision Record Extraction', () => {
  let decisionsDir;

  beforeEach(() => {
    decisionsDir = createTemporaryDecisionsDir();
  });

  afterEach(() => {
    cleanupTemporaryDecisionsDir();
  });

  describe('Decision Signal Detection from Approval', () => {
    test('[P0] 7.1-UNIT-020: should detect "approved because X chosen over Y" in approval reasoning', () => {
      // Given: approval reasoning with decision signal
      const content = 'Approved because WebSockets chosen over SSE for bidirectional communication.';

      const signals = detectDecisionSignals(content);
      expect(signals.length).toBeGreaterThan(0);
      expect(signals[0].text).toContain('WebSockets');
    });

    test('[P1] 7.1-UNIT-021: should detect "use X over Y" decision pattern in approval', () => {
      const content = 'Changes needed: we should use REST over GraphQL for simpler client integration.';
      const signals = detectDecisionSignals(content);
      expect(signals.length).toBeGreaterThan(0);
    });

    test('[P1] 7.1-UNIT-022: should return empty array when approval has no decision signals', () => {
      const content = 'All acceptance criteria met, no blockers found. Proceeding to done.';
      const signals = detectDecisionSignals(content);
      expect(signals).toHaveLength(0);
    });
  });

  describe('DR Artifact Creation from Approval', () => {
    test('[P0] 7.1-INT-010: should create DR-001.md when approval contains a decision', async () => {
      // Given: approval with decision reasoning, empty decisions directory
      const approval = createApprovalWithDecision({ ticketId: 'SW-010' });

      // When: extracting decisions from approval
      const result = await extractDecisionsFromApproval({
        content: approval.content,
        ticketId: approval.ticketId,
        sourceFile: approval.sourceFile,
        decisionsDir,
      });

      // Then: DR-001.md is created
      expect(result.created.length).toBeGreaterThanOrEqual(1);
      expect(result.created[0]).toBe('DR-001.md');
      expect(existsSync(join(decisionsDir, 'DR-001.md'))).toBe(true);
    });

    test('[P0] 7.1-INT-011: should use source=approval in DR artifact when triggered by approval', async () => {
      // Given: approval with decision
      const approval = createApprovalWithDecision({ ticketId: 'SW-011' });

      const result = await extractDecisionsFromApproval({
        content: approval.content,
        ticketId: approval.ticketId,
        sourceFile: approval.sourceFile,
        decisionsDir,
      });

      // Then: DR artifact has source=approval (not refinement)
      expect(result.created.length).toBeGreaterThan(0);
      const drContent = readFileSync(join(decisionsDir, result.created[0]), 'utf8');
      expect(drContent).toContain('source: approval');
      expect(drContent).toContain(`source_file: ${approval.sourceFile}`);
    });

    test('[P0] 7.1-INT-012: should sequence DR numbers across refinement and approval extractions', async () => {
      // Given: DR-001.md already created by a refinement extraction
      writeFileSync(join(decisionsDir, 'DR-001.md'), '# DR-001 from refinement', 'utf8');

      // When: approval extraction runs
      const approval = createApprovalWithDecision({ ticketId: 'SW-012' });
      const result = await extractDecisionsFromApproval({
        content: approval.content,
        ticketId: approval.ticketId,
        sourceFile: approval.sourceFile,
        decisionsDir,
      });

      // Then: DR-002.md created (continues sequence from refinement's DR-001)
      expect(result.created).toContain('DR-002.md');
      expect(existsSync(join(decisionsDir, 'DR-002.md'))).toBe(true);
    });

    test('[P1] 7.1-INT-013: should return empty created array when approval has no decision signals', async () => {
      // Given: approval without decision signals
      const approval = createApprovalWithoutDecision();

      // When: extracting decisions
      const result = await extractDecisionsFromApproval({
        content: approval.content,
        ticketId: approval.ticketId,
        sourceFile: approval.sourceFile,
        decisionsDir,
      });

      // Then: no DRs created, not an error
      expect(result.created).toHaveLength(0);
      expect(result.noDecisionsDetected).toBe(true);
    });

    test('[P1] 7.1-INT-014: should extract decisions from changes-needed approvals as well', async () => {
      // Given: a changes-needed approval with a decision embedded in reasoning
      const approval = createApprovalChangesNeeded();

      // When: extracting decisions
      const result = await extractDecisionsFromApproval({
        content: approval.content,
        ticketId: approval.ticketId,
        sourceFile: approval.sourceFile,
        decisionsDir,
      });

      // Then: decision is still extracted (source is approval, regardless of verdict)
      expect(result.created.length).toBeGreaterThan(0);
    });

    test('[P1] 7.1-INT-015: should include ticket reference in DR artifact for approval source', async () => {
      // Given: approval with decision for ticket SW-015
      const ticketId = 'SW-015';
      const approval = createApprovalWithDecision({ ticketId });

      const result = await extractDecisionsFromApproval({
        content: approval.content,
        ticketId,
        sourceFile: approval.sourceFile,
        decisionsDir,
      });

      // Then: DR artifact contains the ticket reference (NFR-7: Artifact Traceability)
      const drContent = readFileSync(join(decisionsDir, result.created[0]), 'utf8');
      expect(drContent).toContain(`ticket: "${ticketId}"`);
    });
  });

  describe('Approval Workflow Integration', () => {
    test('[P0] 7.1-INT-016: should report extracted DRs in approval completion summary', async () => {
      // Given: an approval with a decision and the approval workflow
      const approval = createApprovalWithDecision({ ticketId: 'SW-016' });

      // When: full approval workflow executes with decision extraction
      const workflowResult = await executeApprovalWorkflowWithDecisionExtraction({
        approvalContent: approval.content,
        ticketId: approval.ticketId,
        sourceFile: approval.sourceFile,
        decisionsDir,
      });

      // Then: completion summary mentions extracted DRs
      expect(workflowResult.summary).toContain('DR-001.md');
      expect(workflowResult.summary).toMatch(/Extracted \d+ decision record/);
    });

    test('[P1] 7.1-INT-017: should report "No decisions detected" when approval has no decision signals', async () => {
      const approval = createApprovalWithoutDecision();

      const workflowResult = await executeApprovalWorkflowWithDecisionExtraction({
        approvalContent: approval.content,
        ticketId: approval.ticketId,
        sourceFile: approval.sourceFile,
        decisionsDir,
      });

      expect(workflowResult.summary).toContain('No decisions detected');
    });
  });
});
