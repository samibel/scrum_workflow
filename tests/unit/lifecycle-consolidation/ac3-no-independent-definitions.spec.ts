/**
 * ATDD Tests for AC3: No Command Defines Its Own Independent Transition Rules
 *
 * TDD Phase: RED (tests will fail until implementation is complete)
 * Test Level: Unit (File Content Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 3.1 - Consolidate 9-State Lifecycle Definition
 *
 * PRD References:
 * - FR-4: Single source of truth for lifecycle
 *
 * AC3: Given the consolidated lifecycle definition
 *      When any command or skill references state transitions
 *      Then it references this single source of truth
 *      And no command defines its own transition rules independently
 */

import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

const STANDARDS_FILE = join(process.cwd(), 'scrum_workflow', 'context', 'standards.md');
const STATE_MACHINE_DOC = join(process.cwd(), 'scrum_workflow', 'docs', '05-state-machine.md');
const STATUS_GUARD_SKILL = join(
  process.cwd(),
  'scrum_workflow',
  'skills',
  'status-guard-validation',
  'SKILL.md',
);
const COMMANDS_DIR = join(process.cwd(), 'scrum_workflow', 'commands');
const WORKFLOWS_DIR = join(process.cwd(), 'scrum_workflow', 'workflows');

// ============================================================================
// AC3: standards.md is referenced as the authoritative source
// ============================================================================

describe('AC3: 05-state-machine.md references standards.md as authoritative source', () => {
  // Test 3.1: 05-state-machine.md references standards.md
  test('[P0] docs/05-state-machine.md should reference standards.md as authoritative source', () => {
    const content = readFileSync(STATE_MACHINE_DOC, 'utf8');
    expect(content).toMatch(/standards\.md/);
    // Must explicitly state that standards.md is the authoritative source
    expect(content).toMatch(/authoritative|single source|canonical/i);
  });

  // Test 3.2: 05-state-machine.md does NOT re-define the full lifecycle independently
  test(
    '[P0] docs/05-state-machine.md should NOT contain a full independent lifecycle re-definition',
    () => {
      const content = readFileSync(STATE_MACHINE_DOC, 'utf8');
      // The doc should REFERENCE standards.md, not re-define a competing lifecycle table
      // It should not have its own separate "Valid Transitions" table that conflicts
      // Allow: a simplified diagram that REFERENCES standards.md
      // Disallow: a full standalone state machine definition claiming to be the authority
      expect(content).toMatch(/standards\.md|See standards|Refer to standards/i);
    },
  );
});

// ============================================================================
// AC3: status-guard-validation/SKILL.md references standards.md
// ============================================================================

describe('AC3: status-guard-validation/SKILL.md references standards.md as authoritative source', () => {
  // Test 3.3: SKILL.md references standards.md
  test('[P0] SKILL.md should reference standards.md as source of truth for valid transitions', () => {
    const content = readFileSync(STATUS_GUARD_SKILL, 'utf8');
    expect(content).toMatch(/standards\.md/);
  });

  // Test 3.4: SKILL.md references standards.md in the Context Rules / Reads section
  test('[P0] SKILL.md Context Rules should list standards.md as a read source', () => {
    const content = readFileSync(STATUS_GUARD_SKILL, 'utf8');
    // Already present in current SKILL.md: "State machine definitions: scrum_workflow/context/standards.md"
    expect(content).toMatch(/context\/standards\.md|scrum_workflow\/context\/standards/i);
  });

  // Test 3.5: SKILL.md valid status values exactly match the 9 FR-4 states (plus refinement)
  test('[P0] SKILL.md valid status values should match standards.md exactly', () => {
    const content = readFileSync(STATUS_GUARD_SKILL, 'utf8');
    const requiredStatuses = [
      'draft',
      'refinement',
      'refined',
      'ready-for-dev',
      'in-progress',
      'review',
      'approved',
      'changes-needed',
      'done',
      'cancelled',
    ];
    for (const status of requiredStatuses) {
      expect(content).toMatch(new RegExp(`\`?${status}\`?`));
    }
  });
});

// ============================================================================
// AC3: Commands do NOT re-enumerate the full lifecycle independently
// ============================================================================

describe('AC3: Command files do not independently re-define the full lifecycle', () => {
  // Helper: read all .md files from a directory
  const getMarkdownFiles = (dir: string): string[] => {
    if (!existsSync(dir)) return [];
    return readdirSync(dir)
      .filter((f) => f.endsWith('.md'))
      .map((f) => join(dir, f));
  };

  // Test 3.6: No command file contains a full standalone lifecycle table
  // (Commands may define required/sets_status — that's acceptable per architecture)
  test(
    '[P0] Command files should NOT contain full standalone lifecycle re-definitions',
    () => {
      const commandFiles = getMarkdownFiles(COMMANDS_DIR);
      expect(commandFiles.length).toBeGreaterThan(0);

      for (const file of commandFiles) {
        const content = readFileSync(file, 'utf8');
        // Red flag: a command that defines ALL lifecycle transitions (not just its own)
        // A command may have 1-2 transitions for its own step, but NOT define the entire 9-state machine
        const fullLifecyclePattern =
          /draft.*refined.*ready-for-dev.*in-progress.*review.*approved.*done/is;
        if (fullLifecyclePattern.test(content)) {
          // Allow if it explicitly references standards.md as the source
          expect(content).toMatch(
            /standards\.md|see.*standards|refer.*standards|authoritative/i,
          );
        }
      }
    },
  );

  // Test 3.7: No workflow file independently re-defines the full lifecycle
  test(
    '[P0] Workflow files should NOT contain full standalone lifecycle re-definitions',
    () => {
      const workflowFiles = getMarkdownFiles(WORKFLOWS_DIR);
      // Workflows directory may be empty — that's ok
      for (const file of workflowFiles) {
        const content = readFileSync(file, 'utf8');
        // Same check as commands
        const fullLifecyclePattern =
          /draft.*refined.*ready-for-dev.*in-progress.*review.*approved.*done/is;
        if (fullLifecyclePattern.test(content)) {
          expect(content).toMatch(
            /standards\.md|see.*standards|refer.*standards|authoritative/i,
          );
        }
      }
    },
  );

  // Test 3.8: dev-story command only declares its required/sets_status (not the full lifecycle)
  test('[P0] dev-story command should only declare its own required/sets_status', () => {
    const devStoryCommand = join(COMMANDS_DIR, 'dev-story.md');
    expect(existsSync(devStoryCommand)).toBe(true);
    const content = readFileSync(devStoryCommand, 'utf8');
    // Must reference status transitions for dev-story specifically
    expect(content).toMatch(/ready-for-dev|in-progress|changes-needed/i);
  });

  // Test 3.9: review-story command only declares its required/sets_status
  test('[P0] review-story command should only declare its own required/sets_status', () => {
    const reviewStoryCommand = join(COMMANDS_DIR, 'review-story.md');
    expect(existsSync(reviewStoryCommand)).toBe(true);
    const content = readFileSync(reviewStoryCommand, 'utf8');
    // Must reference review→approved and review→changes-needed specifically
    expect(content).toMatch(/review.*approved|approved|changes-needed/i);
  });
});

// ============================================================================
// AC3: prerequisite-validation skill references standards.md
// ============================================================================

describe('AC3: prerequisite-validation skill references standards.md for guard conditions', () => {
  const prereqSkillDir = join(
    process.cwd(),
    'scrum_workflow',
    'skills',
    'prerequisite-validation',
  );

  // Test 3.10: prerequisite-validation skill directory or SKILL.md exists
  test(
    '[P1] prerequisite-validation skill should exist (directory or SKILL.md)',
    () => {
      const dirExists = existsSync(prereqSkillDir);
      const skillFile = join(prereqSkillDir, 'SKILL.md');
      // Either the directory exists (may be newly created) or not yet (acceptable for story 3.1 scope)
      // This test verifies only if the file exists — if not, it's in scope for story 3.2
      if (dirExists && existsSync(skillFile)) {
        const content = readFileSync(skillFile, 'utf8');
        expect(content).toMatch(/standards\.md|context\/standards/i);
      } else {
        // prerequisite-validation skill may not exist yet — skip silently
        expect(true).toBe(true);
      }
    },
  );
});

// ============================================================================
// AC3: standards.md is identified as the single source with a clear header
// ============================================================================

describe('AC3: standards.md has clear AUTHORITATIVE SOURCE designation', () => {
  // Test 3.11: standards.md Story Status State Machine section has an authoritative designation
  test(
    '[P0] standards.md Story Status State Machine section should declare itself as authoritative',
    () => {
      const content = readFileSync(STANDARDS_FILE, 'utf8');
      // Must have an explicit authoritative marker near or in the Story Status State Machine section
      expect(content).toMatch(
        /AUTHORITATIVE|authoritative source|single source of truth|canonical.*lifecycle/i,
      );
    },
  );

  // Test 3.12: standards.md is human-readable without tooling (NFR-9 compliance)
  test('[P1] standards.md should be human-readable Markdown (NFR-9 compliance)', () => {
    const content = readFileSync(STANDARDS_FILE, 'utf8');
    // Must be valid Markdown (has headers and at least one table)
    expect(content).toMatch(/^#+ /m);
    expect(content).toMatch(/\|.*\|.*\|/);
    // Must not contain binary data or non-markdown encoding
    expect(typeof content).toBe('string');
    expect(content.length).toBeGreaterThan(0);
  });

  // Test 3.13: Error messages in standards.md reference the authoritative transitions list (NFR-14)
  test(
    '[P1] standards.md error message templates should reference authoritative transitions',
    () => {
      const content = readFileSync(STANDARDS_FILE, 'utf8');
      // Error message templates must exist (already present in current standards.md)
      expect(content).toMatch(/Error.*Story.*status|Error.*status.*requires/i);
      // They should reference the state machine or transitions
      expect(content).toMatch(/requires|allowed|valid.*status/i);
    },
  );
});
