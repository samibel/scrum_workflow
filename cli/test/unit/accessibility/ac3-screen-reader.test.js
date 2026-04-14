/**
 * ATDD Tests for AC3: Screen Reader Compatibility (UX-DR18)
 *
 * TDD Phase: RED (tests written before implementation -- will be activated after implementation)
 * Test Level: Unit
 * Test Framework: Vitest
 * Story: 6.6 - Implement Accessibility & Layout Standards
 *
 * PRD References:
 * - UX-DR18: Screen Reader Compatibility — Text-based output is screen reader compatible
 *
 * AC3: Given UX-DR18 specifies screen reader compatibility
 *      When output is produced
 *      Then all information is conveyed through text (not color alone)
 *      And emoji prefixes provide redundant status indication alongside colors
 */

import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

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
 * Helper: strip ANSI escape codes
 */
function stripAnsi(str) {
  // eslint-disable-next-line no-control-regex
  return str.replace(/\x1B\[[0-9;]*m/g, '');
}

/**
 * Emoji prefixes for status indication
 */
const EMOJI_PREFIXES = {
  success: '✓',
  warning: '⚠',
  error: '❌',
  info: 'ℹ',
};

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const OUTPUT_SRC = join(TEST_DIR, '../../../src/core/output.js');

// ============================================================================
// AC3: Screen Reader Compatibility - Text Redundancy
// ============================================================================

describe('AC3: Screen Reader Compatibility (UX-DR18)', () => {
  describe('Text Redundancy for Color-Only Information', () => {
    test('[P0] output.success() should include emoji prefix for non-color indication', async () => {
      const { output } = await import('../../../src/core/output.js');
      output.success('Operation completed');

      expect(captured.length).toBe(1);
      const line = captured[0];
      // Must have emoji prefix - screen readers can read emoji
      expect(line).toContain(EMOJI_PREFIXES.success);
      // Must have text content - not color alone
      expect(stripAnsi(line)).toContain('Operation completed');
    });

    test('[P0] output.warning() should include emoji prefix for non-color indication', async () => {
      const { output } = await import('../../../src/core/output.js');
      output.warning('Deprecated feature');

      expect(captured.length).toBe(1);
      const line = captured[0];
      expect(line).toContain(EMOJI_PREFIXES.warning);
      expect(stripAnsi(line)).toContain('Deprecated feature');
    });

    test('[P0] output.error() should include emoji prefix for non-color indication', async () => {
      const { output } = await import('../../../src/core/output.js');
      output.error('File not found');

      expect(captured.length).toBe(1);
      const line = captured[0];
      expect(line).toContain(EMOJI_PREFIXES.error);
      expect(stripAnsi(line)).toContain('File not found');
    });

    test('[P0] output.info() should include emoji prefix for non-color indication', async () => {
      const { output } = await import('../../../src/core/output.js');
      output.info('Starting process');

      expect(captured.length).toBe(1);
      const line = captured[0];
      expect(line).toContain(EMOJI_PREFIXES.info);
      expect(stripAnsi(line)).toContain('Starting process');
    });
  });

  describe('No Color-Only Information', () => {
    test('[P0] output.success() should not rely on color alone to convey status', async () => {
      const { output } = await import('../../../src/core/output.js');
      output.success('Test message');

      const line = captured[0];
      const plainText = stripAnsi(line);
      // Must have both emoji AND text - color alone is not sufficient
      expect(line).toContain(EMOJI_PREFIXES.success);
      expect(plainText).toMatch(/success|complete|done|ok/i);
    });

    test('[P0] output.warning() should not rely on color alone to convey status', async () => {
      const { output } = await import('../../../src/core/output.js');
      output.warning('Test message');

      const line = captured[0];
      const plainText = stripAnsi(line);
      expect(line).toContain(EMOJI_PREFIXES.warning);
      expect(plainText).toMatch(/warn|deprec|caution|attention/i);
    });

    test('[P0] output.error() should not rely on color alone to convey status', async () => {
      const { output } = await import('../../../src/core/output.js');
      output.error('Test message');

      const line = captured[0];
      const plainText = stripAnsi(line);
      expect(line).toContain(EMOJI_PREFIXES.error);
      expect(plainText).toMatch(/error|fail|not found|cannot/i);
    });

    test('[P0] output.info() should not rely on color alone to convey status', async () => {
      const { output } = await import('../../../src/core/output.js');
      output.info('Test message');

      const line = captured[0];
      const plainText = stripAnsi(line);
      expect(line).toContain(EMOJI_PREFIXES.info);
      expect(plainText).toMatch(/info|note|starting|using/i);
    });
  });

  describe('ANSI Codes Not Sole Indicators', () => {
    test('[P1] No output should use only ANSI codes without visible text/emoji', async () => {
      const { output } = await import('../../../src/core/output.js');

      // All output functions should produce visible text
      output.success('success message');
      expect(stripAnsi(captured[0]).trim().length).toBeGreaterThan(0);

      captured = [];
      output.warning('warning message');
      expect(stripAnsi(captured[0]).trim().length).toBeGreaterThan(0);

      captured = [];
      output.error('error message');
      expect(stripAnsi(captured[0]).trim().length).toBeGreaterThan(0);

      captured = [];
      output.info('info message');
      expect(stripAnsi(captured[0]).trim().length).toBeGreaterThan(0);
    });

    test('[P1] Empty message should not produce output with only ANSI codes', async () => {
      const { output } = await import('../../../src/core/output.js');
      output.success('');

      // Empty string should not produce just ANSI reset codes
      const line = captured[0];
      const plainText = stripAnsi(line).trim();
      // Either empty or has actual content
      expect(plainText.length).toBeGreaterThan(0);
    });
  });
});

// ============================================================================
// AC3: Screen Reader Documentation
// ============================================================================

describe('AC3: Screen Reader Documentation in Source', () => {
  test('[P0] output.js should document screen reader compatibility', async () => {
    const content = readFileSync(OUTPUT_SRC, 'utf8');
    // UX-DR18 compliance should be documented
    expect(content).toMatch(/UX-DR18|screen.?reader|redundant|text.?only|emoji.?prefix/i);
  });

  test('[P1] Emoji prefixes should be documented in source comments', async () => {
    const content = readFileSync(OUTPUT_SRC, 'utf8');
    // Emoji prefixes are required for redundancy
    expect(content).toMatch(/emoji|✓|⚠|❌|ℹ/);
  });

  test('[P2] NO_COLOR and TERM=dumb should be respected for screen readers', async () => {
    const content = readFileSync(OUTPUT_SRC, 'utf8');
    // picocolors respects NO_COLOR and TERM=dumb
    expect(content).toMatch(/isColorSupported|NO_COLOR|TERM.*dumb/i);
  });
});
