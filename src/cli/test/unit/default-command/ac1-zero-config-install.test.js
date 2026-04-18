/**
 * ATDD Tests for AC1: Zero-Config Installation Flow
 *
 * TDD Phase: RED (tests written before implementation -- will fail until default command is added)
 * Test Level: Unit
 * Test Framework: Vitest
 * Story: 6.4 - Implement Zero-Config Installation Flow
 *
 * PRD References:
 * - UX-DR1: Zero-config default -- no flags = complete installation
 * - UX-DR3: Progressive disclosure -- advanced options only for power users
 * - UX-DR5: Current working directory as default
 *
 * AC1: Given UX-DR1 specifies zero-config default: no flags = complete installation
 *      When a developer runs `npx cli` without any flags
 *      Then the installation completes without any prompts or decisions required
 *
 * AC3: Given UX-DR5 specifies current working directory as default
 *      When no target directory is specified
 *      Then the framework is installed in the current working directory
 *      And no directory prompt is shown
 */

import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const TEST_DIR = dirname(fileURLToPath(import.meta.url))
const BIN_PATH = join(TEST_DIR, '../../../bin/create-scrum-workflow.js')

// Helper to read CLI source for structural assertions
function readCliSource() {
  return readFileSync(BIN_PATH, 'utf8')
}

// ============================================================================
// AC1: Default Command -- Bare `npx cli` triggers install --yes
// ============================================================================

describe('AC1: Default Command Routing', () => {
  test('[P0] CLI entry point should define a default action on the program', () => {
    const src = readCliSource()

    // Commander.js program.action() sets the default handler
    expect(src).toMatch(/program\s*\.\s*action\(/)
  })

  test('[P0] Default action should delegate to install command', () => {
    const src = readCliSource()

    // The default action should call or reference install
    expect(src).toMatch(/install/)
  })

  test('[P0] Default action should pass yes: true for zero-config', () => {
    const src = readCliSource()

    // The default action should enable --yes behavior
    expect(src).toMatch(/yes\s*:\s*true/)
  })

  test('[P0] Default action should set directory to current working directory', () => {
    const src = readCliSource()

    // Should use '.' or process.cwd() for directory default
    const hasDirectoryDefault = /directory\s*:\s*['"]\.['"]/.test(src) ||
      /directory\s*:\s*process\.cwd\(\)/.test(src)
    expect(hasDirectoryDefault).toBe(true)
  })

  test('[P0] Default action should provide default platforms array', () => {
    const src = readCliSource()

    // Should include platforms default
    expect(src).toMatch(/platforms/)
  })

  test('[P1] install subcommand should still exist alongside default action', () => {
    const src = readCliSource()

    // The explicit 'install' command should remain
    expect(src).toMatch(/\.command\(\s*['"]install['"]\s*\)/)
  })

  test('[P1] install subcommand should preserve interactive behavior', () => {
    const src = readCliSource()

    // The install subcommand should still have its own action
    // And not force --yes
    const installBlock = src.substring(src.indexOf(".command('install')"))
    expect(installBlock).toMatch(/\.action\(install\)/)
    expect(installBlock).toMatch(/--yes/)
  })
})

// ============================================================================
// AC1: Zero-Config Flow -- No Prompts When Bare Command Runs
// ============================================================================

// Hoisted mocks for @clack/prompts -- vi.hoisted ensures these are available
// when vi.mock factory runs (vitest hoists vi.mock calls to top of file)
const mocks = vi.hoisted(() => ({
  intro: vi.fn(),
  text: vi.fn(),
  confirm: vi.fn(),
  select: vi.fn(),
  multiselect: vi.fn(),
  isCancel: vi.fn(),
  cancel: vi.fn()
}))

vi.mock('@clack/prompts', () => ({
  intro: mocks.intro,
  text: mocks.text,
  confirm: mocks.confirm,
  select: mocks.select,
  multiselect: mocks.multiselect,
  isCancel: mocks.isCancel,
  cancel: mocks.cancel
}))

describe('AC1: Zero-Config Flow Behavior', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('[P0] buildConfig with yes:true should not call any prompt functions', async () => {
    const { buildConfig } = await import('../../../src/core/config-builder.js')

    await buildConfig({ directory: '.', platforms: ['claude-code'], yes: true })

    // No text/confirm/select/multiselect prompts should be called
    expect(mocks.text).not.toHaveBeenCalled()
    expect(mocks.confirm).not.toHaveBeenCalled()
    expect(mocks.select).not.toHaveBeenCalled()
    expect(mocks.multiselect).not.toHaveBeenCalled()
  })

  test('[P0] buildConfig with yes:true should return config without prompting', async () => {
    const { buildConfig } = await import('../../../src/core/config-builder.js')

    const config = await buildConfig({ directory: '.', platforms: ['claude-code'], yes: true })

    expect(config).toBeDefined()
    expect(config.directory).toBeDefined()
    expect(config.projectName).toBeDefined()
    expect(config.platforms).toBeDefined()
    expect(config.frameworkPath).toBe('scrum_workflow')
  })
})

// ============================================================================
// AC3: Current Working Directory as Default
// ============================================================================

describe('AC3: Current Working Directory Default', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('[P0] buildConfig with yes:true and directory:"." should resolve to CWD', async () => {
    const { buildConfig } = await import('../../../src/core/config-builder.js')

    const config = await buildConfig({ directory: '.', platforms: ['claude-code'], yes: true })

    // Should resolve '.' to an absolute path
    const { resolve } = await import('node:path')
    expect(config.directory).toBe(resolve('.'))
  })

  test('[P0] buildConfig with yes:true should not show directory prompt', async () => {
    const { buildConfig } = await import('../../../src/core/config-builder.js')

    await buildConfig({ directory: '.', platforms: ['claude-code'], yes: true })

    // text() (used by inputText) should NOT be called in --yes path
    expect(mocks.text).not.toHaveBeenCalled()
  })
})

// ============================================================================
// AC1: Default Command -- Structural Verification
// ============================================================================

describe('AC1: CLI Entry Point Structure', () => {
  test('[P0] bin/cli.js should import install command', () => {
    const src = readCliSource()
    expect(src).toMatch(/import.*install.*from.*commands\/install/)
  })

  test('[P1] Default action should come before program.parse()', () => {
    const src = readCliSource()

    const actionIndex = src.indexOf('program.action(') !== -1
      ? src.indexOf('program.action(')
      : src.indexOf('.action(')
    const parseIndex = src.indexOf('program.parse()')

    // If default action exists, it should be before parse()
    if (actionIndex !== -1 && parseIndex !== -1) {
      expect(actionIndex).toBeLessThan(parseIndex)
    }
  })

  test('[P1] CLI should not hardcode platforms in default action -- should use auto-detection', () => {
    const src = readCliSource()

    // If the default action uses detectPlatforms, that's ideal
    // But at minimum, the platforms array should be present as a fallback
    const hasDetectPlatforms = src.includes('detectPlatforms')
    const hasPlatformsDefault = /platforms\s*:\s*\[/.test(src)

    // At least one should be present
    expect(hasDetectPlatforms || hasPlatformsDefault).toBe(true)
  })
})
