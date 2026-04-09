/**
 * ATDD Tests for AC2: All Commands Include Actionable Next Step in Success Messages
 *
 * TDD Phase: RED (tests written before implementation -- will pass after implementation)
 * Test Level: Unit (File Content Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 6.5 - Implement Success Messages & Next-Step Guidance
 *
 * PRD References:
 * - UX-DR14: Actionable next step in all success messages
 * - UX-DR9: Single line per message
 * - UX-DR13: Consistent color coding
 * - UX-DR15: Consistent emoji prefixes
 *
 * AC2: Given UX-DR14 specifies actionable next step in all success messages
 *      When any command completes successfully
 *      Then the success message includes what to do next
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const CREATE_SCRUM_WORKFLOW_ROOT = join(process.cwd(), 'create-scrum-workflow');
const INSTALL_CMD_PATH = join(CREATE_SCRUM_WORKFLOW_ROOT, 'src', 'commands', 'install.js');
const UPDATE_CMD_PATH = join(CREATE_SCRUM_WORKFLOW_ROOT, 'src', 'commands', 'update.js');
const VALIDATE_CMD_PATH = join(CREATE_SCRUM_WORKFLOW_ROOT, 'src', 'commands', 'validate.js');
const STATUS_CMD_PATH = join(CREATE_SCRUM_WORKFLOW_ROOT, 'src', 'commands', 'status.js');
const NEXT_STEPS_MODULE_PATH = join(CREATE_SCRUM_WORKFLOW_ROOT, 'src', 'core', 'next-steps.js');

const TEMPLATE_UPDATE_CMD_PATH = join(CREATE_SCRUM_WORKFLOW_ROOT, 'templates', 'src', 'commands', 'update.js');
const TEMPLATE_VALIDATE_CMD_PATH = join(CREATE_SCRUM_WORKFLOW_ROOT, 'templates', 'src', 'commands', 'validate.js');
const TEMPLATE_STATUS_CMD_PATH = join(CREATE_SCRUM_WORKFLOW_ROOT, 'templates', 'src', 'commands', 'status.js');

// ============================================================================
// AC2: Update Command Next-Step Integration
// ============================================================================

describe('AC2: Update Command Next-Step', () => {
  // Test 1.1: update.js should import next-steps module
  test('[P0] update.js should import from next-steps module', () => {
    const content = readFileSync(UPDATE_CMD_PATH, 'utf8');
    expect(content).toMatch(/import.*next-steps|from.*next-steps/);
  });

  // Test 1.2: update.js should call getNextStep for update command
  test('[P0] update.js should call getNextStep with update command', () => {
    const content = readFileSync(UPDATE_CMD_PATH, 'utf8');
    expect(content).toMatch(/getNextStep\s*\(\s*['"]update['"]/);
  });

  // Test 1.3: update.js should include actionable next-step in success output
  test('[P0] update.js should include actionable guidance after update completes', () => {
    const content = readFileSync(UPDATE_CMD_PATH, 'utf8');
    // Should use outro with next-step message (not bare 'Update complete!')
    expect(content).toMatch(/outro\s*\(/);
    // The bare outro should be replaced with one that has guidance
    // Should NOT have bare "Update complete!" without next-step
    expect(content).not.toMatch(/outro\s*\(\s*['"]Update complete!['"]\s*\)/);
  });

  // Test 1.4: update.js success message should be actionable (UX-DR14)
  test('[P0] update.js success should suggest a concrete next action', () => {
    const content = readFileSync(UPDATE_CMD_PATH, 'utf8');
    // Should mention what to do next (e.g., scrum-create-ticket or review changes)
    expect(content).toMatch(/scrum-create-ticket|review|changelog|Next:|Next step/i);
  });

  // Test 1.5: update.js should use outro() for final message
  test('[P0] update.js should use outro() for final success message', () => {
    const content = readFileSync(UPDATE_CMD_PATH, 'utf8');
    expect(content).toMatch(/outro\s*\(/);
  });

  // Test 1.6: update.js template should exist and be synced
  test('[P1] Updated update.js template should exist', () => {
    expect(existsSync(TEMPLATE_UPDATE_CMD_PATH)).toBe(true);
  });
});

// ============================================================================
// AC2: Validate Command Next-Step Integration
// ============================================================================

describe('AC2: Validate Command Next-Step', () => {
  // Test 2.1: validate.js should import next-steps module
  test('[P0] validate.js should import from next-steps module', () => {
    const content = readFileSync(VALIDATE_CMD_PATH, 'utf8');
    expect(content).toMatch(/import.*next-steps|from.*next-steps/);
  });

  // Test 2.2: validate.js should call getNextStep for validate command
  test('[P0] validate.js should call getNextStep with validate command', () => {
    const content = readFileSync(VALIDATE_CMD_PATH, 'utf8');
    expect(content).toMatch(/getNextStep\s*\(\s*['"]validate['"]/);
  });

  // Test 2.3: validate.js should have success next-step message (currently missing)
  test('[P0] validate.js should output next-step after successful validation', () => {
    const content = readFileSync(VALIDATE_CMD_PATH, 'utf8');
    // Should have an outro or next-step call in the success path
    expect(content).toMatch(/outro\s*\(|getNextStep.*validate/);
  });

  // Test 2.4: validate.js should provide different next-steps for success vs failure
  test('[P1] validate.js should provide contextual next-step based on validation result', () => {
    const content = readFileSync(VALIDATE_CMD_PATH, 'utf8');
    // The next-step should differ based on whether there are errors
    expect(content).toMatch(/hasErrors|errors\.length|context\s*\{/);
  });

  // Test 2.5: validate.js template should exist and be synced
  test('[P1] Updated validate.js template should exist', () => {
    expect(existsSync(TEMPLATE_VALIDATE_CMD_PATH)).toBe(true);
  });
});

// ============================================================================
// AC2: Status Command Next-Step Integration
// ============================================================================

describe('AC2: Status Command Next-Step', () => {
  // Test 3.1: status.js should import next-steps module
  test('[P0] status.js should import from next-steps module', () => {
    const content = readFileSync(STATUS_CMD_PATH, 'utf8');
    expect(content).toMatch(/import.*next-steps|from.*next-steps/);
  });

  // Test 3.2: status.js should call getNextStep for status command
  test('[P0] status.js should call getNextStep with status command', () => {
    const content = readFileSync(STATUS_CMD_PATH, 'utf8');
    expect(content).toMatch(/getNextStep\s*\(\s*['"]status['"]/);
  });

  // Test 3.3: status.js should have success next-step message (currently missing)
  test('[P0] status.js should output next-step after status display', () => {
    const content = readFileSync(STATUS_CMD_PATH, 'utf8');
    // Should have an outro or next-step call at the end of the function
    expect(content).toMatch(/outro\s*\(|getNextStep.*status/);
  });

  // Test 3.4: status.js should provide contextual next-step based on issues
  test('[P1] status.js should provide different next-step based on detected issues', () => {
    const content = readFileSync(STATUS_CMD_PATH, 'utf8');
    // Should detect whether there are issues (modified/missing files)
    expect(content).toMatch(/hasIssues|modified\.length|missing\.length|context\s*\{/);
  });

  // Test 3.5: status.js template should exist and be synced
  test('[P1] Updated status.js template should exist', () => {
    expect(existsSync(TEMPLATE_STATUS_CMD_PATH)).toBe(true);
  });
});

// ============================================================================
// AC2: Next-Step Module Content Validation
// ============================================================================

describe('AC2: Next-Step Module Context-Aware Messages', () => {
  // Test 4.1: next-steps.js install step should mention scrum-create-ticket
  test('[P0] Next-step for install should mention scrum-create-ticket', () => {
    if (!existsSync(NEXT_STEPS_MODULE_PATH)) {
      // Module doesn't exist yet -- will fail (RED phase)
      expect(existsSync(NEXT_STEPS_MODULE_PATH)).toBe(true);
      return;
    }
    const content = readFileSync(NEXT_STEPS_MODULE_PATH, 'utf8');
    // Install step should guide user to create their first ticket
    expect(content).toMatch(/scrum-create-ticket.*your feature description/);
  });

  // Test 4.2: next-steps.js update step should have contextual guidance
  test('[P1] Next-step for update should support context-aware messages', () => {
    if (!existsSync(NEXT_STEPS_MODULE_PATH)) {
      expect(existsSync(NEXT_STEPS_MODULE_PATH)).toBe(true);
      return;
    }
    const content = readFileSync(NEXT_STEPS_MODULE_PATH, 'utf8');
    // Should check for context.hasFlaggedStories or similar
    expect(content).toMatch(/hasFlaggedStories|flagged|context\./);
  });

  // Test 4.3: next-steps.js validate step should have contextual guidance
  test('[P1] Next-step for validate should support context-aware messages', () => {
    if (!existsSync(NEXT_STEPS_MODULE_PATH)) {
      expect(existsSync(NEXT_STEPS_MODULE_PATH)).toBe(true);
      return;
    }
    const content = readFileSync(NEXT_STEPS_MODULE_PATH, 'utf8');
    // Should check for context.hasErrors or similar
    expect(content).toMatch(/hasErrors|errors|context\./);
  });

  // Test 4.4: next-steps.js status step should have contextual guidance
  test('[P1] Next-step for status should support context-aware messages', () => {
    if (!existsSync(NEXT_STEPS_MODULE_PATH)) {
      expect(existsSync(NEXT_STEPS_MODULE_PATH)).toBe(true);
      return;
    }
    const content = readFileSync(NEXT_STEPS_MODULE_PATH, 'utf8');
    // Should check for context.hasIssues or similar
    expect(content).toMatch(/hasIssues|issues|context\./);
  });

  // Test 4.5: next-steps.js should have a default fallback message
  test('[P1] getNextStep should have default fallback for unknown commands', () => {
    if (!existsSync(NEXT_STEPS_MODULE_PATH)) {
      expect(existsSync(NEXT_STEPS_MODULE_PATH)).toBe(true);
      return;
    }
    const content = readFileSync(NEXT_STEPS_MODULE_PATH, 'utf8');
    // Should have a fallback for unknown commands
    expect(content).toMatch(/default|--help|available commands/);
  });
});

// ============================================================================
// AC2: Consistency Across All Commands
// ============================================================================

describe('AC2: Cross-Command Consistency', () => {
  // Test 5.1: All commands should import output module for consistent formatting
  test('[P0] All commands should import output module', () => {
    const commands = [INSTALL_CMD_PATH, UPDATE_CMD_PATH, VALIDATE_CMD_PATH, STATUS_CMD_PATH];
    for (const cmdPath of commands) {
      const content = readFileSync(cmdPath, 'utf8');
      expect(content).toMatch(/import.*output|from.*output/);
    }
  });

  // Test 5.2: All commands should import from next-steps module
  test('[P0] All four commands should import from next-steps module', () => {
    const commands = [INSTALL_CMD_PATH, UPDATE_CMD_PATH, VALIDATE_CMD_PATH, STATUS_CMD_PATH];
    for (const cmdPath of commands) {
      const content = readFileSync(cmdPath, 'utf8');
      expect(content).toMatch(/import.*next-steps|from.*next-steps/);
    }
  });

  // Test 5.3: Success messages should use output.success() or outro() consistently
  test('[P1] All commands should use either output.success() or outro() for final message', () => {
    const commands = [INSTALL_CMD_PATH, UPDATE_CMD_PATH, VALIDATE_CMD_PATH, STATUS_CMD_PATH];
    for (const cmdPath of commands) {
      const content = readFileSync(cmdPath, 'utf8');
      expect(content).toMatch(/outro\s*\(|output\.success\s*\(/);
    }
  });

  // Test 5.4: No command should use bare console.log for final success message
  test('[P1] No command should use bare console.log for success messages', () => {
    const commands = [INSTALL_CMD_PATH, UPDATE_CMD_PATH, VALIDATE_CMD_PATH, STATUS_CMD_PATH];
    for (const cmdPath of commands) {
      const content = readFileSync(cmdPath, 'utf8');
      // Should NOT have bare console.log('✓' or console.log('Success')
      expect(content).not.toMatch(/console\.log\s*\(\s*['"`]✓|console\.log\s*\(\s*['"`]Success/);
    }
  });
});
