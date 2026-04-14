/**
 * ATDD Tests for AC2: Emoji Prefixes (success=checkmark, warning=warning, error=cross, info=info)
 *
 * TDD Phase: RED (tests written before implementation -- will be activated after implementation)
 * Test Level: Unit
 * Test Framework: Vitest
 * Story: 6.1 - Implement CLI Output Color & Emoji System
 *
 * PRD References:
 * - UX-DR7: Emoji prefixes for message types
 *
 * AC2: Given UX-DR7 specifies emoji prefixes: checkmark for success, warning for warning,
 *      cross for error, info for info
 *      When a message is displayed
 *      Then it is prefixed with the correct emoji for its type
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

/**
 * Helper: strip ANSI escape codes for assertions on plain text
 */
function stripAnsi(str) {
  // eslint-disable-next-line no-control-regex
  return str.replace(/\x1B\[[0-9;]*m/g, '');
}

// ============================================================================
// AC2: Emoji Prefix for Each Message Type
// ============================================================================

describe('AC2: Emoji Prefixes', () => {
  test('[P0] output.success() should prefix message with checkmark emoji', async () => {
    const { output } = await import('../../../src/core/output.js');
    output.success('Operation completed');

    expect(captured.length).toBe(1);
    const plain = stripAnsi(captured[0]);
    expect(plain).toMatch(/^✓/);
    expect(plain).toContain('Operation completed');
  });

  test('[P0] output.warning() should prefix message with warning emoji', async () => {
    const { output } = await import('../../../src/core/output.js');
    output.warning('Deprecated feature used');

    expect(captured.length).toBe(1);
    const plain = stripAnsi(captured[0]);
    expect(plain).toMatch(/^⚠/);
    expect(plain).toContain('Deprecated feature used');
  });

  test('[P0] output.error() should prefix message with cross/error emoji', async () => {
    const { output } = await import('../../../src/core/output.js');
    output.error('File not found');

    expect(captured.length).toBe(1);
    const plain = stripAnsi(captured[0]);
    expect(plain).toMatch(/^❌/);
    expect(plain).toContain('File not found');
  });

  test('[P0] output.info() should prefix message with info emoji', async () => {
    const { output } = await import('../../../src/core/output.js');
    output.info('Starting installation');

    expect(captured.length).toBe(1);
    const plain = stripAnsi(captured[0]);
    expect(plain).toMatch(/^ℹ/);
    expect(plain).toContain('Starting installation');
  });

  test('[P1] output.success() should NOT use wrong emoji (warning, error, info)', async () => {
    const { output } = await import('../../../src/core/output.js');
    output.success('Test message');

    const plain = stripAnsi(captured[0]);
    expect(plain).not.toContain('⚠');
    expect(plain).not.toContain('❌');
    expect(plain).not.toContain('ℹ');
  });

  test('[P1] output.error() should NOT use wrong emoji (checkmark, warning, info)', async () => {
    const { output } = await import('../../../src/core/output.js');
    output.error('Test message');

    const plain = stripAnsi(captured[0]);
    expect(plain).not.toContain('✓');
    expect(plain).not.toContain('⚠');
    expect(plain).not.toContain('ℹ');
  });

  test('[P1] output.warning() should NOT use wrong emoji (checkmark, error, info)', async () => {
    const { output } = await import('../../../src/core/output.js');
    output.warning('Test message');

    const plain = stripAnsi(captured[0]);
    expect(plain).not.toContain('✓');
    expect(plain).not.toContain('❌');
    expect(plain).not.toContain('ℹ');
  });

  test('[P1] output.info() should NOT use wrong emoji (checkmark, warning, error)', async () => {
    const { output } = await import('../../../src/core/output.js');
    output.info('Test message');

    const plain = stripAnsi(captured[0]);
    expect(plain).not.toContain('✓');
    expect(plain).not.toContain('⚠');
    expect(plain).not.toContain('❌');
  });

  test('[P0] emoji prefix should appear before message text (not after)', async () => {
    const { output } = await import('../../../src/core/output.js');
    output.success('Hello world');

    const plain = stripAnsi(captured[0]);
    const checkIndex = plain.indexOf('✓');
    const msgIndex = plain.indexOf('Hello');
    expect(checkIndex).toBeLessThan(msgIndex);
    expect(checkIndex).toBe(0);
  });
});
