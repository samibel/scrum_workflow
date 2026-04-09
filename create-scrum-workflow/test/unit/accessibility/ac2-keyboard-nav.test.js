/**
 * ATDD Tests for AC2: Keyboard Navigation (UX-DR17)
 *
 * TDD Phase: RED (tests written before implementation -- will be activated after implementation)
 * Test Level: Unit
 * Test Framework: Vitest
 * Story: 6.6 - Implement Accessibility & Layout Standards
 *
 * PRD References:
 * - UX-DR17: Keyboard Navigation — Tab completion and arrow keys supported
 *
 * AC2: Given UX-DR17 specifies keyboard navigation with Tab completion and arrow keys
 *      When interactive prompts are displayed
 *      Then Tab completion and arrow key navigation are supported
 */

import { describe, test, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const PROMPTS_SRC = join(TEST_DIR, '../../../src/core/prompts.js');

// ============================================================================
// AC2: Keyboard Navigation Support (UX-DR17)
// ============================================================================

describe('AC2: Keyboard Navigation (UX-DR17)', () => {
  test('[P0] prompts.js should use @clack/prompts which supports keyboard nav', async () => {
    const content = readFileSync(PROMPTS_SRC, 'utf8');
    // @clack/prompts natively supports arrow keys and Tab
    expect(content).toMatch(/from\s+['"]@clack\/prompts['"]/);
  });

  test('[P0] selectOption() should use @clack/prompts select() for arrow key nav', async () => {
    const content = readFileSync(PROMPTS_SRC, 'utf8');
    // select() from @clack/prompts provides arrow key navigation
    expect(content).toMatch(/select\s*\(/);
  });

  test('[P0] multiSelectOptions() should use @clack/prompts multiselect() for arrow keys', async () => {
    const content = readFileSync(PROMPTS_SRC, 'utf8');
    // multiselect() provides arrow key navigation with Space to toggle
    expect(content).toMatch(/multiselect\s*\(/);
  });

  test('[P0] confirmAction() should use @clack/prompts confirm() for Enter/Escape', async () => {
    const content = readFileSync(PROMPTS_SRC, 'utf8');
    // confirm() supports Enter to confirm, Escape to cancel
    expect(content).toMatch(/confirm\s*\(/);
  });

  test('[P1] inputText() should use @clack/prompts text() for Tab completion', async () => {
    const content = readFileSync(PROMPTS_SRC, 'utf8');
    // text() from @clack/prompts supports Tab completion
    expect(content).toMatch(/text\s*\(/);
  });

  test('[P1] All prompt functions should handle isCancel() properly', async () => {
    const content = readFileSync(PROMPTS_SRC, 'utf8');
    // Proper cancel handling is required for keyboard navigation UX
    expect(content).toMatch(/isCancel\s*\(/);
  });

  test('[P2] No raw readline usage (should use @clack/prompts)', async () => {
    const content = readFileSync(PROMPTS_SRC, 'utf8');
    // Raw readline does not support arrow keys or Tab - should not be used
    expect(content).not.toMatch(/require\s*\(\s*['"]readline['"]\s*\)/);
    expect(content).not.toMatch(/from\s+['"]readline['"]/);
  });

  test('[P2] prompt functions should have proper cancel handling with process.exit', async () => {
    const content = readFileSync(PROMPTS_SRC, 'utf8');
    // Cancel should exit gracefully, not throw
    expect(content).toMatch(/cancel\s*\(/);
    expect(content).toMatch(/process\.exit\s*\(\s*0\s*\)/);
  });
});

// ============================================================================
// AC2: @clack/prompts Native Keyboard Support Verification
// ============================================================================

describe('AC2: @clack/prompts Keyboard Support Documentation', () => {
  test('[P1] Source should document keyboard navigation support', async () => {
    const content = readFileSync(PROMPTS_SRC, 'utf8');
    // UX-DR17 compliance should be documented
    expect(content).toMatch(/UX-DR17|keyboard|navigation|arrow|tab/i);
  });

  test('[P2] Package.json should include @clack/prompts dependency', async () => {
    const { readFileSync } = await import('node:fs');
    const pkgPath = join(TEST_DIR, '../../../package.json');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
    expect(pkg.dependencies).toHaveProperty('@clack/prompts');
  });
});
