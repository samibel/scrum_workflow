/**
 * ATDD Tests for AC1: Confirmation Dialogs for Destructive Actions
 *
 * TDD Phase: RED (tests written before implementation -- will fail until prompts.js exists)
 * Test Level: Unit
 * Test Framework: Vitest
 * Story: 6.3 - Implement Interactive Prompt Patterns
 *
 * PRD References:
 * - UX-DR10: Confirmation dialogs for destructive actions with safe default (No)
 *
 * AC1: Given UX-DR10 specifies confirmation dialogs for destructive actions
 *      When a destructive action is about to occur (e.g., overwriting existing files)
 *      Then a confirmation prompt is displayed: `? This will overwrite existing files. Continue? (y/N)`
 *      And the default is No (safe default)
 */

import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock @clack/prompts
const mockConfirm = vi.fn()
const mockIsCancel = vi.fn()
const mockCancel = vi.fn()

vi.mock('@clack/prompts', () => ({
  confirm: mockConfirm,
  isCancel: mockIsCancel,
  cancel: mockCancel
}))

// Mock process.exit to prevent test termination
const mockExit = vi.spyOn(process, 'exit').mockImplementation(() => {})

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  vi.clearAllMocks()
  // Re-apply mockImplementation after clear (restoreAllMocks would remove it)
  mockExit.mockImplementation(() => {})
})

// ============================================================================
// AC1: confirmAction() -- Confirmation Dialog with Safe Default
// ============================================================================

describe('AC1: Confirmation Dialog for Destructive Actions', () => {
  test('[P0] confirmAction() should call confirm() with the provided message', async () => {
    mockConfirm.mockResolvedValue(true)
    mockIsCancel.mockReturnValue(false)

    const { confirmAction } = await import('../../../src/core/prompts.js')

    await confirmAction('This will overwrite existing files. Continue?')

    expect(mockConfirm).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'This will overwrite existing files. Continue?' })
    )
  })

  test('[P0] confirmAction() should default to false (safe default per UX-DR10)', async () => {
    mockConfirm.mockResolvedValue(false)
    mockIsCancel.mockReturnValue(false)

    const { confirmAction } = await import('../../../src/core/prompts.js')

    await confirmAction('Overwrite existing files?')

    expect(mockConfirm).toHaveBeenCalledWith(
      expect.objectContaining({ initialValue: false })
    )
  })

  test('[P0] confirmAction() should allow overriding default to true', async () => {
    mockConfirm.mockResolvedValue(true)
    mockIsCancel.mockReturnValue(false)

    const { confirmAction } = await import('../../../src/core/prompts.js')

    await confirmAction('Continue with operation?', { defaultValue: true })

    expect(mockConfirm).toHaveBeenCalledWith(
      expect.objectContaining({ initialValue: true })
    )
  })

  test('[P0] confirmAction() should return the boolean result when user confirms', async () => {
    mockConfirm.mockResolvedValue(true)
    mockIsCancel.mockReturnValue(false)

    const { confirmAction } = await import('../../../src/core/prompts.js')

    const result = await confirmAction('Overwrite files?')

    expect(result).toBe(true)
  })

  test('[P0] confirmAction() should return false when user declines', async () => {
    mockConfirm.mockResolvedValue(false)
    mockIsCancel.mockReturnValue(false)

    const { confirmAction } = await import('../../../src/core/prompts.js')

    const result = await confirmAction('Overwrite files?')

    expect(result).toBe(false)
  })

  test('[P1] confirmAction() should work with overwrite-specific message', async () => {
    mockConfirm.mockResolvedValue(true)
    mockIsCancel.mockReturnValue(false)

    const { confirmAction } = await import('../../../src/core/prompts.js')

    await confirmAction('Framework directory already exists. Overwrite?')

    expect(mockConfirm).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Framework directory already exists. Overwrite?'
      })
    )
  })
})

// ============================================================================
// AC1: Cancel Handling for Confirmation Prompts
// ============================================================================

describe('AC1: Cancel Handling in confirmAction()', () => {
  test('[P0] confirmAction() should detect cancel via isCancel()', async () => {
    const cancelSymbol = Symbol('clack:cancel')
    mockConfirm.mockResolvedValue(cancelSymbol)
    mockIsCancel.mockReturnValue(true)

    const { confirmAction } = await import('../../../src/core/prompts.js')

    await confirmAction('Overwrite files?')

    expect(mockIsCancel).toHaveBeenCalledWith(cancelSymbol)
  })

  test('[P0] confirmAction() should call cancel() with message on user cancel', async () => {
    const cancelSymbol = Symbol('clack:cancel')
    mockConfirm.mockResolvedValue(cancelSymbol)
    mockIsCancel.mockReturnValue(true)

    const { confirmAction } = await import('../../../src/core/prompts.js')

    await confirmAction('Overwrite files?')

    expect(mockCancel).toHaveBeenCalledWith('Operation cancelled')
  })

  test('[P0] confirmAction() should call process.exit(0) on user cancel', async () => {
    const cancelSymbol = Symbol('clack:cancel')
    mockConfirm.mockResolvedValue(cancelSymbol)
    mockIsCancel.mockReturnValue(true)

    const { confirmAction } = await import('../../../src/core/prompts.js')

    await confirmAction('Overwrite files?')

    expect(mockExit).toHaveBeenCalledWith(0)
  })

  test('[P0] confirmAction() should NOT call cancel/exit when user provides answer', async () => {
    mockConfirm.mockResolvedValue(true)
    mockIsCancel.mockReturnValue(false)

    const { confirmAction } = await import('../../../src/core/prompts.js')

    await confirmAction('Overwrite files?')

    expect(mockCancel).not.toHaveBeenCalled()
    expect(mockExit).not.toHaveBeenCalled()
  })
})

// ============================================================================
// AC1: Module Export Verification
// ============================================================================

describe('AC1: Prompt Module Exports', () => {
  test('[P0] prompts module should export named confirmAction function', async () => {
    const prompts = await import('../../../src/core/prompts.js')
    expect(typeof prompts.confirmAction).toBe('function')
  })

  test('[P0] prompts module should import confirm from @clack/prompts', async () => {
    const { readFileSync } = await import('node:fs')
    const { join, dirname } = await import('node:path')
    const { fileURLToPath } = await import('node:url')
    const src = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), '../../../src/core/prompts.js'),
      'utf8'
    )
    expect(src).toMatch(/from\s+['"]@clack\/prompts['"]/)
    expect(src).toMatch(/confirm/)
  })

  test('[P0] prompts module should import isCancel and cancel from @clack/prompts', async () => {
    const { readFileSync } = await import('node:fs')
    const { join, dirname } = await import('node:path')
    const { fileURLToPath } = await import('node:url')
    const src = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), '../../../src/core/prompts.js'),
      'utf8'
    )
    expect(src).toMatch(/isCancel/)
    expect(src).toMatch(/\bcancel\b/)
  })

  test('[P1] prompts.js should NOT contain inline process.exit in loops (centralized pattern)', async () => {
    const { readFileSync } = await import('node:fs')
    const { join, dirname } = await import('node:path')
    const { fileURLToPath } = await import('node:url')
    const src = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), '../../../src/core/prompts.js'),
      'utf8'
    )
    // process.exit should appear once per prompt function, not in a loop
    const exitCount = (src.match(/process\.exit\(0\)/g) || []).length
    // Should have exactly 4 (one per prompt function)
    expect(exitCount).toBe(4)
  })
})
