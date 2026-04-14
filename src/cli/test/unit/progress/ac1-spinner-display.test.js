/**
 * ATDD Tests for AC1: Spinner Display During Long-Running Operations
 *
 * TDD Phase: RED (tests written before implementation -- will fail until progress.js exists)
 * Test Level: Unit
 * Test Framework: Vitest
 * Story: 6.2 - Implement Progress Indicators
 *
 * PRD References:
 * - UX-DR8: Progress indicators: spinner for running, checkmark for complete, X mark for failed
 *
 * AC1: Given UX-DR8 specifies progress indicators: spinner for running, checkmark for complete,
 *      X mark for failed
 *      When a long-running operation starts (e.g., template copying, platform detection)
 *      Then a spinner is displayed with a descriptive message (e.g., `Copying framework files...`)
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
// AC1: Spinner Display with Descriptive Message
// ============================================================================

describe('AC1: Spinner Display During Operations', () => {
  test('[P0] progress.start() should call spinner().start() with descriptive message', async () => {
    const { start } = await import('../../../src/core/progress.js')

    start('Copying framework files...')

    // spinner() should have been called to create instance
    const { spinner } = await import('@clack/prompts')
    expect(spinner).toHaveBeenCalled()

    // The spinner instance's start() should be called with the message
    expect(mockSpinnerInstance.start).toHaveBeenCalledWith('Copying framework files...')
  })

  test('[P0] progress.start() should display spinner with descriptive message for template copying', async () => {
    const { start } = await import('../../../src/core/progress.js')

    start('Copying framework files...')

    expect(mockSpinnerInstance.start).toHaveBeenCalledTimes(1)
    expect(mockSpinnerInstance.start).toHaveBeenCalledWith('Copying framework files...')
  })

  test('[P0] progress.start() should display spinner with descriptive message for platform detection', async () => {
    const { start } = await import('../../../src/core/progress.js')

    start('Detecting platform...')

    expect(mockSpinnerInstance.start).toHaveBeenCalledWith('Detecting platform...')
  })

  test('[P0] progress.start() should display spinner with descriptive message for dependency installation', async () => {
    const { start } = await import('../../../src/core/progress.js')

    start('Installing dependencies...')

    expect(mockSpinnerInstance.start).toHaveBeenCalledWith('Installing dependencies...')
  })

  test('[P1] progress.start() should accept any string message', async () => {
    const { start } = await import('../../../src/core/progress.js')

    start('Any operation description')

    expect(mockSpinnerInstance.start).toHaveBeenCalledWith('Any operation description')
  })

  test('[P0] progress module should use @clack/prompts spinner internally', async () => {
    // Verify the progress module imports and uses @clack/prompts spinner
    const { readFileSync } = await import('node:fs')
    const { join, dirname } = await import('node:path')
    const { fileURLToPath } = await import('node:url')
    const src = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), '../../../src/core/progress.js'),
      'utf8'
    )
    expect(src).toMatch(/from\s+['"]@clack\/prompts['"]/)
    expect(src).toMatch(/spinner/)
  })

  test('[P1] progress.start() should support sequential start calls for multiple operations', async () => {
    const { start, succeed } = await import('../../../src/core/progress.js')

    // Simulate: start operation 1 -> succeed -> start operation 2
    start('Operation 1')
    succeed('Operation 1 complete')
    start('Operation 2')

    expect(mockSpinnerInstance.start).toHaveBeenCalledTimes(2)
    expect(mockSpinnerInstance.start).toHaveBeenNthCalledWith(1, 'Operation 1')
    expect(mockSpinnerInstance.start).toHaveBeenNthCalledWith(2, 'Operation 2')
  })

  test('[P0] progress.start() should not produce console output (spinner handles display)', async () => {
    const { start } = await import('../../../src/core/progress.js')

    start('Copying files...')

    // start() delegates display to @clack/prompts spinner,
    // it should not directly console.log
    expect(captured.length).toBe(0)
  })
})

// ============================================================================
// AC1: Module Export Verification
// ============================================================================

describe('AC1: Progress Module Exports', () => {
  test('[P0] progress module should export named start function', async () => {
    const progress = await import('../../../src/core/progress.js')
    expect(typeof progress.start).toBe('function')
  })

  test('[P0] progress module should export named succeed function', async () => {
    const progress = await import('../../../src/core/progress.js')
    expect(typeof progress.succeed).toBe('function')
  })

  test('[P0] progress module should export named fail function', async () => {
    const progress = await import('../../../src/core/progress.js')
    expect(typeof progress.fail).toBe('function')
  })
})
