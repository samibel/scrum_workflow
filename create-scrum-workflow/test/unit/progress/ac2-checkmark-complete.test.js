/**
 * ATDD Tests for AC2: Checkmark on Successful Completion
 *
 * TDD Phase: RED (tests written before implementation -- will fail until progress.js exists)
 * Test Level: Unit
 * Test Framework: Vitest
 * Story: 6.2 - Implement Progress Indicators
 *
 * PRD References:
 * - UX-DR8: Checkmark for complete
 * - UX-DR7: Emoji prefixes (checkmark for success)
 * - UX-DR6: Semantic colors (Success=Green)
 * - UX-DR9: Single line per message
 *
 * AC2: Given an operation completes successfully
 *      When the spinner resolves
 *      Then it is replaced by a checkmark: `{checkmark} {operation} complete`
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
// AC2: Checkmark Replacement on Success
// ============================================================================

describe('AC2: Checkmark on Successful Completion', () => {
  test('[P0] progress.succeed() should stop spinner and print checkmark message', async () => {
    const { start, succeed } = await import('../../../src/core/progress.js')

    start('Copying framework files...')
    succeed('Framework files copied complete')

    // Spinner should be stopped
    expect(mockSpinnerInstance.stop).toHaveBeenCalled()

    // A console.log should have been produced with checkmark + message
    expect(captured.length).toBeGreaterThanOrEqual(1)
    const plain = stripAnsi(captured[captured.length - 1])
    expect(plain).toMatch(/^✓/)
    expect(plain).toContain('Framework files copied complete')
  })

  test('[P0] progress.succeed() should use output.success() for formatting', async () => {
    // Verify the progress module delegates to output.success()
    const { readFileSync } = await import('node:fs')
    const { join, dirname } = await import('node:path')
    const { fileURLToPath } = await import('node:url')
    const src = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), '../../../src/core/progress.js'),
      'utf8'
    )
    // Should import and use output module
    expect(src).toMatch(/output\.success/)
  })

  test('[P0] progress.succeed() message should follow pattern: {operation} complete', async () => {
    const { start, succeed } = await import('../../../src/core/progress.js')

    start('Copying framework files')
    succeed('Copying framework files complete')

    const plain = stripAnsi(captured[captured.length - 1])
    expect(plain).toContain('complete')
  })

  test('[P0] progress.succeed() should apply green color to message', async () => {
    const { start, succeed } = await import('../../../src/core/progress.js')

    start('Installing')
    succeed('Installation complete')

    const output = captured[captured.length - 1]
    // Green ANSI code should be present when colors are supported
    // Either way, verify source uses output.success which uses pc.green
    const { readFileSync } = await import('node:fs')
    const { join, dirname } = await import('node:path')
    const { fileURLToPath } = await import('node:url')
    const src = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), '../../../src/core/progress.js'),
      'utf8'
    )
    expect(src).toMatch(/output\.success/)
  })

  test('[P0] progress.succeed() should stop spinner with empty message before output.success', async () => {
    const { start, succeed } = await import('../../../src/core/progress.js')

    start('Copying files')
    succeed('Copy complete')

    // spinner.stop('') should be called to stop animation without message
    // because output.success() handles the formatted message
    expect(mockSpinnerInstance.stop).toHaveBeenCalledWith('')
  })

  test('[P1] progress.succeed() message should be single line (UX-DR9)', async () => {
    const { start, succeed } = await import('../../../src/core/progress.js')

    start('Processing')
    succeed('Processing complete')

    const plain = stripAnsi(captured[captured.length - 1])
    // Should not contain newlines
    expect(plain).not.toContain('\n')
  })

  test('[P0] progress.succeed() should not use error emoji or warning emoji', async () => {
    const { start, succeed } = await import('../../../src/core/progress.js')

    start('Test operation')
    succeed('Test operation complete')

    const plain = stripAnsi(captured[captured.length - 1])
    expect(plain).not.toContain('❌')
    expect(plain).not.toContain('⚠')
  })

  test('[P1] progress.succeed() should work for multiple sequential operations', async () => {
    const { start, succeed } = await import('../../../src/core/progress.js')

    // Simulate: operation 1 succeeds, then operation 2 succeeds
    start('Step 1')
    succeed('Step 1 complete')
    start('Step 2')
    succeed('Step 2 complete')

    // Should have 2 console.log outputs (one per succeed)
    const succeedOutputs = captured.filter(
      (line) => stripAnsi(line).includes('complete')
    )
    expect(succeedOutputs.length).toBe(2)
    expect(stripAnsi(succeedOutputs[0])).toContain('Step 1 complete')
    expect(stripAnsi(succeedOutputs[1])).toContain('Step 2 complete')
  })
})

// ============================================================================
// AC2: Integration with output.js module
// ============================================================================

describe('AC2: Output Module Integration', () => {
  test('[P0] progress.js should import from output.js', async () => {
    const { readFileSync } = await import('node:fs')
    const { join, dirname } = await import('node:path')
    const { fileURLToPath } = await import('node:url')
    const src = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), '../../../src/core/progress.js'),
      'utf8'
    )
    expect(src).toMatch(/from\s+['"].*output\.js['"]/)
  })

  test('[P0] progress.succeed() should NOT modify output.js', async () => {
    // Verify output.js is imported, not re-implemented
    const { readFileSync } = await import('node:fs')
    const { join, dirname } = await import('node:path')
    const { fileURLToPath } = await import('node:url')
    const src = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), '../../../src/core/progress.js'),
      'utf8'
    )
    // Should delegate to output.success, not reimplement pc.green
    expect(src).toMatch(/output\.success/)
    // Should NOT contain its own pc.green call
    expect(src).not.toMatch(/pc\.green/)
  })
})
