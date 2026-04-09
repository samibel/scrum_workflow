/**
 * ATDD Tests for AC1: Install Success Message with First Command Hint
 *
 * TDD Phase: RED (tests written before implementation -- will pass after implementation)
 * Test Level: Unit (File Content Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 6.5 - Implement Success Messages & Next-Step Guidance
 *
 * PRD References:
 * - UX-DR2: One-line success with first command hint after installation
 * - UX-DR9: Single line per message
 * - UX-DR13: Consistent color coding
 * - UX-DR15: Consistent emoji prefixes
 *
 * AC1: Given UX-DR2 specifies one-line success with first command hint after installation
 *      When installation completes successfully
 *      Then a success message is displayed with the first actionable command
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const CREATE_SCRUM_WORKFLOW_ROOT = join(process.cwd(), 'create-scrum-workflow');
const INSTALL_CMD_PATH = join(CREATE_SCRUM_WORKFLOW_ROOT, 'src', 'commands', 'install.js');
const NEXT_STEPS_MODULE_PATH = join(CREATE_SCRUM_WORKFLOW_ROOT, 'src', 'core', 'next-steps.js');
const TEMPLATE_NEXT_STEPS_PATH = join(CREATE_SCRUM_WORKFLOW_ROOT, 'templates', 'src', 'core', 'next-steps.js');
const TEMPLATE_INSTALL_CMD_PATH = join(CREATE_SCRUM_WORKFLOW_ROOT, 'templates', 'src', 'commands', 'install.js');

// ============================================================================
// AC1: Next-Step Guidance Module Exists
// ============================================================================

describe('AC1: Next-Step Guidance Module', () => {
  // Test 1.1: next-steps.js module should exist
  test('[P0] src/core/next-steps.js module should exist', () => {
    expect(existsSync(NEXT_STEPS_MODULE_PATH)).toBe(true);
  });

  // Test 1.2: next-steps.js should export getNextStep function
  test('[P0] next-steps.js should export getNextStep function', () => {
    const content = readFileSync(NEXT_STEPS_MODULE_PATH, 'utf8');
    expect(content).toMatch(/export\s+function\s+getNextStep|export\s+{\s*getNextStep|export\s+const\s+getNextStep/);
  });

  // Test 1.3: next-steps.js should define step mappings for install command
  test('[P0] next-steps.js should define next-step for install command', () => {
    const content = readFileSync(NEXT_STEPS_MODULE_PATH, 'utf8');
    expect(content).toMatch(/install/);
    expect(content).toMatch(/scrum-create-ticket/);
  });

  // Test 1.4: next-steps.js should define step mappings for update command
  test('[P1] next-steps.js should define next-step for update command', () => {
    const content = readFileSync(NEXT_STEPS_MODULE_PATH, 'utf8');
    expect(content).toMatch(/update/);
  });

  // Test 1.5: next-steps.js should define step mappings for validate command
  test('[P1] next-steps.js should define next-step for validate command', () => {
    const content = readFileSync(NEXT_STEPS_MODULE_PATH, 'utf8');
    expect(content).toMatch(/validate/);
  });

  // Test 1.6: next-steps.js should define step mappings for status command
  test('[P1] next-steps.js should define next-step for status command', () => {
    const content = readFileSync(NEXT_STEPS_MODULE_PATH, 'utf8');
    expect(content).toMatch(/status/);
  });

  // Test 1.7: next-steps.js should accept a command string parameter
  test('[P0] getNextStep should accept command string parameter', () => {
    const content = readFileSync(NEXT_STEPS_MODULE_PATH, 'utf8');
    expect(content).toMatch(/function\s+getNextStep\s*\(\s*command/);
  });

  // Test 1.8: next-steps.js should accept optional context parameter
  test('[P1] getNextStep should accept optional context parameter', () => {
    const content = readFileSync(NEXT_STEPS_MODULE_PATH, 'utf8');
    expect(content).toMatch(/context\s*=\s*\{\}|context\s*=\s*\{\s*\}/);
  });

  // Test 1.9: next-steps.js should return a string
  test('[P1] getNextStep should return a string value', () => {
    const content = readFileSync(NEXT_STEPS_MODULE_PATH, 'utf8');
    // Should have a return statement
    expect(content).toMatch(/return\s+/);
  });
});

// ============================================================================
// AC1: Install Command Uses Next-Step Module
// ============================================================================

describe('AC1: Install Command Next-Step Integration', () => {
  // Test 2.1: install.js should import next-steps module
  test('[P0] install.js should import from next-steps module', () => {
    const content = readFileSync(INSTALL_CMD_PATH, 'utf8');
    expect(content).toMatch(/import.*next-steps|from.*next-steps/);
  });

  // Test 2.2: install.js should call getNextStep for install command
  test('[P0] install.js should call getNextStep with install command', () => {
    const content = readFileSync(INSTALL_CMD_PATH, 'utf8');
    expect(content).toMatch(/getNextStep\s*\(\s*['"]install['"]/);
  });

  // Test 2.3: install.js should include next-step in success output
  test('[P0] install.js success message should reference scrum-create-ticket', () => {
    const content = readFileSync(INSTALL_CMD_PATH, 'utf8');
    // The success output should contain the next command hint
    expect(content).toMatch(/scrum-create-ticket.*your feature description|Installation complete.*scrum-create-ticket/);
  });

  // Test 2.4: install.js should use outro() for final message (not raw console.log)
  test('[P0] install.js should use outro() for final success message', () => {
    const content = readFileSync(INSTALL_CMD_PATH, 'utf8');
    expect(content).toMatch(/outro\s*\(/);
  });

  // Test 2.5: install.js success should be a single-line message (UX-DR9)
  test('[P1] install.js success message should be a single line (UX-DR9)', () => {
    const content = readFileSync(INSTALL_CMD_PATH, 'utf8');
    // Should not have multi-line string in the success message
    const outroMatch = content.match(/outro\s*\(\s*`([^`]*)`\s*\)|outro\s*\(\s*'([^']*)'\s*\)|outro\s*\(\s*"([^"]*)"\s*\)/);
    if (outroMatch) {
      const message = outroMatch[1] || outroMatch[2] || outroMatch[3];
      // Should not contain newlines within the message
      expect(message).not.toMatch(/\\n/);
    }
  });
});

// ============================================================================
// AC1: Template Sync
// ============================================================================

describe('AC1: Template Sync for Next-Step Module', () => {
  // Test 3.1: next-steps.js should exist in templates directory
  test('[P0] next-steps.js template should exist', () => {
    expect(existsSync(TEMPLATE_NEXT_STEPS_PATH)).toBe(true);
  });

  // Test 3.2: Template next-steps.js should match source
  test('[P1] next-steps.js template should match source file', () => {
    if (existsSync(NEXT_STEPS_MODULE_PATH) && existsSync(TEMPLATE_NEXT_STEPS_PATH)) {
      const sourceContent = readFileSync(NEXT_STEPS_MODULE_PATH, 'utf8');
      const templateContent = readFileSync(TEMPLATE_NEXT_STEPS_PATH, 'utf8');
      expect(templateContent).toBe(sourceContent);
    }
  });

  // Test 3.3: Updated install.js should exist in templates directory
  test('[P0] Updated install.js template should exist', () => {
    expect(existsSync(TEMPLATE_INSTALL_CMD_PATH)).toBe(true);
  });
});
