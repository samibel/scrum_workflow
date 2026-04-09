/**
 * ATDD Tests for AC2: Input Prompts with Defaults
 *
 * TDD Phase: RED (tests written before implementation -- will fail until prompts.js exists)
 * Test Level: Unit
 * Test Framework: Vitest
 * Story: 6.3 - Implement Interactive Prompt Patterns
 *
 * PRD References:
 * - UX-DR11: Input prompts with defaults in parentheses
 *
 * AC2: Given UX-DR11 specifies input prompts with defaults
 *      When information is missing and needs user input
 *      Then a prompt is displayed with the default value in parentheses: `? Project name: (my-project)`
 */

import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock @clack/prompts
const mockText = vi.fn()
const mockIsCancel = vi.fn()
const mockCancel = vi.fn()

vi.mock('@clack/prompts', () => ({
  text: mockText,
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
// AC2: inputText() -- Input Prompts with Default Values
// ============================================================================

describe('AC2: Input Prompts with Defaults', () => {
  test('[P0] inputText() should call text() with the provided message', async () => {
    mockText.mockResolvedValue('my-project')
    mockIsCancel.mockReturnValue(false)

    const { inputText } = await import('../../../src/core/prompts.js')

    await inputText('Project name')

    expect(mockText).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Project name' })
    )
  })

  test('[P0] inputText() should pass defaultValue to text()', async () => {
    mockText.mockResolvedValue('my-project')
    mockIsCancel.mockReturnValue(false)

    const { inputText } = await import('../../../src/core/prompts.js')

    await inputText('Project name', { defaultValue: 'my-project' })

    expect(mockText).toHaveBeenCalledWith(
      expect.objectContaining({ defaultValue: 'my-project' })
    )
  })

  test('[P0] inputText() should pass placeholder to text()', async () => {
    mockText.mockResolvedValue('custom-name')
    mockIsCancel.mockReturnValue(false)

    const { inputText } = await import('../../../src/core/prompts.js')

    await inputText('Project name', { placeholder: 'my-project' })

    expect(mockText).toHaveBeenCalledWith(
      expect.objectContaining({ placeholder: 'my-project' })
    )
  })

  test('[P0] inputText() should pass validate function to text()', async () => {
    mockText.mockResolvedValue('valid-name')
    mockIsCancel.mockReturnValue(false)

    const { inputText } = await import('../../../src/core/prompts.js')

    const validateFn = (value) => {
      if (!value || !value.trim()) return 'Project name is required'
    }

    await inputText('Project name', { validate: validateFn })

    expect(mockText).toHaveBeenCalledWith(
      expect.objectContaining({ validate: validateFn })
    )
  })

  test('[P0] inputText() should return the string result when user provides input', async () => {
    mockText.mockResolvedValue('custom-project')
    mockIsCancel.mockReturnValue(false)

    const { inputText } = await import('../../../src/core/prompts.js')

    const result = await inputText('Project name', { defaultValue: 'my-project' })

    expect(result).toBe('custom-project')
  })

  test('[P0] inputText() should return the default when user accepts default', async () => {
    mockText.mockResolvedValue('my-project')
    mockIsCancel.mockReturnValue(false)

    const { inputText } = await import('../../../src/core/prompts.js')

    const result = await inputText('Project name', { defaultValue: 'my-project' })

    expect(result).toBe('my-project')
  })

  test('[P1] inputText() should work without any options', async () => {
    mockText.mockResolvedValue('some-input')
    mockIsCancel.mockReturnValue(false)

    const { inputText } = await import('../../../src/core/prompts.js')

    const result = await inputText('Enter value')

    expect(result).toBe('some-input')
    expect(mockText).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Enter value' })
    )
  })
})

// ============================================================================
// AC2: Cancel Handling for Input Prompts
// ============================================================================

describe('AC2: Cancel Handling in inputText()', () => {
  test('[P0] inputText() should detect cancel via isCancel()', async () => {
    const cancelSymbol = Symbol('clack:cancel')
    mockText.mockResolvedValue(cancelSymbol)
    mockIsCancel.mockReturnValue(true)

    const { inputText } = await import('../../../src/core/prompts.js')

    await inputText('Project name')

    expect(mockIsCancel).toHaveBeenCalledWith(cancelSymbol)
  })

  test('[P0] inputText() should call cancel() with message on user cancel', async () => {
    const cancelSymbol = Symbol('clack:cancel')
    mockText.mockResolvedValue(cancelSymbol)
    mockIsCancel.mockReturnValue(true)

    const { inputText } = await import('../../../src/core/prompts.js')

    await inputText('Project name')

    expect(mockCancel).toHaveBeenCalledWith('Operation cancelled')
  })

  test('[P0] inputText() should call process.exit(0) on user cancel', async () => {
    const cancelSymbol = Symbol('clack:cancel')
    mockText.mockResolvedValue(cancelSymbol)
    mockIsCancel.mockReturnValue(true)

    const { inputText } = await import('../../../src/core/prompts.js')

    await inputText('Project name')

    expect(mockExit).toHaveBeenCalledWith(0)
  })

  test('[P0] inputText() should NOT call cancel/exit when user provides input', async () => {
    mockText.mockResolvedValue('valid-input')
    mockIsCancel.mockReturnValue(false)

    const { inputText } = await import('../../../src/core/prompts.js')

    await inputText('Project name')

    expect(mockCancel).not.toHaveBeenCalled()
    expect(mockExit).not.toHaveBeenCalled()
  })
})

// ============================================================================
// AC2: Config-Builder Prompt Scenarios (Directory, Project Name, Framework Path)
// ============================================================================

describe('AC2: Config-Builder Input Prompt Scenarios', () => {
  test('[P1] inputText() should support directory prompt with validation', async () => {
    mockText.mockResolvedValue('/valid/path')
    mockIsCancel.mockReturnValue(false)

    const { inputText } = await import('../../../src/core/prompts.js')

    const validateFn = (value) => {
      // Simulates config-builder directory validation
      if (!value) return 'Directory does not exist'
    }

    const result = await inputText('Target project directory', {
      defaultValue: '/default/path',
      placeholder: '/default/path',
      validate: validateFn
    })

    expect(mockText).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Target project directory',
        defaultValue: '/default/path',
        placeholder: '/default/path',
        validate: expect.any(Function)
      })
    )
    expect(result).toBe('/valid/path')
  })

  test('[P1] inputText() should support project name prompt with validation', async () => {
    mockText.mockResolvedValue('my-app')
    mockIsCancel.mockReturnValue(false)

    const { inputText } = await import('../../../src/core/prompts.js')

    const validateFn = (value) => {
      if (!value || !value.trim()) return 'Project name is required'
    }

    const result = await inputText('Project name', {
      defaultValue: 'my-app',
      placeholder: 'my-app',
      validate: validateFn
    })

    expect(result).toBe('my-app')
  })

  test('[P1] inputText() should support framework path prompt with validation', async () => {
    mockText.mockResolvedValue('scrum_workflow')
    mockIsCancel.mockReturnValue(false)

    const { inputText } = await import('../../../src/core/prompts.js')

    const validateFn = (value) => {
      if (!value || !value.trim()) return 'Framework path is required'
      if (value.includes('/') || value.includes('\\')) return 'Must be a directory name, not a path'
    }

    const result = await inputText('Framework directory name', {
      defaultValue: 'scrum_workflow',
      placeholder: 'scrum_workflow',
      validate: validateFn
    })

    expect(result).toBe('scrum_workflow')
  })
})

// ============================================================================
// AC2: Module Export Verification
// ============================================================================

describe('AC2: Prompt Module Exports', () => {
  test('[P0] prompts module should export named inputText function', async () => {
    const prompts = await import('../../../src/core/prompts.js')
    expect(typeof prompts.inputText).toBe('function')
  })

  test('[P0] prompts module should import text from @clack/prompts', async () => {
    const { readFileSync } = await import('node:fs')
    const { join, dirname } = await import('node:path')
    const { fileURLToPath } = await import('node:url')
    const src = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), '../../../src/core/prompts.js'),
      'utf8'
    )
    expect(src).toMatch(/from\s+['"]@clack\/prompts['"]/)
    expect(src).toMatch(/\btext\b/)
  })
})
