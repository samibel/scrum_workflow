/**
 * ATDD Tests for AC2: Artifact Location Compliance per FR-46
 *
 * TDD Phase: RED (tests will fail until feature is verified)
 * Test Level: Unit + Integration (File System Validation + Command Spec Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 1.9 - Verify & Align Artifact Contract
 *
 * PRD References:
 * - FR-46: Every slash-command that produces an artifact must generate it in a predictable
 *   location with consistent naming convention.
 *
 * AC2: Given FR-46 specifies exact artifact locations for all commands
 *      When all commands have been executed
 *      Then every command's output artifact exists at its specified path with correct naming:
 *        - story.md in _scrum-output/sprints/SW-XXX/
 *        - refinement.md in _scrum-output/sprints/SW-XXX/
 *        - plan.md in _scrum-output/sprints/SW-XXX/
 *        - review-N.md in _scrum-output/sprints/SW-XXX/
 *        - approval-N.md in _scrum-output/sprints/SW-XXX/
 *        - RR-XXX.md in _scrum-output/memory/research/
 *        - session-summary.md in _scrum-output/memory/sessions/
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// ============================================================================
// AC2: Command Specification Files Reference Correct Output Paths
// ============================================================================

describe('AC2: /scrum-create-ticket — story.md artifact specification', () => {
  const commandFile = join(process.cwd(), 'scrum_workflow', 'commands', 'create-ticket.md');
  const workflowFile = join(process.cwd(), 'scrum_workflow', 'workflows', 'ticket-creation.md');

  // Test 2.1: create-ticket command file exists
  test('[P0] create-ticket command file should exist', () => {
    expect(existsSync(commandFile)).toBe(true);
  });

  // Test 2.2: create-ticket command specifies story.md output
  test('[P0] create-ticket command should specify story.md as output artifact', () => {
    const content = readFileSync(commandFile, 'utf8');
    expect(content).toMatch(/story\.md/);
  });

  // Test 2.3: create-ticket command specifies correct output directory
  test('[P0] create-ticket command should specify _scrum-output/sprints/SW-XXX/ as output location', () => {
    const content = readFileSync(commandFile, 'utf8');
    expect(content).toMatch(/_scrum-output\/sprints\/SW-XXX|_scrum-output.*sprints/);
  });

  // Test 2.4: ticket-creation workflow references correct output directory
  test('[P0] ticket-creation workflow should reference _scrum-output/sprints/ directory', () => {
    expect(existsSync(workflowFile)).toBe(true);
    const content = readFileSync(workflowFile, 'utf8');
    expect(content).toMatch(/_scrum-output\/sprints/);
  });

  // Test 2.5: create-ticket command documents YAML frontmatter requirements
  test('[P1] create-ticket command should document required YAML frontmatter fields', () => {
    const content = readFileSync(commandFile, 'utf8');
    // Must specify required frontmatter fields
    expect(content).toMatch(/schema_version/);
    expect(content).toMatch(/ticket/);
    expect(content).toMatch(/status/);
  });
});

describe('AC2: /scrum-refine-ticket — refinement.md artifact specification', () => {
  const commandFile = join(process.cwd(), 'scrum_workflow', 'commands', 'refine-ticket.md');
  const workflowFile = join(process.cwd(), 'scrum_workflow', 'workflows', 'refinement.md');

  // Test 2.6: refine-ticket command file exists
  test('[P0] refine-ticket command file should exist', () => {
    expect(existsSync(commandFile)).toBe(true);
  });

  // Test 2.7: refine-ticket workflow file exists
  test('[P0] refinement workflow file should exist', () => {
    expect(existsSync(workflowFile)).toBe(true);
  });

  // Test 2.8: refinement workflow references _scrum-output/sprints/
  test('[P0] refinement workflow should reference _scrum-output/sprints/ as output location', () => {
    const content = readFileSync(workflowFile, 'utf8');
    expect(content).toMatch(/_scrum-output\/sprints|_scrum-output.*sprint/);
  });
});

describe('AC2: /scrum-refine-story — plan.md artifact specification', () => {
  const commandFile = join(process.cwd(), 'scrum_workflow', 'commands', 'refine-story.md');
  const workflowFile = join(process.cwd(), 'scrum_workflow', 'workflows', 'readiness-check.md');

  // Test 2.9: refine-story command file exists
  test('[P0] refine-story command file should exist', () => {
    expect(existsSync(commandFile)).toBe(true);
  });

  // Test 2.10: readiness-check workflow file exists
  test('[P0] readiness-check workflow file should exist', () => {
    expect(existsSync(workflowFile)).toBe(true);
  });
});

describe('AC2: /scrum-dev-story — source code write boundary', () => {
  const commandFile = join(process.cwd(), 'scrum_workflow', 'commands', 'dev-story.md');
  const workflowFile = join(process.cwd(), 'scrum_workflow', 'workflows', 'development.md');

  // Test 2.11: dev-story command file exists
  test('[P0] dev-story command file should exist', () => {
    expect(existsSync(commandFile)).toBe(true);
  });

  // Test 2.12: development workflow file exists
  test('[P0] development workflow file should exist', () => {
    expect(existsSync(workflowFile)).toBe(true);
  });

  // Test 2.13: dev-story command does NOT create new sprint artifact files
  test('[P0] dev-story command should NOT create artifacts in _scrum-output/sprints/ (source code only)', () => {
    expect(existsSync(commandFile)).toBe(true);
    const content = readFileSync(commandFile, 'utf8');
    // dev-story writes source code, not sprint artifacts
    // It should NOT create refinement.md or plan.md (those are created by other commands)
    // Note: dev-story is permitted to UPDATE story.md status (in-progress/review), but not CREATE new sprint artifacts
    expect(content).not.toMatch(/creates.*refinement\.md|creates.*plan\.md|Output.*NEW.*refinement|Output.*NEW.*plan/i);
    // Verify it does produce source code output (not just sprint artifacts)
    expect(content).toMatch(/code.*changes|implemented.*code|source.*code|project.*director/i);
  });

  // Test 2.14: development workflow specifies source code as output (not sprint artifacts)
  test('[P0] development workflow should reference source code as output (not sprint artifacts)', () => {
    const content = readFileSync(workflowFile, 'utf8');
    // Must reference source code output
    expect(content).toMatch(/source.*code|implementation|code.*changes/i);
  });
});

describe('AC2: /scrum-review-story — review-N.md artifact specification', () => {
  const commandFile = join(process.cwd(), 'scrum_workflow', 'commands', 'review-story.md');
  const workflowFile = join(process.cwd(), 'scrum_workflow', 'workflows', 'review-story.md');

  // Test 2.15: review-story command file exists
  test('[P0] review-story command file should exist', () => {
    expect(existsSync(commandFile)).toBe(true);
  });

  // Test 2.16: review-story workflow file exists
  test('[P0] review-story workflow file should exist', () => {
    expect(existsSync(workflowFile)).toBe(true);
  });

  // Test 2.17: review-story command references review-N.md naming
  test('[P0] review-story command should reference review-N.md naming convention', () => {
    const content = readFileSync(commandFile, 'utf8');
    expect(content).toMatch(/review-N\.md|review-\{N\}\.md|review-1\.md/);
  });

  // Test 2.18: review-story command specifies _scrum-output/sprints/ as output
  test('[P0] review-story command should specify _scrum-output/sprints/SW-XXX/ as output location', () => {
    const content = readFileSync(commandFile, 'utf8');
    expect(content).toMatch(/_scrum-output\/sprints/);
  });
});

describe('AC2: /scrum-research-* — RR-XXX.md artifact specification', () => {
  const technicalCommandFile = join(process.cwd(), 'scrum_workflow', 'commands', 'research-technical.md');
  const generalCommandFile = join(process.cwd(), 'scrum_workflow', 'commands', 'research-general.md');
  const technicalWorkflowFile = join(process.cwd(), 'scrum_workflow', 'workflows', 'research-technical.md');

  // Test 2.19: research-technical command file exists
  test('[P0] research-technical command file should exist', () => {
    expect(existsSync(technicalCommandFile)).toBe(true);
  });

  // Test 2.20: research-general command file exists
  test('[P0] research-general command file should exist', () => {
    expect(existsSync(generalCommandFile)).toBe(true);
  });

  // Test 2.21: research-technical command references RR-XXX.md naming
  test('[P0] research-technical command should reference RR-XXX.md naming convention', () => {
    const content = readFileSync(technicalCommandFile, 'utf8');
    expect(content).toMatch(/RR-XXX\.md|RR-\d{3}\.md/);
  });

  // Test 2.22: research-technical command references _scrum-output/memory/research/ location
  test('[P0] research-technical command should reference _scrum-output/memory/research/ as output location', () => {
    const content = readFileSync(technicalCommandFile, 'utf8');
    expect(content).toMatch(/_scrum-output\/memory\/research/);
  });

  // Test 2.23: research-general command references _scrum-output/memory/research/ location
  test('[P0] research-general command should reference _scrum-output/memory/research/ as output location', () => {
    const content = readFileSync(generalCommandFile, 'utf8');
    expect(content).toMatch(/_scrum-output\/memory\/research/);
  });

  // Test 2.24: research-technical workflow references correct output path
  test('[P0] research-technical workflow should reference _scrum-output/memory/research/ as output path', () => {
    expect(existsSync(technicalWorkflowFile)).toBe(true);
    const content = readFileSync(technicalWorkflowFile, 'utf8');
    expect(content).toMatch(/_scrum-output\/memory\/research/);
  });
});

describe('AC2: Deferred Commands — /scrum-approve, /wrap-up, /session-start', () => {
  const storyFile = join(
    process.cwd(),
    '_scrum-output',
    'implementation-artifacts',
    '1-9-verify-align-artifact-contract.md',
  );

  // Test 2.25: Story documents /scrum-approve as deferred (Epic 2)
  test('[P0] Story should document /scrum-approve as deferred to Epic 2', () => {
    const content = readFileSync(storyFile, 'utf8');
    expect(content).toMatch(/scrum-approve/);
    expect(content).toMatch(/Epic 2|deferred|NOT IMPLEMENTED|not.*implemented/i);
  });

  // Test 2.26: Story documents /wrap-up as deferred (Epic 7)
  test('[P0] Story should document /wrap-up as deferred to Epic 7', () => {
    const content = readFileSync(storyFile, 'utf8');
    expect(content).toMatch(/wrap-up/);
    expect(content).toMatch(/Epic 7|deferred|NOT IMPLEMENTED|not.*implemented/i);
  });

  // Test 2.27: Story documents /session-start as deferred (Epic 7)
  test('[P0] Story should document /session-start as deferred to Epic 7', () => {
    const content = readFileSync(storyFile, 'utf8');
    expect(content).toMatch(/session-start/);
    expect(content).toMatch(/Epic 7|deferred|NOT IMPLEMENTED|not.*implemented/i);
  });
});

describe('AC2: _scrum-output Directory Structure Verification', () => {
  const scrumOutputDir = join(process.cwd(), '_scrum-output');
  const researchDir = join(process.cwd(), '_scrum-output', 'memory', 'research');

  // Test 2.28: _scrum-output root directory exists
  test('[P0] _scrum-output directory should exist at project root', () => {
    expect(existsSync(scrumOutputDir)).toBe(true);
  });

  // Test 2.29: _scrum-output/memory/research/ directory exists (for RR-XXX.md artifacts)
  test('[P0] _scrum-output/memory/research/ directory should exist', () => {
    expect(existsSync(researchDir)).toBe(true);
  });
});
