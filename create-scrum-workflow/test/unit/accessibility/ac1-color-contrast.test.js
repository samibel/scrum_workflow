/**
 * ATDD Tests for AC1: Color Contrast 4.5:1 Ratio (UX-DR16)
 *
 * TDD Phase: RED (tests written before implementation -- will be activated after implementation)
 * Test Level: Unit
 * Test Framework: Vitest
 * Story: 6.6 - Implement Accessibility & Layout Standards
 *
 * PRD References:
 * - UX-DR16: Color Contrast — 4.5:1 minimum contrast ratio (terminal default themes support high contrast)
 *
 * AC1: Given UX-DR16 specifies 4.5:1 minimum color contrast ratio
 *      When colors are applied to terminal output
 *      Then all color combinations meet the 4.5:1 contrast requirement
 *      against standard terminal backgrounds (dark and light themes)
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
 * Helper: extract text color from ANSI string (returns color code or null)
 */
function extractAnsiColor(str) {
  // Match common picocolors foreground colors: \x1B[<数字>m
  // 30=black, 31=red, 32=green, 33=yellow, 34=blue, 35=magenta, 36=cyan, 37=white
  // 90=brightBlack, 91=brightRed, 92=brightGreen, 93=brightYellow, 94=brightBlue, 95=brightMagenta, 96=brightCyan, 97=brightWhite
  const match = str.match(/\x1B\[(\d+)m/);
  return match ? parseInt(match[1]) : null;
}

/**
 * Calculate relative luminance for contrast ratio (simplified for terminal colors)
 * Standard terminal colors have known luminance values
 */
function getLuminance(colorCode) {
  // Map standard 8 ANSI colors to relative luminance (0-1)
  // Based on ITU-R BT.601 relative luminance for 8 basic colors
  const luminanceMap = {
    30: 0.0,   // black
    31: 0.299, // red
    32: 0.587, // green
    33: 0.114, // yellow
    34: 0.114, // blue
    35: 0.299, // magenta
    36: 0.587, // cyan
    37: 0.114, // white (simplified)
    90: 0.0,   // bright black (gray)
    91: 0.299, // bright red
    92: 0.587, // bright green
    93: 0.114, // bright yellow
    94: 0.114, // bright blue
    95: 0.299, // bright magenta
    96: 0.587, // bright cyan
    97: 0.114, // bright white
  };
  return luminanceMap[colorCode] ?? 0.5;
}

/**
 * Calculate contrast ratio between two colors
 */
function calculateContrastRatio(color1, color2) {
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const OUTPUT_SRC = join(TEST_DIR, '../../../src/core/output.js');

// ============================================================================
// AC1: Color Contrast Ratio Verification
// ============================================================================

describe('AC1: Color Contrast 4.5:1 Ratio (UX-DR16)', () => {
  test('[P0] output.success() should meet 4.5:1 contrast on dark background', async () => {
    const { output } = await import('../../../src/core/output.js');
    output.success('Test message');

    expect(captured.length).toBe(1);
    const line = captured[0];
    const colorCode = extractAnsiColor(line);
    expect(colorCode).not.toBeNull();

    // Green text on dark background should have sufficient contrast
    // Green (32) on black (30) = (0.587+0.05)/(0+0.05) = 12.74:1 > 4.5:1
    const contrastRatio = calculateContrastRatio(colorCode, 30); // Assume dark bg
    expect(contrastRatio).toBeGreaterThanOrEqual(4.5);
  });

  test('[P0] output.warning() should meet 4.5:1 contrast on dark background', async () => {
    const { output } = await import('../../../src/core/output.js');
    output.warning('Test message');

    expect(captured.length).toBe(1);
    const line = captured[0];
    const colorCode = extractAnsiColor(line);
    expect(colorCode).not.toBeNull();

    // Yellow (33) on black (30) = (0.114+0.05)/(0+0.05) = 3.28:1 - FAILS!
    // This should FAIL in RED phase - yellow on dark is insufficient contrast
    const contrastRatio = calculateContrastRatio(colorCode, 30);
    expect(contrastRatio).toBeGreaterThanOrEqual(4.5);
  });

  test('[P0] output.error() should meet 4.5:1 contrast on dark background', async () => {
    const { output } = await import('../../../src/core/output.js');
    output.error('Test message');

    expect(captured.length).toBe(1);
    const line = captured[0];
    const colorCode = extractAnsiColor(line);
    expect(colorCode).not.toBeNull();

    // Red (31) on black (30) = (0.299+0.05)/(0+0.05) = 6.98:1 > 4.5:1
    const contrastRatio = calculateContrastRatio(colorCode, 30);
    expect(contrastRatio).toBeGreaterThanOrEqual(4.5);
  });

  test('[P0] output.info() should meet 4.5:1 contrast on dark background', async () => {
    const { output } = await import('../../../src/core/output.js');
    output.info('Test message');

    expect(captured.length).toBe(1);
    const line = captured[0];
    const colorCode = extractAnsiColor(line);
    expect(colorCode).not.toBeNull();

    // Cyan (36) on black (30) = (0.587+0.05)/(0+0.05) = 12.74:1 > 4.5:1
    const contrastRatio = calculateContrastRatio(colorCode, 30);
    expect(contrastRatio).toBeGreaterThanOrEqual(4.5);
  });

  test('[P1] output.warning() should meet 4.5:1 contrast on light background', async () => {
    const { output } = await import('../../../src/core/output.js');
    output.warning('Test message');

    expect(captured.length).toBe(1);
    const line = captured[0];
    const colorCode = extractAnsiColor(line);
    expect(colorCode).not.toBeNull();

    // Yellow (33) on white (37) = (0.114+0.05)/(0.114+0.05) = 1.0:1 - FAILS!
    // This should FAIL in RED phase - yellow on light is insufficient contrast
    const contrastRatio = calculateContrastRatio(colorCode, 37);
    expect(contrastRatio).toBeGreaterThanOrEqual(4.5);
  });

  test('[P1] All color combinations should be verified in source code', async () => {
    // Verify output.js documents contrast compliance
    const content = readFileSync(OUTPUT_SRC, 'utf8');
    // Source should reference UX-DR16 or contrast requirements
    expect(content).toMatch(/UX-DR16|contrast|4\.5.*1|contrast.*ratio/i);
  });

  test('[P2] Color disabled (NO_COLOR=true) should not crash', async () => {
    // Save original env
    const originalNoColor = process.env.NO_COLOR;
    process.env.NO_COLOR = '1';

    try {
      const { output } = await import('../../../src/core/output.js');
      // Should not throw
      output.success('Test with no color');
      expect(captured.length).toBe(1);
    } finally {
      // Restore
      if (originalNoColor === undefined) {
        delete process.env.NO_COLOR;
      } else {
        process.env.NO_COLOR = originalNoColor;
      }
    }
  });
});
