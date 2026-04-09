/**
 * ATDD Tests for AC3: X Mark on Failed Operation
 *
 * TDD Phase: RED (tests written before implementation -- will fail until progress.js exists)
 * Test Level: Unit
 * Test Framework: Vitest
 * Story: 6.2 - Implement Progress Indicators
 *
 * PRD References:
 * - UX-DR8: X mark for failed
 * - UX-DR7: Emoji prefixes (cross for error)
 * - UX-DR6: Semantic colors (Error=Red)
 * - UX-DR9: Single line per message
 *
 * AC3: Given an operation fails
 *      When the spinner resolves
 *      Then it is replaced by an X mark: `{cross mark} {operation} failed`
 *      And an actionable error message follows
 */

import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock @clack/prompts spinner
const mockSpinnerInstance = {
  start: vi.fn(),
  stop: vi.fn(),
  message: vi.fn()
}

vi.mock('@clack/prompts', () => ({
  spinner: vi.fn(() => mockSpinnerInstance)
}))

// Capture console.log output
let captured = []
const originalLog = console.log

beforeEach(() => {
  captured = []
  console.log = (...args) => captured.push(args.map(String).join(' '))
  vi.clearAllMocks()
})

afterEach(() => {
  console.log = originalLog
})

/**
 * Helper: strip ANSI escape codes for assertions on plain text
 */
function stripAnsi(str) {
  // eslint-disable-next-line no-control-regex
  return str.replace(/\x1B\[[0-9;]*m/g, '')
}

// ============================================================================
// AC3: X Mark Replacement on Failure
// ============================================================================

describe('AC3: X Mark on Failed Operation', () => {
  test('[P0] progress.fail() should stop spinner and print error message with X mark', async () => {
    const { start, fail } = await import('../../../src/core/progress.js')

    start('Copying framework files...')
    fail('Framework copy failed')

    // Spinner should be stopped
    expect(mockSpinnerInstance.stop).toHaveBeenCalled()

    // A console.log should have been produced with error prefix + message
    expect(captured.length).toBeGreaterThanOrEqual(1)
    const plain = stripAnsi(captured[captured.length - 1])
    expect(plain).toMatch(/^❌/)
    expect(plain).toContain('Framework copy failed')
  })

  test('[P0] progress.fail() should use output.error() for formatting', async () => {
    // Verify the progress module delegates to output.error()
    const { readFileSync } = await import('node:fs')
    const { join, dirname } = await import('node:path')
    const { fileURLToPath } = await import('node:url')
    const src = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), '../../../src/core/progress.js'),
      'utf8'
    )
    expect(src).toMatch(/output\.error/)
  })

  test('[P0] progress.fail() message should follow pattern: {operation} failed', async () => {
    const { start, fail } = await import('../../../src/core/progress.js')

    start('Copying framework files')
    fail('Framework copy failed')

    const plain = stripAnsi(captured[captured.length - 1])
    expect(plain).toContain('failed')
  })

  test('[P0] progress.fail() should stop spinner with empty message before output.error', async () => {
    const { start, fail } = await import('../../../src/core/progress.js')

    start('Installing')
    fail('Installation failed')

    // spinner.stop('') should be called to stop animation without message
    expect(mockSpinnerInstance.stop).toHaveBeenCalledWith('')
  })

  test('[P0] progress.fail() should apply red color to message', async () => {
    const { start, fail } = await import('../../../src/core/progress.js')

    start('Processing')
    fail('Processing failed')

    // Verify source uses output.error which uses pc.red
    const { readFileSync } = await import('node:fs')
    const { join, dirname } = await import('node:path')
    const { fileURLToPath } = await import('node:url')
    const src = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), '../../../src/core/progress.js'),
      'utf8'
    )
    expect(src).toMatch(/output\.error/)
  })

  test('[P1] progress.fail() message should be single line (UX-DR9)', async () => {
    const { start, fail } = await import('../../../src/core/progress.js')

    start('Processing')
    fail('Processing failed')

    const plain = stripAnsi(captured[captured.length - 1])
    expect(plain).not.toContain('\n')
  })

  test('[P0] progress.fail() should not use success or warning emoji', async () => {
    const { start, fail } = await import('../../../src/core/progress.js')

    start('Test operation')
    fail('Test operation failed')

    const plain = stripAnsi(captured[captured.length - 1])
    expect(plain).not.toContain('✓')
    expect(plain).not.toContain('⚠')
  })

  test('[P0] progress.fail() should NOT throw even without prior start()', async () => {
    const { fail } = await import('../../../src/core/progress.js')

    // Edge case: fail() without start() should not throw
    expect(() => fail('Something failed')).not.toThrow()

    // Should still produce error output
    expect(captured.length).toBeGreaterThanOrEqual(1)
    const plain = stripAnsi(captured[captured.length - 1])
    expect(plain).toMatch(/^❌/)
    expect(plain).toContain('Something failed')
  })

  test('[P1] progress.fail() without start() should still call output.error()', async () => {
    const { fail } = await import('../../../src/core/progress.js')

    // Should gracefully handle no-spinner case
    fail('Standalone error message')

    // output should be produced via output.error()
    expect(captured.length).toBeGreaterThanOrEqual(1)
    const plain = stripAnsi(captured[captured.length - 1])
    expect(plain).toMatch(/^❌/)
  })
})

// ============================================================================
// AC3: Actionable Error Message Pattern
// ============================================================================

describe('AC3: Actionable Error Context', () => {
  test('[P1] progress.fail() callers are responsible for printing actionable details after fail', async () => {
    // This test verifies the DESIGN: fail() prints the status line,
    // then the CALLER prints detail lines. This test documents the contract.
    const { start, fail } = await import('../../../src/core/progress.js')

    start('Copying framework files')
    fail('Framework copy failed')

    // After fail(), the caller would print detail lines via console.log
    // This test just verifies fail() produces the status line
    const plain = stripAnsi(captured[captured.length - 1])
    expect(plain).toContain('failed')
  })
})

// ============================================================================
// AC3: Progress Module Does NOT Reimplement output.js
// ============================================================================

describe('AC3: Output Module Delegation', () => {
  test('[P0] progress.js should NOT contain pc.red() call (delegates to output.error)', async () => {
    const { readFileSync } = await import('node:fs')
    const { join, dirname } = await import('node:path')
    const { fileURLToPath } = await import('node:url')
    const src = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), '../../../src/core/progress.js'),
      'utf8'
    )
    // Should delegate to output.error, not reimplement
    expect(src).toMatch(/output\.error/)
    expect(src).not.toMatch(/pc\.red/)
  })
})

// ============================================================================
// AC3: Full Flow — Start -> Fail
// ============================================================================

describe('AC3: Full Start-Fail Flow', () => {
  test('[P0] full flow: start -> fail produces spinner then error message', async () => {
    const { start, fail } = await import('../../../src/core/progress.js')

    start('Installing dependencies')
    fail('Dependency installation failed')

    // Spinner start was called
    expect(mockSpinnerInstance.start).toHaveBeenCalledWith('Installing dependencies')
    // Spinner stop was called
    expect(mockSpinnerInstance.stop).toHaveBeenCalled()
    // Error output was produced
    const plain = stripAnsi(captured[captured.length - 1])
    expect(plain).toMatch(/^❌/)
    expect(plain).toContain('Dependency installation failed')
  })

  test('[P1] full flow: start -> fail -> start -> fail handles sequential failures', async () => {
    const { start, fail } = await import('../../../src/core/progress.js')

    start('Step A')
    fail('Step A failed')
    start('Step B')
    fail('Step B failed')

    const failOutputs = captured.filter(
      (line) => stripAnsi(line).includes('failed')
    )
    expect(failOutputs.length).toBe(2)
  })
})
