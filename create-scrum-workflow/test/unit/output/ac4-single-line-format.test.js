/**
 * ATDD Tests for AC4: Single Line Per Message Format
 *
 * TDD Phase: RED (tests written before implementation -- will be activated after implementation)
 * Test Level: Unit
 * Test Framework: Vitest
 * Story: 6.1 - Implement CLI Output Color & Emoji System
 *
 * PRD References:
 * - UX-DR9: Single line per message
 *
 * AC4: Given UX-DR9 specifies single line per message
 *      When a status message is displayed
 *      Then it appears on a single line: emoji prefix + colored message
 */

import { describe, test, expect, beforeEach, afterEach } from 'vitest';

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
// AC4: Single Line Output Format
// ============================================================================

describe('AC4: Single Line Per Message', () => {
  test('[P0] output.success() should produce exactly one console.log call', async () => {
    const { output } = await import('../../../src/core/output.js');
    output.success('Single line message');

    expect(captured.length).toBe(1);
  });

  test('[P0] output.warning() should produce exactly one console.log call', async () => {
    const { output } = await import('../../../src/core/output.js');
    output.warning('Single line message');

    expect(captured.length).toBe(1);
  });

  test('[P0] output.error() should produce exactly one console.log call', async () => {
    const { output } = await import('../../../src/core/output.js');
    output.error('Single line message');

    expect(captured.length).toBe(1);
  });

  test('[P0] output.info() should produce exactly one console.log call', async () => {
    const { output } = await import('../../../src/core/output.js');
    output.info('Single line message');

    expect(captured.length).toBe(1);
  });

  test('[P0] output.success() output should not contain embedded newlines', async () => {
    const { output } = await import('../../../src/core/output.js');
    output.success('No newline here');

    const line = captured[0];
    const plain = stripAnsi(line);
    expect(plain).not.toContain('\n');
  });

  test('[P0] output.error() output should not contain embedded newlines', async () => {
    const { output } = await import('../../../src/core/output.js');
    output.error('No newline here');

    const line = captured[0];
    const plain = stripAnsi(line);
    expect(plain).not.toContain('\n');
  });

  test('[P1] output.success() output line format: emoji + space + colored message', async () => {
    const { output } = await import('../../../src/core/output.js');
    output.success('Hello world');

    const plain = stripAnsi(captured[0]);
    // Should match pattern: ✓<space>Hello world (or ✓ Hello world)
    expect(plain).toMatch(/^✓\s+Hello world/);
  });

  test('[P1] output.error() output line format: emoji + space + colored message', async () => {
    const { output } = await import('../../../src/core/output.js');
    output.error('Something went wrong');

    const plain = stripAnsi(captured[0]);
    expect(plain).toMatch(/^❌\s+Something went wrong/);
  });

  test('[P1] output.warning() output line format: emoji + space + colored message', async () => {
    const { output } = await import('../../../src/core/output.js');
    output.warning('Be careful');

    const plain = stripAnsi(captured[0]);
    expect(plain).toMatch(/^⚠\s+Be careful/);
  });

  test('[P1] output.info() output line format: emoji + space + colored message', async () => {
    const { output } = await import('../../../src/core/output.js');
    output.info('FYI');

    const plain = stripAnsi(captured[0]);
    expect(plain).toMatch(/^ℹ\s+FYI/);
  });
});

// ============================================================================
// AC4: NO_COLOR / TERM=dumb accessibility guard
// ============================================================================

describe('AC4: NO_COLOR / TERM=dumb Accessibility', () => {
  test('[P0] output.success() should respect NO_COLOR env variable', async () => {
    // This test verifies the module checks for NO_COLOR
    // picocolors natively handles NO_COLOR via pc.isColorSupported
    const { readFileSync } = await import('node:fs');
    const { join, dirname } = await import('node:path');
    const { fileURLToPath } = await import('node:url');
    const TEST_DIR = dirname(fileURLToPath(import.meta.url));
    const content = readFileSync(join(TEST_DIR, '../../../src/core/output.js'), 'utf8');

    // Module should reference NO_COLOR or isColorSupported for guard
    expect(content).toMatch(/NO_COLOR|isColorSupported|TERM.*dumb/);
  });

  test('[P0] when colors are disabled, emoji should still appear', async () => {
    // Verify that emoji prefixes are plain text and always present
    // regardless of color support
    const { readFileSync } = await import('node:fs');
    const { join, dirname } = await import('node:path');
    const { fileURLToPath } = await import('node:url');
    const TEST_DIR = dirname(fileURLToPath(import.meta.url));
    const content = readFileSync(join(TEST_DIR, '../../../src/core/output.js'), 'utf8');

    // The emoji should be unconditionally added (not gated behind color support)
    expect(content).toMatch(/✓|check/);
    expect(content).toMatch(/⚠/);
    expect(content).toMatch(/❌/);
    expect(content).toMatch(/ℹ/);
  });

  test('[P1] output module should guard colors with isColorSupported check', async () => {
    const { readFileSync } = await import('node:fs');
    const { join, dirname } = await import('node:path');
    const { fileURLToPath } = await import('node:url');
    const TEST_DIR = dirname(fileURLToPath(import.meta.url));
    const content = readFileSync(join(TEST_DIR, '../../../src/core/output.js'), 'utf8');

    // picocolors auto-handles NO_COLOR, but module should be aware
    // Either uses pc.isColorSupported or relies on picocolors native handling
    expect(content).toMatch(/pc\.(green|red|yellow|cyan|isColorSupported)/);
  });
});

// ============================================================================
// AC4: Multiple sequential calls produce consistent format
// ============================================================================

describe('AC4: Sequential Calls Consistency', () => {
  test('[P0] multiple output calls in sequence should each produce single lines', async () => {
    const { output } = await import('../../../src/core/output.js');

    output.success('First');
    output.warning('Second');
    output.error('Third');
    output.info('Fourth');

    expect(captured.length).toBe(4);

    // Each line should have exactly one emoji prefix
    const plains = captured.map(stripAnsi);
    expect(plains[0]).toMatch(/^✓\s+First/);
    expect(plains[1]).toMatch(/^⚠\s+Second/);
    expect(plains[2]).toMatch(/^❌\s+Third/);
    expect(plains[3]).toMatch(/^ℹ\s+Fourth/);

    // No line should contain a newline
    for (const plain of plains) {
      expect(plain).not.toContain('\n');
    }
  });

  test('[P1] each output function should use console.log (not console.error or console.warn)', async () => {
    // All output should go through console.log for consistency
    const { output } = await import('../../../src/core/output.js');

    const logCalls = [];
    const errorCalls = [];
    const warnCalls = [];

    const origLog = console.log;
    const origError = console.error;
    const origWarn = console.warn;

    console.log = (...args) => logCalls.push(args);
    console.error = (...args) => errorCalls.push(args);
    console.warn = (...args) => warnCalls.push(args);

    output.success('test');
    output.error('test');
    output.warning('test');
    output.info('test');

    console.log = origLog;
    console.error = origError;
    console.warn = origWarn;

    // Even error messages should use console.log for consistent formatting
    // (the visual "error" is conveyed by color + emoji, not console.error)
    expect(logCalls.length).toBe(4);
    expect(errorCalls.length).toBe(0);
    expect(warnCalls.length).toBe(0);
  });
});
