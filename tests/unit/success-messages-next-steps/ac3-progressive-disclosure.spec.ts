/**
 * ATDD Tests for AC3: Progressive Disclosure -- Advanced Options Hidden from Primary Output
 *
 * TDD Phase: RED (tests written before implementation -- will pass after implementation)
 * Test Level: Unit (File Content Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 6.5 - Implement Success Messages & Next-Step Guidance
 *
 * PRD References:
 * - UX-DR3: Progressive disclosure -- advanced options only for power users
 * - UX-DR9: Single line per message
 *
 * AC3: Given UX-DR3 specifies progressive disclosure for advanced options
 *      When the default flow completes
 *      Then advanced options (--platform, --depth) are not mentioned in the primary output
 *      And they are only documented in help text (--help)
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const CREATE_SCRUM_WORKFLOW_ROOT = join(process.cwd(), 'create-scrum-workflow');
const INSTALL_CMD_PATH = join(CREATE_SCRUM_WORKFLOW_ROOT, 'src', 'commands', 'install.js');
const UPDATE_CMD_PATH = join(CREATE_SCRUM_WORKFLOW_ROOT, 'src', 'commands', 'update.js');
const VALIDATE_CMD_PATH = join(CREATE_SCRUM_WORKFLOW_ROOT, 'src', 'commands', 'validate.js');
const STATUS_CMD_PATH = join(CREATE_SCRUM_WORKFLOW_ROOT, 'src', 'commands', 'status.js');
const NEXT_STEPS_MODULE_PATH = join(CREATE_SCRUM_WORKFLOW_ROOT, 'src', 'core', 'next-steps.js');
const CONFIG_BUILDER_PATH = join(CREATE_SCRUM_WORKFLOW_ROOT, 'src', 'core', 'config-builder.js');
const INSTALLER_PATH = join(CREATE_SCRUM_WORKFLOW_ROOT, 'src', 'core', 'installer.js');
const BIN_PATH = join(CREATE_SCRUM_WORKFLOW_ROOT, 'bin', 'create-scrum-workflow.js');

// ============================================================================
// AC3: Success Messages Must Not Mention Advanced Flags
// ============================================================================

describe('AC3: No Advanced Flags in Success Messages', () => {
  // Test 1.1: install.js success message should NOT mention --platform
  test('[P0] install.js success path should not mention --platform flag', () => {
    const content = readFileSync(INSTALL_CMD_PATH, 'utf8');
    // Extract success/outro messages and check they don't mention advanced flags
    const outroSection = content.match(/outro\s*\([^)]*\)/g) || [];
    const successSection = content.match(/output\.success\s*\([^)]*\)/g) || [];
    const combinedMessages = [...outroSection, ...successSection].join(' ');
    expect(combinedMessages).not.toMatch(/--platform/);
  });

  // Test 1.2: install.js success message should NOT mention --depth
  test('[P0] install.js success path should not mention --depth flag', () => {
    const content = readFileSync(INSTALL_CMD_PATH, 'utf8');
    const outroSection = content.match(/outro\s*\([^)]*\)/g) || [];
    const successSection = content.match(/output\.success\s*\([^)]*\)/g) || [];
    const combinedMessages = [...outroSection, ...successSection].join(' ');
    expect(combinedMessages).not.toMatch(/--depth/);
  });

  // Test 1.3: update.js success message should NOT mention --platform
  test('[P0] update.js success path should not mention --platform flag', () => {
    const content = readFileSync(UPDATE_CMD_PATH, 'utf8');
    const outroSection = content.match(/outro\s*\([^)]*\)/g) || [];
    const successSection = content.match(/output\.success\s*\([^)]*\)/g) || [];
    const combinedMessages = [...outroSection, ...successSection].join(' ');
    expect(combinedMessages).not.toMatch(/--platform/);
  });

  // Test 1.4: update.js success message should NOT mention --dry-run in success
  test('[P0] update.js success path should not mention --dry-run in success message', () => {
    const content = readFileSync(UPDATE_CMD_PATH, 'utf8');
    const outroSection = content.match(/outro\s*\([^)]*\)/g) || [];
    const successSection = content.match(/output\.success\s*\([^)]*\)/g) || [];
    const combinedMessages = [...outroSection, ...successSection].join(' ');
    expect(combinedMessages).not.toMatch(/--dry-run/);
  });

  // Test 1.5: validate.js success message should NOT mention advanced flags
  test('[P0] validate.js success path should not mention --platform or --depth', () => {
    const content = readFileSync(VALIDATE_CMD_PATH, 'utf8');
    const outroSection = content.match(/outro\s*\([^)]*\)/g) || [];
    const successSection = content.match(/output\.success\s*\([^)]*\)/g) || [];
    const combinedMessages = [...outroSection, ...successSection].join(' ');
    expect(combinedMessages).not.toMatch(/--platform|--depth/);
  });

  // Test 1.6: status.js success message should NOT mention advanced flags
  test('[P0] status.js success path should not mention --platform or --depth', () => {
    const content = readFileSync(STATUS_CMD_PATH, 'utf8');
    const outroSection = content.match(/outro\s*\([^)]*\)/g) || [];
    const successSection = content.match(/output\.success\s*\([^)]*\)/g) || [];
    const combinedMessages = [...outroSection, ...successSection].join(' ');
    expect(combinedMessages).not.toMatch(/--platform|--depth/);
  });
});

// ============================================================================
// AC3: Next-Step Module Must Not Mention Advanced Flags
// ============================================================================

describe('AC3: Next-Step Module Progressive Disclosure', () => {
  // Test 2.1: next-steps.js should NOT mention --platform in any message
  test('[P0] next-steps.js should not mention --platform in any next-step message', () => {
    if (!existsSync(NEXT_STEPS_MODULE_PATH)) {
      expect(existsSync(NEXT_STEPS_MODULE_PATH)).toBe(true);
      return;
    }
    const content = readFileSync(NEXT_STEPS_MODULE_PATH, 'utf8');
    expect(content).not.toMatch(/--platform/);
  });

  // Test 2.2: next-steps.js should NOT mention --depth in any message
  test('[P0] next-steps.js should not mention --depth in any next-step message', () => {
    if (!existsSync(NEXT_STEPS_MODULE_PATH)) {
      expect(existsSync(NEXT_STEPS_MODULE_PATH)).toBe(true);
      return;
    }
    const content = readFileSync(NEXT_STEPS_MODULE_PATH, 'utf8');
    expect(content).not.toMatch(/--depth/);
  });

  // Test 2.3: next-steps.js should NOT mention --yes in any message
  test('[P1] next-steps.js should not mention --yes in any next-step message', () => {
    if (!existsSync(NEXT_STEPS_MODULE_PATH)) {
      expect(existsSync(NEXT_STEPS_MODULE_PATH)).toBe(true);
      return;
    }
    const content = readFileSync(NEXT_STEPS_MODULE_PATH, 'utf8');
    expect(content).not.toMatch(/--yes/);
  });

  // Test 2.4: next-steps.js should NOT mention --dry-run in any message
  test('[P1] next-steps.js should not mention --dry-run in any next-step message', () => {
    if (!existsSync(NEXT_STEPS_MODULE_PATH)) {
      expect(existsSync(NEXT_STEPS_MODULE_PATH)).toBe(true);
      return;
    }
    const content = readFileSync(NEXT_STEPS_MODULE_PATH, 'utf8');
    expect(content).not.toMatch(/--dry-run/);
  });
});

// ============================================================================
// AC3: Config-Builder Zero-Config Output Must Not Mention Advanced Flags
// ============================================================================

describe('AC3: Config-Builder Zero-Config Progressive Disclosure', () => {
  // Test 3.1: config-builder.js --yes path should not mention --platform
  test('[P0] config-builder.js --yes output should not mention --platform', () => {
    const content = readFileSync(CONFIG_BUILDER_PATH, 'utf8');
    // Find the --yes section and verify it doesn't mention --platform in output
    const yesSection = content.match(/options\.yes[^}]*}/s);
    if (yesSection) {
      // Check that output messages don't mention --platform
      const outputCalls = yesSection[0].match(/output\.\w+\s*\([^)]*\)/g) || [];
      const combinedOutput = outputCalls.join(' ');
      expect(combinedOutput).not.toMatch(/--platform/);
    }
  });

  // Test 3.2: config-builder.js should not mention --depth in output messages
  test('[P1] config-builder.js output should not mention --depth', () => {
    const content = readFileSync(CONFIG_BUILDER_PATH, 'utf8');
    const outputCalls = content.match(/output\.\w+\s*\([^)]*\)/g) || [];
    const combinedOutput = outputCalls.join(' ');
    expect(combinedOutput).not.toMatch(/--depth/);
  });
});

// ============================================================================
// AC3: Installer Summary Must Not Mention Advanced Flags
// ============================================================================

describe('AC3: Installer Summary Progressive Disclosure', () => {
  // Test 4.1: installer.js printSummary should not mention --platform
  test('[P0] installer.js printSummary should not mention --platform', () => {
    const content = readFileSync(INSTALLER_PATH, 'utf8');
    // Find printSummary method
    const summaryMatch = content.match(/printSummary\s*\(\)\s*\{[\s\S]*?\n\s*\}/);
    if (summaryMatch) {
      expect(summaryMatch[0]).not.toMatch(/--platform/);
    }
  });

  // Test 4.2: installer.js printSummary should not mention --depth
  test('[P0] installer.js printSummary should not mention --depth', () => {
    const content = readFileSync(INSTALLER_PATH, 'utf8');
    const summaryMatch = content.match(/printSummary\s*\(\)\s*\{[\s\S]*?\n\s*\}/);
    if (summaryMatch) {
      expect(summaryMatch[0]).not.toMatch(/--depth/);
    }
  });

  // Test 4.3: installer.js should not mention advanced flags in any output calls
  test('[P1] installer.js output calls should not mention --yes or --platform', () => {
    const content = readFileSync(INSTALLER_PATH, 'utf8');
    const outputCalls = content.match(/output\.\w+\s*\([^)]*\)/g) || [];
    const combinedOutput = outputCalls.join(' ');
    expect(combinedOutput).not.toMatch(/--platform|--depth|--yes/);
  });
});

// ============================================================================
// AC3: CLI Entry Point --help Should Be Only Place for Advanced Flags
// ============================================================================

describe('AC3: CLI Entry Point Help Documentation', () => {
  // Test 5.1: bin/create-scrum-workflow.js should define --help via Commander.js
  test('[P1] CLI entry point should use Commander.js for help (--help)', () => {
    const content = readFileSync(BIN_PATH, 'utf8');
    expect(content).toMatch(/commander|program\./);
  });

  // Test 5.2: bin/create-scrum-workflow.js should define advanced options in Commander
  test('[P1] CLI entry point should define --platform and --depth as Commander options', () => {
    const content = readFileSync(BIN_PATH, 'utf8');
    // Advanced flags should be defined as Commander options (visible in --help)
    expect(content).toMatch(/--platform|--depth/);
  });
});
