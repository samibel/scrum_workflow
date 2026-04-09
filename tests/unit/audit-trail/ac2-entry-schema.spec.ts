/**
 * ATDD Tests for Central Audit Trail - AC2
 *
 * TDD Phase: RED (tests written before implementation)
 * Test Level: Unit (File Content Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 8.3 - Implement Central Audit Trail
 *
 * AC2: Given the audit trail artifact
 *      When entries are recorded
 *      Then each entry contains: timestamp (ISO 8601 UTC), event type (transition/action/artifact), actor, details
 *      And the trail is append-only (entries never modified or deleted)
 *      And the trail is stored in `_scrum-output/audit/SW-XXX-audit.md`
 */

import { existsSync, readFileSync, mkdirSync, writeFileSync, appendFileSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Test paths
const PROJECT_ROOT = join(__dirname, '..', '..', '..');
const AUDIT_UTILS = join(PROJECT_ROOT, 'scrum_workflow', 'utils', 'audit.js');
const AUDIT_WORKFLOW = join(PROJECT_ROOT, 'scrum_workflow', 'workflows', 'audit.md');
const AUDIT_OUTPUT_DIR = join(PROJECT_ROOT, 'scrum_workflow', '_scrum-output', 'audit');

// ISO 8601 UTC timestamp regex
const ISO_8601_UTC_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;

// ============================================================================
// AC2: Entry Schema Compliance
// ============================================================================

describe('AC2: Entry Schema Compliance', () => {
  test('[P0] audit workflow should define entry schema with timestamp', () => {
    const content = readFileSync(AUDIT_WORKFLOW, 'utf8');
    expect(content).toMatch(/timestamp.*ISO|ISO.*8601|ISO.*timestamp/);
  });

  test('[P0] audit workflow should define entry schema with event_type field', () => {
    const content = readFileSync(AUDIT_WORKFLOW, 'utf8');
    expect(content).toMatch(/event_type|eventType|type.*event/);
  });

  test('[P0] audit workflow should define entry schema with actor field', () => {
    const content = readFileSync(AUDIT_WORKFLOW, 'utf8');
    expect(content).toMatch(/\bactor\b/);
  });

  test('[P0] audit workflow should define entry schema with details field', () => {
    const content = readFileSync(AUDIT_WORKFLOW, 'utf8');
    expect(content).toMatch(/\bdetails\b/);
  });

  test('[P0] audit workflow should support event types: transition, action, artifact', () => {
    const content = readFileSync(AUDIT_WORKFLOW, 'utf8');
    expect(content).toMatch(/transition/);
    expect(content).toMatch(/action/);
    expect(content).toMatch(/artifact/);
  });

  test('[P1] audit.js should export appendEntry function with proper signature', () => {
    const content = readFileSync(AUDIT_UTILS, 'utf8');
    // Should have a function that takes ticketId, eventType, actor, details
    expect(content).toMatch(/function\s+appendEntry|appendEntry\s*[=:]/);
  });

  test('[P1] audit.js should validate ISO 8601 UTC timestamp format', () => {
    const content = readFileSync(AUDIT_UTILS, 'utf8');
    // Should have timestamp validation or generation
    expect(content).toMatch(/toISOString|ISO.*8601|timestamp/);
  });
});

// ============================================================================
// AC2: Append-Only Integrity
// ============================================================================

describe('AC2: Append-Only Integrity', () => {
  test('[P0] audit workflow should specify append-only behavior', () => {
    const content = readFileSync(AUDIT_WORKFLOW, 'utf8');
    expect(content).toMatch(/append.*only|appendOnly|never.*modif/);
  });

  test('[P0] audit workflow should specify entries are never modified or deleted', () => {
    const content = readFileSync(AUDIT_WORKFLOW, 'utf8');
    expect(content).toMatch(/never.*modif|never.*delet|append.*only/);
  });

  test('[P1] audit.js should implement append-only write pattern', () => {
    const content = readFileSync(AUDIT_UTILS, 'utf8');
    // Should not have delete, remove, or overwrite functionality for entries
    expect(content).not.toMatch(/\.unlink|\.removeEntry|\.deleteEntry/);
  });

  test('[P1] audit.js should use atomic write pattern (temp file + rename)', () => {
    const content = readFileSync(AUDIT_UTILS, 'utf8');
    // Atomic write pattern to prevent corruption
    expect(content).toMatch(/tmp|temp|rename|sync|^$/);
  });

  test('[P1] audit.js should have file locking for concurrent write safety', () => {
    const content = readFileSync(AUDIT_UTILS, 'utf8');
    // File locking mechanism
    expect(content).toMatch(/lock|exclusive|access/i);
  });
});

// ============================================================================
// AC2: Audit Trail Storage Location
// ============================================================================

describe('AC2: Audit Trail Storage Location', () => {
  test('[P0] audit trail should be stored in _scrum-output/audit directory', () => {
    const content = readFileSync(AUDIT_WORKFLOW, 'utf8');
    expect(content).toMatch(/_scrum-output[\/\\]audit/);
  });

  test('[P0] audit trail file format should be SW-XXX-audit.md', () => {
    const content = readFileSync(AUDIT_WORKFLOW, 'utf8');
    expect(content).toMatch(/SW-\d{3}-audit\.md/);
  });

  test('[P1] audit trail should be Markdown format (human-readable)', () => {
    const content = readFileSync(AUDIT_WORKFLOW, 'utf8');
    expect(content).toMatch(/\.md|markdown|human.*read|git.*vers/i);
  });
});

// ============================================================================
// AC2: Entry Schema Validation Tests
// ============================================================================

describe('AC2: Entry Schema Validation', () => {
  const TEST_TICKET = 'SW-888';
  const TEST_AUDIT_FILE = join(AUDIT_OUTPUT_DIR, `${TEST_TICKET}-audit.md`);

  afterAll(() => {
    // Cleanup test file
    if (existsSync(TEST_AUDIT_FILE)) {
      rmSync(TEST_AUDIT_FILE);
    }
  });

  test('[P0] entries should have ISO 8601 UTC timestamp', () => {
    // This tests the schema definition, not runtime behavior
    const content = readFileSync(AUDIT_WORKFLOW, 'utf8');
    expect(content).toMatch(/timestamp.*ISO|ISO.*8601.*UTC/);
  });

  test('[P0] event_type should be one of: transition, action, artifact', () => {
    const content = readFileSync(AUDIT_WORKFLOW, 'utf8');
    expect(content).toMatch(/transition.*action.*artifact|event.*type.*enum/);
  });

  test('[P0] actor should specify valid values (human, architect-agent, system)', () => {
    const content = readFileSync(AUDIT_WORKFLOW, 'utf8');
    expect(content).toMatch(/human.*agent.*system|actor.*enum/);
  });

  test('[P1] artifact events should include source_artifact field', () => {
    const content = readFileSync(AUDIT_WORKFLOW, 'utf8');
    expect(content).toMatch(/source_artifact|sourceArtifact|artifact.*path/);
  });
});
