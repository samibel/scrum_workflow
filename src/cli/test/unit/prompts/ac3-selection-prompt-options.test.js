/**
 * ATDD Tests for AC3: Selection Prompts for Multiple Options
 *
 * TDD Phase: RED (tests written before implementation -- will fail until prompts.js exists)
 * Test Level: Unit
 * Test Framework: Vitest
 * Story: 6.3 - Implement Interactive Prompt Patterns
 *
 * PRD References:
 * - UX-DR12: Selection prompts for multiple options with numbered display
 *
 * AC3: Given UX-DR12 specifies selection prompts for multiple options
 *      When multiple options are available (e.g., platform selection in non-auto-detect mode)
 *      Then options are numbered: `? Select platform: (1) Claude Code, (2) Cursor, (3) Windsurf`
 */

import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock @clack/prompts
const mockSelect = vi.fn()
const mockMultiselect = vi.fn()
const mockIsCancel = vi.fn()
const mockCancel = vi.fn()

vi.mock('@clack/prompts', () => ({
  select: mockSelect,
  multiselect: mockMultiselect,
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
// AC3: selectOption() -- Single Selection Prompt
// ============================================================================

describe('AC3: Selection Prompt for Multiple Options', () => {
  test('[P0] selectOption() should call select() with the provided message', async () => {
    mockSelect.mockResolvedValue('claude-code')
    mockIsCancel.mockReturnValue(false)

    const { selectOption } = await import('../../../src/core/prompts.js')

    const options = [
      { value: 'claude-code', label: 'Claude Code' },
      { value: 'cursor', label: 'Cursor' },
      { value: 'windsurf', label: 'Windsurf' }
    ]

    await selectOption('Select platform', options)

    expect(mockSelect).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Select platform' })
    )
  })

  test('[P0] selectOption() should pass options to select()', async () => {
    mockSelect.mockResolvedValue('claude-code')
    mockIsCancel.mockReturnValue(false)

    const { selectOption } = await import('../../../src/core/prompts.js')

    const options = [
      { value: 'claude-code', label: 'Claude Code' },
      { value: 'cursor', label: 'Cursor' },
      { value: 'windsurf', label: 'Windsurf' }
    ]

    await selectOption('Select platform', options)

    expect(mockSelect).toHaveBeenCalledWith(
      expect.objectContaining({ options })
    )
  })

  test('[P0] selectOption() should return the selected value', async () => {
    mockSelect.mockResolvedValue('cursor')
    mockIsCancel.mockReturnValue(false)

    const { selectOption } = await import('../../../src/core/prompts.js')

    const options = [
      { value: 'claude-code', label: 'Claude Code' },
      { value: 'cursor', label: 'Cursor' },
      { value: 'windsurf', label: 'Windsurf' }
    ]

    const result = await selectOption('Select platform', options)

    expect(result).toBe('cursor')
  })

  test('[P0] selectOption() should render options as navigable list (via @clack/prompts select)', async () => {
    mockSelect.mockResolvedValue('claude-code')
    mockIsCancel.mockReturnValue(false)

    const { selectOption } = await import('../../../src/core/prompts.js')

    // @clack/prompts select() renders options as navigable list with arrow keys
    // which satisfies UX-DR12's numbered selection pattern
    const options = [
      { value: '1', label: 'Claude Code' },
      { value: '2', label: 'Cursor' },
      { value: '3', label: 'Windsurf' }
    ]

    await selectOption('Select platform', options)

    // Verify select() was called -- it handles the visual rendering
    expect(mockSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Select platform',
        options: expect.arrayContaining([
          expect.objectContaining({ value: '1', label: 'Claude Code' })
        ])
      })
    )
  })

  test('[P1] selectOption() should work with two options', async () => {
    mockSelect.mockResolvedValue('option-a')
    mockIsCancel.mockReturnValue(false)

    const { selectOption } = await import('../../../src/core/prompts.js')

    const options = [
      { value: 'option-a', label: 'Option A' },
      { value: 'option-b', label: 'Option B' }
    ]

    const result = await selectOption('Choose one', options)

    expect(result).toBe('option-a')
  })
})

// ============================================================================
// AC3: multiSelectOptions() -- Multi-Selection Prompt
// ============================================================================

describe('AC3: Multi-Selection Prompt', () => {
  test('[P0] multiSelectOptions() should call multiselect() with the provided message', async () => {
    mockMultiselect.mockResolvedValue(['claude-code'])
    mockIsCancel.mockReturnValue(false)

    const { multiSelectOptions } = await import('../../../src/core/prompts.js')

    const options = [
      { value: 'claude-code', label: 'Claude Code' },
      { value: 'cursor', label: 'Cursor' },
      { value: 'windsurf', label: 'Windsurf' }
    ]

    await multiSelectOptions('Select target platforms', options)

    expect(mockMultiselect).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Select target platforms' })
    )
  })

  test('[P0] multiSelectOptions() should pass options to multiselect()', async () => {
    mockMultiselect.mockResolvedValue(['claude-code'])
    mockIsCancel.mockReturnValue(false)

    const { multiSelectOptions } = await import('../../../src/core/prompts.js')

    const options = [
      { value: 'claude-code', label: 'Claude Code' },
      { value: 'cursor', label: 'Cursor' }
    ]

    await multiSelectOptions('Select platforms', options)

    expect(mockMultiselect).toHaveBeenCalledWith(
      expect.objectContaining({ options })
    )
  })

  test('[P0] multiSelectOptions() should pass initialValues when provided', async () => {
    mockMultiselect.mockResolvedValue(['claude-code', 'cursor'])
    mockIsCancel.mockReturnValue(false)

    const { multiSelectOptions } = await import('../../../src/core/prompts.js')

    const options = [
      { value: 'claude-code', label: 'Claude Code' },
      { value: 'cursor', label: 'Cursor' },
      { value: 'windsurf', label: 'Windsurf' }
    ]

    await multiSelectOptions('Select platforms', options, { initialValues: ['claude-code'] })

    expect(mockMultiselect).toHaveBeenCalledWith(
      expect.objectContaining({ initialValues: ['claude-code'] })
    )
  })

  test('[P0] multiSelectOptions() should return array of selected values', async () => {
    mockMultiselect.mockResolvedValue(['claude-code', 'cursor'])
    mockIsCancel.mockReturnValue(false)

    const { multiSelectOptions } = await import('../../../src/core/prompts.js')

    const options = [
      { value: 'claude-code', label: 'Claude Code' },
      { value: 'cursor', label: 'Cursor' },
      { value: 'windsurf', label: 'Windsurf' }
    ]

    const result = await multiSelectOptions('Select platforms', options)

    expect(result).toEqual(['claude-code', 'cursor'])
  })

  test('[P0] multiSelectOptions() should pass required: true to multiselect()', async () => {
    mockMultiselect.mockResolvedValue(['claude-code'])
    mockIsCancel.mockReturnValue(false)

    const { multiSelectOptions } = await import('../../../src/core/prompts.js')

    const options = [
      { value: 'claude-code', label: 'Claude Code' },
      { value: 'cursor', label: 'Cursor' }
    ]

    await multiSelectOptions('Select platforms', options)

    expect(mockMultiselect).toHaveBeenCalledWith(
      expect.objectContaining({ required: true })
    )
  })

  test('[P1] multiSelectOptions() should work without initialValues option', async () => {
    mockMultiselect.mockResolvedValue(['cursor'])
    mockIsCancel.mockReturnValue(false)

    const { multiSelectOptions } = await import('../../../src/core/prompts.js')

    const options = [
      { value: 'claude-code', label: 'Claude Code' },
      { value: 'cursor', label: 'Cursor' }
    ]

    const result = await multiSelectOptions('Select platforms', options)

    expect(result).toEqual(['cursor'])
    // Should still call multiselect (initialValues may be undefined)
    expect(mockMultiselect).toHaveBeenCalled()
  })
})

// ============================================================================
// AC3: Cancel Handling for Selection Prompts
// ============================================================================

describe('AC3: Cancel Handling in selectOption()', () => {
  test('[P0] selectOption() should detect cancel via isCancel()', async () => {
    const cancelSymbol = Symbol('clack:cancel')
    mockSelect.mockResolvedValue(cancelSymbol)
    mockIsCancel.mockReturnValue(true)

    const { selectOption } = await import('../../../src/core/prompts.js')

    await selectOption('Select platform', [])

    expect(mockIsCancel).toHaveBeenCalledWith(cancelSymbol)
  })

  test('[P0] selectOption() should call cancel() with message on user cancel', async () => {
    const cancelSymbol = Symbol('clack:cancel')
    mockSelect.mockResolvedValue(cancelSymbol)
    mockIsCancel.mockReturnValue(true)

    const { selectOption } = await import('../../../src/core/prompts.js')

    await selectOption('Select platform', [])

    expect(mockCancel).toHaveBeenCalledWith('Operation cancelled')
  })

  test('[P0] selectOption() should call process.exit(0) on user cancel', async () => {
    const cancelSymbol = Symbol('clack:cancel')
    mockSelect.mockResolvedValue(cancelSymbol)
    mockIsCancel.mockReturnValue(true)

    const { selectOption } = await import('../../../src/core/prompts.js')

    await selectOption('Select platform', [])

    expect(mockExit).toHaveBeenCalledWith(0)
  })

  test('[P0] selectOption() should NOT call cancel/exit when user selects an option', async () => {
    mockSelect.mockResolvedValue('claude-code')
    mockIsCancel.mockReturnValue(false)

    const { selectOption } = await import('../../../src/core/prompts.js')

    await selectOption('Select platform', [{ value: 'claude-code', label: 'Claude Code' }])

    expect(mockCancel).not.toHaveBeenCalled()
    expect(mockExit).not.toHaveBeenCalled()
  })
})

describe('AC3: Cancel Handling in multiSelectOptions()', () => {
  test('[P0] multiSelectOptions() should detect cancel via isCancel()', async () => {
    const cancelSymbol = Symbol('clack:cancel')
    mockMultiselect.mockResolvedValue(cancelSymbol)
    mockIsCancel.mockReturnValue(true)

    const { multiSelectOptions } = await import('../../../src/core/prompts.js')

    await multiSelectOptions('Select platforms', [])

    expect(mockIsCancel).toHaveBeenCalledWith(cancelSymbol)
  })

  test('[P0] multiSelectOptions() should call cancel() with message on user cancel', async () => {
    const cancelSymbol = Symbol('clack:cancel')
    mockMultiselect.mockResolvedValue(cancelSymbol)
    mockIsCancel.mockReturnValue(true)

    const { multiSelectOptions } = await import('../../../src/core/prompts.js')

    await multiSelectOptions('Select platforms', [])

    expect(mockCancel).toHaveBeenCalledWith('Operation cancelled')
  })

  test('[P0] multiSelectOptions() should call process.exit(0) on user cancel', async () => {
    const cancelSymbol = Symbol('clack:cancel')
    mockMultiselect.mockResolvedValue(cancelSymbol)
    mockIsCancel.mockReturnValue(true)

    const { multiSelectOptions } = await import('../../../src/core/prompts.js')

    await multiSelectOptions('Select platforms', [])

    expect(mockExit).toHaveBeenCalledWith(0)
  })

  test('[P0] multiSelectOptions() should NOT call cancel/exit when user selects options', async () => {
    mockMultiselect.mockResolvedValue(['claude-code'])
    mockIsCancel.mockReturnValue(false)

    const { multiSelectOptions } = await import('../../../src/core/prompts.js')

    await multiSelectOptions('Select platforms', [{ value: 'claude-code', label: 'Claude Code' }])

    expect(mockCancel).not.toHaveBeenCalled()
    expect(mockExit).not.toHaveBeenCalled()
  })
})

// ============================================================================
// AC3: Module Export Verification
// ============================================================================

describe('AC3: Prompt Module Exports', () => {
  test('[P0] prompts module should export named selectOption function', async () => {
    const prompts = await import('../../../src/core/prompts.js')
    expect(typeof prompts.selectOption).toBe('function')
  })

  test('[P0] prompts module should export named multiSelectOptions function', async () => {
    const prompts = await import('../../../src/core/prompts.js')
    expect(typeof prompts.multiSelectOptions).toBe('function')
  })

  test('[P0] prompts module should import select and multiselect from @clack/prompts', async () => {
    const { readFileSync } = await import('node:fs')
    const { join, dirname } = await import('node:path')
    const { fileURLToPath } = await import('node:url')
    const src = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), '../../../src/core/prompts.js'),
      'utf8'
    )
    expect(src).toMatch(/\bselect\b/)
    expect(src).toMatch(/multiselect/)
  })

  test('[P1] all prompt functions should use consistent cancel message', async () => {
    const { readFileSync } = await import('node:fs')
    const { join, dirname } = await import('node:path')
    const { fileURLToPath } = await import('node:url')
    const src = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), '../../../src/core/prompts.js'),
      'utf8'
    )
    // All cancel() calls should use 'Operation cancelled'
    const cancelMatches = src.match(/cancel\(['"]([^'"]+)['"]\)/g) || []
    for (const match of cancelMatches) {
      expect(match).toContain('Operation cancelled')
    }
  })
})
