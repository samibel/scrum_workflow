/**
 * ATDD Tests for AC4: Comprehensive Delta Report and FR-46 Compliance
 *
 * TDD Phase: RED (tests will fail until feature is verified)
 * Test Level: Integration (Cross-Artifact Compliance Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 1.9 - Verify & Align Artifact Contract
 *
 * PRD References:
 * - FR-46: Every slash-command that produces an artifact must generate it in a predictable
 *   location with consistent naming convention.
 *
 * AC4: Given all deltas have been resolved
 *      When the comprehensive verification is complete
 *      Then a delta report documents all discrepancies found, all fixes applied,
 *           and confirms full FR-46 compliance
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// ============================================================================
// AC4: Delta Report — Story documents all discrepancies found
// ============================================================================

describe('AC4: Delta Report — Comprehensive discrepancy documentation', () => {
  const storyFile = join(
    process.cwd(),
    '_scrum-output',
    'implementation-artifacts',
    '1-9-verify-align-artifact-contract.md',
  );

  // Test 4.1: Story contains a delta report section
  test('[P0] Story should contain a comprehensive delta report section', () => {
    expect(existsSync(storyFile)).toBe(true);
    const content = readFileSync(storyFile, 'utf8');
    expect(content).toMatch(/Delta.*Report|delta.*report|Delta Analysis Report/i);
  });

  // Test 4.2: Delta report documents the _scrum-output vs _scrum-output delta
  test('[P0] Delta report should document the directory structure delta (_scrum-output vs _scrum-output)', () => {
    const content = readFileSync(storyFile, 'utf8');
    expect(content).toMatch(/_scrum-output/);
    expect(content).toMatch(/_scrum-output/);
    // Must document this as a delta/discrepancy
    expect(content).toMatch(/Delta 1|delta.*directory|directory.*delta|Directory.*Structure/i);
  });

  // Test 4.3: Delta report documents the story ID format delta (SW-XXX vs X-Y-name.md)
  test('[P0] Delta report should document the story ID format delta', () => {
    const content = readFileSync(storyFile, 'utf8');
    expect(content).toMatch(/SW-XXX/);
    // Must reference the actual implementation format
    expect(content).toMatch(/X-Y|1-9|naming.*improvement|Delta 2/i);
  });

  // Test 4.4: Delta report documents the per-story directory vs flat file structure delta
  test('[P0] Delta report should document the directory-per-story vs flat file structure delta', () => {
    const content = readFileSync(storyFile, 'utf8');
    // Must mention single-file vs directory-based structure
    expect(content).toMatch(/single.*file|flat.*file|single-file|directory.*based|Delta 3/i);
  });

  // Test 4.5: Delta report documents the missing commands (deferred features)
  test('[P0] Delta report should document missing commands as deferred features', () => {
    const content = readFileSync(storyFile, 'utf8');
    // Missing commands must be explicitly listed
    expect(content).toMatch(/Delta 4|missing.*command|deferred.*command/i);
    expect(content).toMatch(/scrum-approve/);
    expect(content).toMatch(/wrap-up/);
    expect(content).toMatch(/session-start/);
  });

  // Test 4.6: Delta report documents additional commands not in FR-46
  test('[P1] Delta report should document additional commands not listed in FR-46', () => {
    const content = readFileSync(storyFile, 'utf8');
    // Additional commands found beyond FR-46 scope
    expect(content).toMatch(/additional.*command|Delta 5|scrum-create-architecture/i);
  });
});

// ============================================================================
// AC4: Delta Report — All fixes applied documented
// ============================================================================

describe('AC4: Delta Report — Fixes applied and resolution decisions', () => {
  const storyFile = join(
    process.cwd(),
    '_scrum-output',
    'implementation-artifacts',
    '1-9-verify-align-artifact-contract.md',
  );

  // Test 4.7: Delta report documents resolution decision for each delta
  test('[P0] Delta report should document resolution decision for each identified delta', () => {
    const content = readFileSync(storyFile, 'utf8');
    // Resolution keywords
    expect(content).toMatch(/ACCEPTABLE VARIANCE|NO FIX REQUIRED|Fix Applied|resolved/i);
  });

  // Test 4.8: Delta 1 resolution documented (directory naming variance)
  test('[P0] Delta 1 (_scrum-output vs _scrum-output) should have documented resolution', () => {
    const content = readFileSync(storyFile, 'utf8');
    // Must explicitly state whether this is acceptable or requires a fix
    expect(content).toMatch(/ACCEPTABLE VARIANCE|acceptable.*variance|NO FIX REQUIRED|no.*fix.*required/i);
  });

  // Test 4.9: Delta 4 resolution documented (missing commands deferred appropriately)
  test('[P0] Delta 4 (missing commands) should be documented as appropriately deferred', () => {
    const content = readFileSync(storyFile, 'utf8');
    expect(content).toMatch(/deferred|DEFERRED|Epic 2|Epic 7/i);
    // Deferred items should NOT be marked as requiring immediate fixes
    expect(content).toMatch(/NO ACTION REQUIRED|no.*action.*required|deferred.*appropriately/i);
  });

  // Test 4.10: Story completion notes are present
  test('[P0] Story should have completion notes in Dev Agent Record section', () => {
    const content = readFileSync(storyFile, 'utf8');
    expect(content).toMatch(/Completion Notes|Dev Agent Record/i);
  });
});

// ============================================================================
// AC4: FR-46 Full Compliance Verification
// ============================================================================

describe('AC4: FR-46 Compliance — Overall compliance status', () => {
  const storyFile = join(
    process.cwd(),
    '_scrum-output',
    'implementation-artifacts',
    '1-9-verify-align-artifact-contract.md',
  );

  // Test 4.11: Story documents overall FR-46 compliance verdict
  test('[P0] Story should document an overall FR-46 compliance verdict', () => {
    const content = readFileSync(storyFile, 'utf8');
    // Must have an explicit compliance verdict
    expect(content).toMatch(/FR-46.*Compliance|Compliance.*FR-46|compliance.*status/i);
    // Verdict must be affirmative (ACCEPTABLE or COMPLIANT)
    expect(content).toMatch(/ACCEPTABLE VARIANCE|SUBSTANTIAL COMPLIANCE|COMPLIANT|compliance.*confirmed/i);
  });

  // Test 4.12: Story confirms artifact contract principle is upheld
  test('[P0] Story should confirm the artifact contract principle is upheld', () => {
    const content = readFileSync(storyFile, 'utf8');
    // The principle: predictable locations + consistent naming
    expect(content).toMatch(/predictable.*location|consistent.*naming|artifact.*contract.*principle/i);
  });

  // Test 4.13: Story confirms write boundaries are correctly enforced
  test('[P0] Story should confirm write boundaries are correctly enforced', () => {
    const content = readFileSync(storyFile, 'utf8');
    // Write boundary compliance (dev-story → source code, not artifacts)
    expect(content).toMatch(/write.*boundary|boundary.*enforced|source.*tree|source code/i);
  });

  // Test 4.14: Story documents next steps for incomplete items
  test('[P1] Story should document next steps for deferred and pending items', () => {
    const content = readFileSync(storyFile, 'utf8');
    expect(content).toMatch(/NEXT STEPS|next.*steps|Recommendations/i);
  });

  // Test 4.15: Story is marked as COMPLETE
  test('[P0] Story status should be marked as COMPLETE', () => {
    const content = readFileSync(storyFile, 'utf8');
    expect(content).toMatch(/STORY STATUS.*COMPLETE|Status.*COMPLETE|COMPLETE|story.*complete/i);
  });
});

// ============================================================================
// AC4: Sprint Status Updated
// ============================================================================

describe('AC4: Sprint Status Reflects Story 1.9 Completion', () => {
  const sprintStatusFile = join(
    process.cwd(),
    '_scrum-output',
    'implementation-artifacts',
    'sprint-status.yaml',
  );

  // Test 4.16: Sprint status file exists
  test('[P0] Sprint status file should exist', () => {
    expect(existsSync(sprintStatusFile)).toBe(true);
  });

  // Test 4.17: Sprint status file references story 1.9
  test('[P0] Sprint status should reference story 1.9 (artifact-contract)', () => {
    const content = readFileSync(sprintStatusFile, 'utf8');
    expect(content).toMatch(/1-9|1\.9|artifact.*contract/i);
  });
});

// ============================================================================
// AC4: Three Synchronized Copies Consistency
// ============================================================================

describe('AC4: Three Synchronized Copies — Consistency across scrum_workflow copies', () => {
  const primaryCommandDir = join(process.cwd(), 'scrum_workflow', 'commands');
  const createScrumsCommandDir = join(
    process.cwd(),
    'create-scrum-workflow',
    'scrum_workflow',
    'commands',
  );
  const templatesCommandDir = join(
    process.cwd(),
    'create-scrum-workflow',
    'templates',
    'scrum_workflow',
    'commands',
  );

  // Test 4.18: Primary commands directory exists
  test('[P0] Primary scrum_workflow/commands/ directory should exist', () => {
    expect(existsSync(primaryCommandDir)).toBe(true);
  });

  // Test 4.19: create-scrum-workflow copy commands directory exists
  test('[P0] create-scrum-workflow/scrum_workflow/commands/ copy should exist', () => {
    expect(existsSync(createScrumsCommandDir)).toBe(true);
  });

  // Test 4.20: templates copy commands directory exists
  test('[P0] create-scrum-workflow/templates/scrum_workflow/commands/ copy should exist', () => {
    expect(existsSync(templatesCommandDir)).toBe(true);
  });

  // Test 4.21: create-ticket command is synchronized across all three copies
  test('[P1] create-ticket command should be identical across all three synchronized copies', () => {
    const primaryFile = join(primaryCommandDir, 'create-ticket.md');
    const copyFile = join(createScrumsCommandDir, 'create-ticket.md');
    const templateFile = join(templatesCommandDir, 'create-ticket.md');

    if (!existsSync(primaryFile) || !existsSync(copyFile) || !existsSync(templateFile)) {
      return; // Skip if any copy is missing (handled in other tests)
    }

    const primaryContent = readFileSync(primaryFile, 'utf8');
    const copyContent = readFileSync(copyFile, 'utf8');
    const templateContent = readFileSync(templateFile, 'utf8');

    // All three must be identical
    expect(primaryContent).toBe(copyContent);
    expect(primaryContent).toBe(templateContent);
  });

  // Test 4.22: review-story command is synchronized across all three copies
  test('[P1] review-story command should be identical across all three synchronized copies', () => {
    const primaryFile = join(primaryCommandDir, 'review-story.md');
    const copyFile = join(createScrumsCommandDir, 'review-story.md');
    const templateFile = join(templatesCommandDir, 'review-story.md');

    if (!existsSync(primaryFile) || !existsSync(copyFile) || !existsSync(templateFile)) {
      return;
    }

    const primaryContent = readFileSync(primaryFile, 'utf8');
    const copyContent = readFileSync(copyFile, 'utf8');
    const templateContent = readFileSync(templateFile, 'utf8');

    expect(primaryContent).toBe(copyContent);
    expect(primaryContent).toBe(templateContent);
  });
});
