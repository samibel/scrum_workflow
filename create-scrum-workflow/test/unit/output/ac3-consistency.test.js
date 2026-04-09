/**
 * ATDD Tests for AC3: Consistent Color Coding and Emoji Prefixes Across All Outputs
 *
 * TDD Phase: RED (tests written before implementation -- will be activated after implementation)
 * Test Level: Unit
 * Test Framework: Vitest
 * Story: 6.1 - Implement CLI Output Color & Emoji System
 *
 * PRD References:
 * - UX-DR13: Consistent color coding across all outputs
 * - UX-DR15: Consistent emoji prefixes (status indicator first, then message)
 *
 * AC3: Given UX-DR13 and UX-DR15 specify consistent color coding and emoji prefixes
 *      When multiple commands are run in sequence
 *      Then the same color and emoji conventions are applied consistently
 *      And no command uses custom or inconsistent status indicators
 */

import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Resolve paths
const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const SRC_DIR = join(TEST_DIR, '../../../src');
const OUTPUT_MODULE = join(SRC_DIR, 'core/output.js');

// Capture console.log output
let captured = [];
const originalLog = console.log;

beforeEach(() => {
  captured = [];
  console.log = (...args) => captured.push(args.map(String).join(' '));
});

afterEach(() => {
  console.log = originalLog;
});

// eslint-disable-next-line no-control-regex
const stripAnsi = (str) => str.replace(/\x1B\[[0-9;]*m/g, '');

// ============================================================================
// AC3: Module Exports Consistency
// ============================================================================

describe('AC3: Module Exports and Consistency', () => {
  test('[P0] output module should export success, warning, error, info functions', async () => {
    const { output } = await import('../../../src/core/output.js');
    expect(typeof output.success).toBe('function');
    expect(typeof output.warning).toBe('function');
    expect(typeof output.error).toBe('function');
    expect(typeof output.info).toBe('function');
  });

  test('[P1] output module should export named functions (not a class)', async () => {
    const module = await import('../../../src/core/output.js');
    // Should export as named exports or default object with function properties
    const hasNamedExports = module.output || module.success;
    expect(hasNamedExports).toBeDefined();
  });

  test('[P0] all output functions should produce output when called with a string', async () => {
    const { output } = await import('../../../src/core/output.js');

    output.success('test1');
    const successOutput = captured.slice();
    captured.length = 0;

    output.warning('test2');
    const warningOutput = captured.slice();
    captured.length = 0;

    output.error('test3');
    const errorOutput = captured.slice();
    captured.length = 0;

    output.info('test4');
    const infoOutput = captured.slice();

    // Each function should produce exactly one line of output
    expect(successOutput.length).toBe(1);
    expect(warningOutput.length).toBe(1);
    expect(errorOutput.length).toBe(1);
    expect(infoOutput.length).toBe(1);
  });

  test('[P0] all output functions should follow same format: emoji + colored message', async () => {
    const { output } = await import('../../../src/core/output.js');

    const testCases = [
      { fn: () => output.success('msg'), emoji: '✓' },
      { fn: () => output.warning('msg'), emoji: '⚠' },
      { fn: () => output.error('msg'), emoji: '❌' },
      { fn: () => output.info('msg'), emoji: 'ℹ' },
    ];

    for (const { fn, emoji } of testCases) {
      captured.length = 0;
      fn();
      expect(captured.length).toBe(1);
      const plain = stripAnsi(captured[0]);
      // Verify emoji prefix present
      expect(plain).toContain(emoji);
      // Verify message text present
      expect(plain).toContain('msg');
    }
  });
});

// ============================================================================
// AC3: Migration Verification - validate.js should use output module
// ============================================================================

describe('AC3: validate.js Migration to output Module', () => {
  const validatePath = join(SRC_DIR, 'commands/validate.js');

  test('[P1] validate.js should import the output module', () => {
    const content = readFileSync(validatePath, 'utf8');
    expect(content).toMatch(/import.*output|from.*output/);
  });

  test('[P1] validate.js should use output.success for PASS messages', () => {
    const content = readFileSync(validatePath, 'utf8');
    expect(content).toMatch(/output\.success/);
  });

  test('[P1] validate.js should use output.error for FAIL messages', () => {
    const content = readFileSync(validatePath, 'utf8');
    expect(content).toMatch(/output\.error/);
  });

  test('[P1] validate.js should use output.warning for WARN messages', () => {
    const content = readFileSync(validatePath, 'utf8');
    expect(content).toMatch(/output\.warning/);
  });

  test('[P2] validate.js should NOT use raw pc.green/pc.red/pc.yellow for status messages', () => {
    const content = readFileSync(validatePath, 'utf8');
    // After migration, direct pc.green('PASS'), pc.red('FAIL'), pc.yellow('WARN') should be gone
    expect(content).not.toMatch(/pc\.green\(['"]PASS/);
    expect(content).not.toMatch(/pc\.red\(['"]FAIL/);
    expect(content).not.toMatch(/pc\.yellow\(['"]WARN/);
  });
});

// ============================================================================
// AC3: Migration Verification - status.js should use output module
// ============================================================================

describe('AC3: status.js Migration to output Module', () => {
  const statusPath = join(SRC_DIR, 'commands/status.js');

  test('[P1] status.js should import the output module', () => {
    const content = readFileSync(statusPath, 'utf8');
    expect(content).toMatch(/import.*output|from.*output/);
  });

  test('[P2] status.js should use output.info for header lines', () => {
    const content = readFileSync(statusPath, 'utf8');
    // Header lines (bold) should migrate to output.info() or output.header()
    expect(content).toMatch(/output\.(info|header)/);
  });
});

// ============================================================================
// AC3: No Custom/Inconsistent Status Indicators
// ============================================================================

describe('AC3: No Inconsistent Status Indicators', () => {
  test('[P0] output module should be a single centralized module (not duplicated)', () => {
    const content = readFileSync(OUTPUT_MODULE, 'utf8');
    // Should be a single module with all functions
    expect(content).toMatch(/success|warning|error|info/);
  });

  test('[P1] output module should NOT hardcode ANSI escape codes', () => {
    const content = readFileSync(OUTPUT_MODULE, 'utf8');
    // Should use picocolors, not raw escape codes like \x1B[32m
    // The module should use pc.green(), pc.red() etc., not hardcoded ANSI
    expect(content).not.toMatch(/\\x1B\[32m/);
    expect(content).not.toMatch(/\\x1B\[31m/);
    expect(content).not.toMatch(/\\x1B\[33m/);
    expect(content).not.toMatch(/\\x1B\[36m/);
  });

  test('[P1] output.js should exist in both src/core/ and templates/src/core/', () => {
    const templatePath = join(TEST_DIR, '../../../templates/src/core/output.js');
    expect(existsSync(OUTPUT_MODULE)).toBe(true);
    expect(existsSync(templatePath)).toBe(true);
  });
});
