/**
 * ATDD Tests for AC1: Semantic Colors (Success=Green, Warning=Yellow, Error=Red, Info=Cyan)
 *
 * TDD Phase: RED (tests written before implementation -- will be activated after implementation)
 * Test Level: Unit
 * Test Framework: Vitest
 * Story: 6.1 - Implement CLI Output Color & Emoji System
 *
 * PRD References:
 * - UX-DR6: Semantic colors via picocolors
 *
 * AC1: Given UX-DR6 specifies semantic colors: Success=Green, Warning=Yellow, Error=Red, Info=Cyan
 *      When any CLI command produces output
 *      Then the output uses the correct semantic color for its message type
 *      And colors are applied using picocolors (as specified in UX Design)
 */

import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';

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

/**
 * Helper: strip ANSI escape codes for assertions on plain text
 */
function stripAnsi(str) {
  // eslint-disable-next-line no-control-regex
  return str.replace(/\x1B\[[0-9;]*m/g, '');
}

/**
 * Helper: check if string contains ANSI green escape code
 */
function hasGreenAnsi(str) {
  return /\x1B\[32m/.test(str);
}

function hasYellowAnsi(str) {
  return /\x1B\[33m/.test(str);
}

function hasRedAnsi(str) {
  // picocolors uses \x1B[31m for red
  return /\x1B\[31m/.test(str);
}

function hasCyanAnsi(str) {
  return /\x1B\[36m/.test(str);
}

// ============================================================================
// AC1: Semantic Color Application via picocolors
// ============================================================================

describe('AC1: Semantic Colors via picocolors', () => {
  test('[P0] output.success() should apply green color to message text', async () => {
    const { output } = await import('../../../src/core/output.js');
    output.success('Operation completed');

    expect(captured.length).toBe(1);
    const line = captured[0];
    // When colors are supported (TTY), ANSI green \x1B[32m is present.
    // When colors are not supported (no TTY / NO_COLOR), picocolors strips them.
    // Either way the message text must be present.
    expect(stripAnsi(line)).toContain('Operation completed');
    // Verify source uses pc.green for semantic color
    const { readFileSync } = await import('node:fs');
    const { join, dirname } = await import('node:path');
    const { fileURLToPath } = await import('node:url');
    const src = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '../../../src/core/output.js'), 'utf8');
    expect(src).toMatch(/pc\.green\(msg\)/);
  });

  test('[P0] output.warning() should apply yellow color to message text', async () => {
    const { output } = await import('../../../src/core/output.js');
    output.warning('Deprecated feature used');

    expect(captured.length).toBe(1);
    const line = captured[0];
    expect(stripAnsi(line)).toContain('Deprecated feature used');
    // Verify source uses pc.yellow for semantic color
    const { readFileSync } = await import('node:fs');
    const { join, dirname } = await import('node:path');
    const { fileURLToPath } = await import('node:url');
    const src = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '../../../src/core/output.js'), 'utf8');
    expect(src).toMatch(/pc\.yellow\(msg\)/);
  });

  test('[P0] output.error() should apply red color to message text', async () => {
    const { output } = await import('../../../src/core/output.js');
    output.error('File not found');

    expect(captured.length).toBe(1);
    const line = captured[0];
    expect(stripAnsi(line)).toContain('File not found');
    // Verify source uses pc.red for semantic color
    const { readFileSync } = await import('node:fs');
    const { join, dirname } = await import('node:path');
    const { fileURLToPath } = await import('node:url');
    const src = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '../../../src/core/output.js'), 'utf8');
    expect(src).toMatch(/pc\.red\(msg\)/);
  });

  test('[P0] output.info() should apply cyan color to message text', async () => {
    const { output } = await import('../../../src/core/output.js');
    output.info('Starting installation');

    expect(captured.length).toBe(1);
    const line = captured[0];
    expect(stripAnsi(line)).toContain('Starting installation');
    // Verify source uses pc.cyan for semantic color
    const { readFileSync } = await import('node:fs');
    const { join, dirname } = await import('node:path');
    const { fileURLToPath } = await import('node:url');
    const src = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '../../../src/core/output.js'), 'utf8');
    expect(src).toMatch(/pc\.cyan\(msg\)/);
  });

  test('[P1] output.success() should not apply red, yellow, or cyan colors', async () => {
    const { output } = await import('../../../src/core/output.js');
    output.success('Test message');

    const line = captured[0];
    expect(hasRedAnsi(line)).toBe(false);
    expect(hasYellowAnsi(line)).toBe(false);
    expect(hasCyanAnsi(line)).toBe(false);
  });

  test('[P1] output.error() should not apply green, yellow, or cyan colors', async () => {
    const { output } = await import('../../../src/core/output.js');
    output.error('Test message');

    const line = captured[0];
    expect(hasGreenAnsi(line)).toBe(false);
    expect(hasYellowAnsi(line)).toBe(false);
    expect(hasCyanAnsi(line)).toBe(false);
  });

  test('[P1] output.warning() should not apply green, red, or cyan colors', async () => {
    const { output } = await import('../../../src/core/output.js');
    output.warning('Test message');

    const line = captured[0];
    expect(hasGreenAnsi(line)).toBe(false);
    expect(hasRedAnsi(line)).toBe(false);
    expect(hasCyanAnsi(line)).toBe(false);
  });

  test('[P1] output.info() should not apply green, yellow, or red colors', async () => {
    const { output } = await import('../../../src/core/output.js');
    output.info('Test message');

    const line = captured[0];
    expect(hasGreenAnsi(line)).toBe(false);
    expect(hasYellowAnsi(line)).toBe(false);
    expect(hasRedAnsi(line)).toBe(false);
  });
});

// ============================================================================
// AC1: picocolors dependency verification
// ============================================================================

describe('AC1: picocolors Dependency Verification', () => {
  test('[P0] output.js should import picocolors', async () => {
    const { readFileSync } = await import('node:fs');
    const { join, dirname } = await import('node:path');
    const { fileURLToPath } = await import('node:url');
    const TEST_DIR = dirname(fileURLToPath(import.meta.url));
    const content = readFileSync(join(TEST_DIR, '../../../src/core/output.js'), 'utf8');
    expect(content).toMatch(/import.*picocolors|from\s+['"]picocolors['"]/);
  });

  test('[P1] output.js should use pc.isColorSupported for color support detection', async () => {
    const { readFileSync } = await import('node:fs');
    const { join, dirname } = await import('node:path');
    const { fileURLToPath } = await import('node:url');
    const TEST_DIR = dirname(fileURLToPath(import.meta.url));
    const content = readFileSync(join(TEST_DIR, '../../../src/core/output.js'), 'utf8');
    expect(content).toMatch(/isColorSupported|NO_COLOR|TERM.*dumb/);
  });
});
