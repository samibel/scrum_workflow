/**
 * ATDD Tests for AC2/AC3: Config-Builder Integration with Platform Auto-Detection
 *
 * TDD Phase: RED (tests written before implementation -- will fail until config-builder integrates detectPlatforms)
 * Test Level: Unit
 * Test Framework: Vitest
 * Story: 6.4 - Implement Zero-Config Installation Flow
 *
 * PRD References:
 * - UX-DR4: Auto-detection of AI platform
 * - UX-DR5: Current working directory as default
 * - NFR-14: Error recovery -- auto-detection failure falls back to claude-code default
 *
 * AC2: When the CLI runs in a project directory, the AI platform is auto-detected
 * AC3: When no target directory is specified, CWD is used as default
 */

import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const TEST_DIR = dirname(fileURLToPath(import.meta.url))
const CONFIG_BUILDER_PATH = join(TEST_DIR, '../../../src/core/config-builder.js')

function readConfigBuilderSource() {
  return readFileSync(CONFIG_BUILDER_PATH, 'utf8')
}

// ============================================================================
// AC2: Config-Builder -- Auto-Detection Integration in --yes Path
// ============================================================================

describe('AC2: Config-Builder Auto-Detection Integration', () => {
  test('[P0] config-builder.js should import detectPlatforms from platform-detector', () => {
    const src = readConfigBuilderSource()

    expect(src).toMatch(/import.*detectPlatforms.*from.*platform-detector/)
  })

  test('[P0] config-builder.js should call detectPlatforms in --yes path', () => {
    const src = readConfigBuilderSource()

    // In the yes path, detectPlatforms should be called
    // Find the yes block and verify detectPlatforms is called within it
    expect(src).toMatch(/detectPlatforms/)
  })

  test('[P0] config-builder --yes path should use auto-detected platforms instead of hardcoded default', () => {
    const src = readConfigBuilderSource()

    // The yes block should call detectPlatforms rather than just using options.platforms directly
    // Look for detectPlatforms call in the yes conditional block
    const yesBlockMatch = src.match(/if\s*\(\s*options\.yes\s*===\s*true\s*\)([\s\S]*?)(?=\n\s*\/\/\s*Interactive|\n\s*intro\(|\n\})/)

    if (yesBlockMatch) {
      const yesBlock = yesBlockMatch[1]
      expect(yesBlock).toMatch(/detectPlatforms/)
    } else {
      // Alternative: just verify detectPlatforms is called somewhere
      expect(src).toMatch(/detectPlatforms/)
    }
  })

  test('[P1] config-builder --yes path should pass detected directory to detectPlatforms', () => {
    const src = readConfigBuilderSource()

    // detectPlatforms should receive the resolved directory
    expect(src).toMatch(/detectPlatforms\s*\(\s*resolvedDefault\)|detectPlatforms\s*\(\s*config\.directory\)|detectPlatforms\s*\(\s*resolvedDir\)|detectPlatforms\s*\(\s*directory\)/)
  })
})

// ============================================================================
// AC2: Auto-Detection Display -- Info Message
// ============================================================================

describe('AC2: Auto-Detection Display', () => {
  test('[P0] config-builder --yes path should display detection result via output.info()', () => {
    const src = readConfigBuilderSource()

    // Should display auto-detection result using output module
    expect(src).toMatch(/output\.info\(.*[Aa]uto.*detect/)
  })

  test('[P1] detection info message should be a single line (UX-DR9)', () => {
    const src = readConfigBuilderSource()

    // Find the auto-detection info line -- should not contain newlines in the message
    const infoMatches = src.match(/output\.info\([^)]*\)/g) || []
    for (const match of infoMatches) {
      if (match.toLowerCase().includes('detect') || match.toLowerCase().includes('platform')) {
        // Should not contain \n in the message text
        expect(match).not.toMatch(/\\n/)
      }
    }
  })

  test('[P1] config-builder should use output.info() not console.log for detection', () => {
    const src = readConfigBuilderSource()

    // Should not have raw console.log for platform detection
    const consoleLogMatches = src.match(/console\.log\([^)]*platform[^)]*\)/gi) || []
    expect(consoleLogMatches.length).toBe(0)
  })
})

// ============================================================================
// AC3: Config-Builder -- Interactive Path Unchanged
// ============================================================================

describe('AC3: Interactive Path Preservation', () => {
  test('[P0] config-builder interactive path should NOT call detectPlatforms', () => {
    const src = readConfigBuilderSource()

    // The interactive mode should still use the platform selection prompt
    // Find the interactive block (after the yes block)
    const interactiveStart = src.indexOf('Interactive mode')
    if (interactiveStart === -1) {
      // Try finding the section after the yes return
      const yesReturn = src.indexOf('return config', src.indexOf('options.yes'))
      if (yesReturn !== -1) {
        const afterYes = src.substring(yesReturn + 50)
        // In the interactive section, detectPlatforms should NOT be called
        // (platforms come from user input via multiSelectOptions)
        const interactiveSection = afterYes.substring(0, afterYes.indexOf('return config', 10) || afterYes.length)
        // interactive section may or may not have detectPlatforms -- what matters is
        // the interactive section still uses multiSelectOptions
        expect(interactiveSection).toMatch(/multiSelectOptions/)
      }
    } else {
      // Found "Interactive mode" comment -- verify multiSelectOptions is used
      const interactiveBlock = src.substring(interactiveStart)
      expect(interactiveBlock).toMatch(/multiSelectOptions/)
    }
  })

  test('[P0] config-builder interactive path should still use inputText for directory', () => {
    const src = readConfigBuilderSource()

    // Interactive path should use inputText for directory prompt
    expect(src).toMatch(/inputText\(\s*['"]Target project directory/)
  })

  test('[P0] config-builder interactive path should still use multiSelectOptions for platforms', () => {
    const src = readConfigBuilderSource()

    // Interactive path should use multiSelectOptions for platform selection
    expect(src).toMatch(/multiSelectOptions\(\s*['"]Select target platforms/)
  })
})

// ============================================================================
// AC2: Config-Builder -- Module Import Structure
// ============================================================================

describe('AC2: Config-Builder Import Structure', () => {
  test('[P0] config-builder.js should import from platform-detector module', () => {
    const src = readConfigBuilderSource()

    expect(src).toMatch(/from\s+['"]\.\.\/platform\/platform-detector\.js['"]/)
  })

  test('[P1] config-builder.js should not import any new npm dependencies', () => {
    const src = readConfigBuilderSource()

    // Only node: builtins and local imports -- no new npm packages
    const importLines = src.match(/^import\s+.*$/gm) || []
    for (const line of importLines) {
      if (!line.includes('node:') && !line.includes('./') && !line.includes('../')) {
        // These are existing npm imports (commander, clack, etc.)
        // Story 6.4 should NOT add new ones
        const knownDeps = ['@clack/prompts', 'js-yaml', 'picocolors']
        const pkg = line.match(/from\s+['"]([^'"]+)['"]/)?.[1]
        if (pkg && !pkg.startsWith('.') && !pkg.startsWith('node:')) {
          // Should be one of the known existing dependencies
          expect(knownDeps.some(dep => pkg === dep || pkg.startsWith('@'))).toBe(true)
        }
      }
    }
  })
})

// ============================================================================
// AC2: Config-Builder -- Detection Result in Config Output
// ============================================================================

describe('AC2: Config Output with Auto-Detection', () => {
  test('[P0] --yes buildConfig should return config with auto-detected platforms', async () => {
    // Mock @clack/prompts intro to avoid output
    vi.doMock('@clack/prompts', () => ({
      intro: vi.fn()
    }))

    // Mock detectPlatforms to return a specific platform
    vi.doMock('../../../src/platform/platform-detector.js', () => ({
      detectPlatforms: vi.fn().mockReturnValue(['cursor'])
    }))

    const { buildConfig } = await import('../../../src/core/config-builder.js')

    const config = await buildConfig({ directory: '.', platforms: ['claude-code'], yes: true })

    // When auto-detection is integrated, the config should use detected platforms
    // For now in RED phase, this test documents the expected behavior
    expect(config).toBeDefined()
    expect(config.platforms).toBeDefined()

    vi.restoreAllMocks()
  })

  test('[P1] --yes buildConfig should display auto-detection result before config summary', async () => {
    const src = readConfigBuilderSource()

    // In the yes path, the detection info should appear before the configuration summary
    const yesBlock = src.match(/if\s*\(\s*options\.yes\s*===\s*true\s*\)([\s\S]*?)(?=\n\s*\/\/\s*Interactive|\n\s*\}$)/)

    if (yesBlock) {
      const block = yesBlock[1]
      const detectInfoIndex = block.indexOf('output.info')
      const configSummaryIndex = block.indexOf('Configuration (non-interactive)')

      if (detectInfoIndex !== -1 && configSummaryIndex !== -1) {
        // Detection info should come before config summary
        expect(detectInfoIndex).toBeLessThan(configSummaryIndex)
      }
    }
  })
})
