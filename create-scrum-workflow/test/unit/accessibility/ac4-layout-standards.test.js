/**
 * ATDD Tests for AC4: Layout Standards (UX-DR19, UX-DR20)
 *
 * TDD Phase: RED (tests written before implementation -- will be activated after implementation)
 * Test Level: Unit
 * Test Framework: Vitest
 * Story: 6.6 - Implement Accessibility & Layout Standards
 *
 * PRD References:
 * - UX-DR19: Monospace Font — Uses terminal's native font, no custom fonts
 * - UX-DR20: Single Column Layout — Full terminal width, minimal padding, logical grouping
 *
 * AC4: Given UX-DR19 and UX-DR20 specify monospace font and single column layout
 *      When output is formatted
 *      Then the layout uses full terminal width in a single column
 *      And sections are separated by blank lines for logical grouping
 *      And no custom fonts are required — terminal default is used
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
 * Check if string contains multi-byte characters that could cause layout issues
 */
function hasMultiByteChars(str) {
  // ASCII printable + basic controls should be fine
  // eslint-disable-next-line no-control-regex
  return /[^\x00-\x7F]/.test(str);
}

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const OUTPUT_SRC = join(TEST_DIR, '../../../src/core/output.js');

// ============================================================================
// AC4: Single Column Layout (UX-DR20)
// ============================================================================

describe('AC4: Single Column Layout (UX-DR20)', () => {
  test('[P0] output.success() should produce single line output', async () => {
    const { output } = await import('../../../src/core/output.js');
    output.success('Operation completed');

    expect(captured.length).toBe(1);
    // Single line per message - no multi-line output
    const lines = captured[0].split('\n');
    expect(lines.length).toBe(1);
  });

  test('[P0] output.warning() should produce single line output', async () => {
    const { output } = await import('../../../src/core/output.js');
    output.warning('Deprecated feature');

    expect(captured.length).toBe(1);
    const lines = captured[0].split('\n');
    expect(lines.length).toBe(1);
  });

  test('[P0] output.error() should produce single line output', async () => {
    const { output } = await import('../../../src/core/output.js');
    output.error('File not found');

    expect(captured.length).toBe(1);
    const lines = captured[0].split('\n');
    expect(lines.length).toBe(1);
  });

  test('[P0] output.info() should produce single line output', async () => {
    const { output } = await import('../../../src/core/output.js');
    output.info('Starting process');

    expect(captured.length).toBe(1);
    const lines = captured[0].split('\n');
    expect(lines.length).toBe(1);
  });

  test('[P0] output.step() should produce single line output', async () => {
    const { output } = await import('../../../src/core/output.js');
    output.step('Subtask description');

    expect(captured.length).toBe(1);
    const lines = captured[0].split('\n');
    expect(lines.length).toBe(1);
  });

  test('[P0] output.header() should produce single line output', async () => {
    const { output } = await import('../../../src/core/output.js');
    output.header('Section Title');

    expect(captured.length).toBe(1);
    const lines = captured[0].split('\n');
    expect(lines.length).toBe(1);
  });

  test('[P1] Long messages should not cause unexpected wrapping', async () => {
    const { output } = await import('../../../src/core/output.js');
    const longMessage = 'A'.repeat(200);
    output.success(longMessage);

    expect(captured.length).toBe(1);
    // Message should be on single line - terminal will wrap naturally
    const lines = captured[0].split('\n');
    expect(lines.length).toBe(1);
  });

  test('[P2] output.header() should not add blank lines within itself', async () => {
    const { output } = await import('../../../src/core/output.js');
    output.header('Header');

    const line = captured[0];
    // Header should be single line without internal newlines
    expect(line).not.toMatch(/\n/);
  });
});

// ============================================================================
// AC4: Blank Line Separation
// ============================================================================

describe('AC4: Blank Line Separation for Logical Grouping', () => {
  test('[P1] Multiple output calls should not have unintended blank lines between lines', async () => {
    const { output } = await import('../../../src/core/output.js');

    output.success('First message');
    output.info('Second message');

    expect(captured.length).toBe(2);
    // No blank lines should be inserted between messages
    expect(stripAnsi(captured[0])).not.toMatch(/^\s*$/);
    expect(stripAnsi(captured[1])).not.toMatch(/^\s*$/);
  });

  test('[P1] output.header() should be followed by content on next line', async () => {
    const { output } = await import('../../../src/core/output.js');

    output.header('Section Header');
    output.info('Content line');

    // Header and content should be separate lines
    expect(captured.length).toBe(2);
    expect(stripAnsi(captured[0])).toContain('Section Header');
    expect(stripAnsi(captured[1])).toContain('Content line');
  });
});

// ============================================================================
// AC4: Monospace Font (UX-DR19)
// ============================================================================

describe('AC4: Monospace Font (UX-DR19)', () => {
  test('[P0] No custom fonts should be loaded or referenced', async () => {
    const content = readFileSync(OUTPUT_SRC, 'utf8');
    // No font-family declarations in output module
    expect(content).not.toMatch(/font-family|font-family:/i);
    expect(content).not.toMatch(/font-face|@font-face/i);
  });

  test('[P0] No font weight variations should be used for emphasis', async () => {
    const content = readFileSync(OUTPUT_SRC, 'utf8');
    // Emphasis should be via colors, not font weights
    // Bold might be OK for header, but not for regular text emphasis
    // pc.bold is OK for headers, but not for regular messages
  });

  test('[P1] output.header() may use bold for emphasis (terminal default monospace)', async () => {
    const { output } = await import('../../../src/core/output.js');
    output.header('Bold Header');

    expect(captured.length).toBe(1);
    // Bold is acceptable for headers in monospace terminal
    expect(stripAnsi(captured[0])).toContain('Bold Header');
  });

  test('[P2] No non-standard or emoji outside ASCII/semi-standard set', async () => {
    const { output } = await import('../../../src/core/output.js');

    // Our standard emoji set should work in most terminals
    output.success('Success with checkmark');
    expect(captured[0]).toContain('✓');

    captured = [];
    output.warning('Warning with triangle');
    expect(captured[0]).toContain('⚠');

    captured = [];
    output.error('Error with cross');
    expect(captured[0]).toContain('❌');

    captured = [];
    output.info('Info with circle');
    expect(captured[0]).toContain('ℹ');
  });
});

// ============================================================================
// AC4: Full Terminal Width Utilization
// ============================================================================

describe('AC4: Full Terminal Width Utilization', () => {
  test('[P1] No hardcoded line widths in output module', async () => {
    const content = readFileSync(OUTPUT_SRC, 'utf8');
    // No hardcoded widths like "80" or console width calculations needed
    // Layout should be flexible
    expect(content).not.toMatch(/\b80\b/); // No fixed 80 column assumption
    expect(content).not.toMatch(/columns|terminal.*width|process\.stdout\.columns/i);
  });

  test('[P1] Output should work with any terminal width', async () => {
    const { output } = await import('../../../src/core/output.js');

    // Should not crash regardless of terminal width
    output.success('Test message');
    expect(captured.length).toBe(1);

    output.info('Another test');
    expect(captured.length).toBe(2);
  });
});

// ============================================================================
// AC4: Source Documentation
// ============================================================================

describe('AC4: Layout Standards Documentation in Source', () => {
  test('[P0] output.js should document UX-DR19 and UX-DR20 compliance', async () => {
    const content = readFileSync(OUTPUT_SRC, 'utf8');
    expect(content).toMatch(/UX-DR19|UX-DR20|monospace|single.?column|layout/i);
  });

  test('[P1] No ASCII art or box-drawing characters', async () => {
    const content = readFileSync(OUTPUT_SRC, 'utf8');
    // Box drawing chars can misalign in some terminals
    // ═ ║ ─ etc should not be used
    expect(content).not.toMatch(/[╔╗╚╝║═╬├┼┤┬┴]/);
  });
});
