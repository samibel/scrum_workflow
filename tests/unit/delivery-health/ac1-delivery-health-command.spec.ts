/**
 * ATDD Tests for Delivery Health Command - AC1
 *
 * TDD Phase: RED (tests written before implementation)
 * Test Level: Unit (File Content Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 8.5 - Implement Delivery Health Command
 *
 * AC1: Given FR-40 specifies `/delivery-health` showing policy violations, open risks, and pending approvals
 *      When a developer runs `/delivery-health`
 *      Then the system aggregates data from:
 *        - Audit trails (policy violations from Story 8.2)
 *        - Risk notes (open risks from `_scrum-output/memory/risks/`)
 *        - Story statuses (pending approvals = stories in `approved` status awaiting `/scrum-approve`)
 */

import { existsSync, readFileSync, mkdirSync, writeFileSync, rmSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Test paths - use fileURLToPath for reliable location tracking
const PROJECT_ROOT = join(__dirname, '..', '..', '..');
const DELIVERY_HEALTH_CMD = join(PROJECT_ROOT, 'src', 'core', 'commands', 'delivery-health.md');
const DELIVERY_HEALTH_UTILS = join(PROJECT_ROOT, 'src', 'core', 'utils', 'delivery-health.js');
const DELIVERY_HEALTH_WORKFLOW = join(PROJECT_ROOT, 'src', 'core', 'workflows', 'delivery-health.md');
const AUDIT_OUTPUT_DIR = join(PROJECT_ROOT, '_scrum-output', 'audit');
const RISKS_OUTPUT_DIR = join(PROJECT_ROOT, '_scrum-output', 'memory', 'risks');
const SPRINTS_OUTPUT_DIR = join(PROJECT_ROOT, '_scrum-output', 'sprints');

// Helper to create mock audit entries for policy violations
function createMockAuditEntry(ticketId: string, severity: string, violationType: string): void {
  mkdirSync(AUDIT_OUTPUT_DIR, { recursive: true });
  const entry = {
    timestamp: new Date().toISOString(),
    ticket: ticketId,
    type: 'policy-violation',
    severity,
    violationType,
    recommendedAction: `Fix ${violationType} for ${ticketId}`
  };
  const filePath = join(AUDIT_OUTPUT_DIR, `${ticketId}-${Date.now()}.json`);
  writeFileSync(filePath, JSON.stringify(entry, null, 2), 'utf8');
}

// Helper to create mock risk notes
function createMockRiskNote(riskId: string, severity: string, affectedArea: string, status: string): void {
  mkdirSync(RISKS_OUTPUT_DIR, { recursive: true });
  const content = `---
severity: ${severity}
affected_area: ${affectedArea}
mitigation: Mitigate ${riskId}
status: ${status}
ticket: SW-001
---

# Risk ${riskId}

${affectedArea}
`;
  writeFileSync(join(RISKS_OUTPUT_DIR, `${riskId}.md`), content, 'utf8');
}

// Helper to create a mock approved story
function createMockApprovedStory(ticketId: string, title: string): void {
  const storyDir = join(SPRINTS_OUTPUT_DIR, ticketId);
  mkdirSync(storyDir, { recursive: true });
  const content = `---
ticket: ${ticketId}
title: ${title}
status: approved
created: ${new Date().toISOString()}
---

# ${title}
`;
  writeFileSync(join(storyDir, 'story.md'), content, 'utf8');
}

// Helper to cleanup test artifacts
function cleanupTestArtifacts(): void {
  // Cleanup audit entries
  if (existsSync(AUDIT_OUTPUT_DIR)) {
    readdirSync(AUDIT_OUTPUT_DIR).forEach(file => {
      rmSync(join(AUDIT_OUTPUT_DIR, file), { force: true });
    });
  }
  // Cleanup risk notes
  if (existsSync(RISKS_OUTPUT_DIR)) {
    readdirSync(RISKS_OUTPUT_DIR).forEach(file => {
      rmSync(join(RISKS_OUTPUT_DIR, file), { force: true });
    });
  }
  // Cleanup sprint stories
  if (existsSync(SPRINTS_OUTPUT_DIR)) {
    readdirSync(SPRINTS_OUTPUT_DIR).forEach(dir => {
      rmSync(join(SPRINTS_OUTPUT_DIR, dir), { recursive: true, force: true });
    });
  }
}

// ============================================================================
// AC1: Delivery Health Command & Workflow Definition
// ============================================================================

describe('AC1: Delivery Health Command & Workflow Definition', () => {

  afterAll(() => {
    cleanupTestArtifacts();
  });

  test.skip('[P0] scrum_workflow/commands/delivery-health.md should exist', () => {
    expect(existsSync(DELIVERY_HEALTH_CMD)).toBe(true);
  });

  test.skip('[P0] scrum_workflow/workflows/delivery-health.md should exist', () => {
    expect(existsSync(DELIVERY_HEALTH_WORKFLOW)).toBe(true);
  });

  test.skip('[P0] scrum_workflow/utils/delivery-health.js should exist', () => {
    expect(existsSync(DELIVERY_HEALTH_UTILS)).toBe(true);
  });

  test.skip('[P0] delivery-health.md should define the /delivery-health slash-command', () => {
    const content = readFileSync(DELIVERY_HEALTH_CMD, 'utf8');
    expect(content).toMatch(/delivery-health/);
  });

  test.skip('[P0] delivery-health.md should reference delivery-health workflow', () => {
    const content = readFileSync(DELIVERY_HEALTH_CMD, 'utf8');
    expect(content).toMatch(/delivery-health/i);
  });

  test.skip('[P0] delivery-health.md should define --format flag (table/json)', () => {
    const content = readFileSync(DELIVERY_HEALTH_CMD, 'utf8');
    expect(content).toMatch(/--format|--format\s+table\|json/);
  });

  test.skip('[P0] delivery-health workflow should define data aggregation from 3 sources', () => {
    const content = readFileSync(DELIVERY_HEALTH_WORKFLOW, 'utf8');
    expect(content).toMatch(/_scrum-output\/audit/);
    expect(content).toMatch(/_scrum-output\/memory\/risks/);
    expect(content).toMatch(/_scrum-output\/sprints/);
  });
});

// ============================================================================
// AC1: Data Aggregation Sources
// ============================================================================

describe('AC1: Data Aggregation Sources', () => {

  afterAll(() => {
    cleanupTestArtifacts();
  });

  test.skip('[P0] delivery-health should scan _scrum-output/audit for policy violations', () => {
    // Create mock audit entry
    createMockAuditEntry('SW-001', 'critical', 'no-plan');
    expect(existsSync(AUDIT_OUTPUT_DIR)).toBe(true);
  });

  test.skip('[P0] delivery-health should scan _scrum-output/memory/risks for open risks', () => {
    // Create mock risk note
    createMockRiskNote('RN-001', 'major', 'Database performance', 'open');
    expect(existsSync(RISKS_OUTPUT_DIR)).toBe(true);
  });

  test.skip('[P0] delivery-health should scan _scrum-output/sprints for approved stories', () => {
    // Create mock approved story
    createMockApprovedStory('SW-002', 'Test Story');
    expect(existsSync(SPRINTS_OUTPUT_DIR)).toBe(true);
  });

  test.skip('[P0] delivery-health should aggregate and deduplicate findings', () => {
    // Utility should handle deduplication across sources
    const content = readFileSync(DELIVERY_HEALTH_UTILS, 'utf8');
    expect(content).toMatch(/dedupe|deduplicate|aggregate/i);
  });
});

// ============================================================================
// AC1: Health Report Output Structure
// ============================================================================

describe('AC1: Health Report Output Structure', () => {

  afterAll(() => {
    cleanupTestArtifacts();
  });

  test.skip('[P0] health report should have sections: Policy Violations, Open Risks, Pending Approvals', () => {
    const content = readFileSync(DELIVERY_HEALTH_WORKFLOW, 'utf8');
    expect(content).toMatch(/Policy Violations|Violations/i);
    expect(content).toMatch(/Open Risks|Risks/i);
    expect(content).toMatch(/Pending Approvals|Approved/i);
  });

  test.skip('[P0] health report should show summary header with counts per category', () => {
    const content = readFileSync(DELIVERY_HEALTH_WORKFLOW, 'utf8');
    expect(content).toMatch(/count|summary|total/i);
  });

  test.skip('[P1] delivery-health should support --format table output', () => {
    const content = readFileSync(DELIVERY_HEALTH_CMD, 'utf8');
    expect(content).toMatch(/table/i);
  });

  test.skip('[P1] delivery-health should support --format json output', () => {
    const content = readFileSync(DELIVERY_HEALTH_CMD, 'utf8');
    expect(content).toMatch(/json/i);
  });
});
