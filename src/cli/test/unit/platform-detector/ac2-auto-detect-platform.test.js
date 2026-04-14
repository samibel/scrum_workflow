/**
 * ATDD Tests for AC2: Platform Auto-Detection
 *
 * TDD Phase: RED (tests written before implementation -- will fail until platform-detector.js exists)
 * Test Level: Unit
 * Test Framework: Vitest
 * Story: 6.4 - Implement Zero-Config Installation Flow
 *
 * PRD References:
 * - UX-DR4: Auto-detection of AI platform
 * - NFR-2: No external service dependency (local filesystem only)
 * - NFR-14: Error recovery -- auto-detection failure falls back to claude-code default
 *
 * AC2: Given UX-DR4 specifies auto-detection of AI platform
 *      When the CLI runs in a project directory
 *      Then the AI platform is automatically detected (Claude Code, Cursor, Windsurf, etc.)
 *      And the detection result is displayed as info: "Auto-detected platform: claude-code"
 */

import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { join } from 'node:path'
import { mkdirSync, rmSync, existsSync } from 'node:fs'

// Use memfs for filesystem mocking
import { fs as memfsFs, vol } from 'memfs'
import { createFsFromVolume, Volume } from 'memfs'

// Mock node:fs to use memfs
vi.mock('node:fs', async (importOriginal) => {
  const original = await importOriginal()
  return {
    ...original,
    existsSync: (path) => {
      // Use memfs for test paths
      return vol.existsSync(path)
    }
  }
})

beforeEach(() => {
  vol.reset()
})

afterEach(() => {
  vol.reset()
})

// ============================================================================
// AC2: detectPlatforms() -- Core Detection Logic
// ============================================================================

describe('AC2: Platform Auto-Detection', () => {
  test('[P0] detectPlatforms() should detect Claude Code via .claude/ marker', async () => {
    vol.mkdirSync('/test-project/.claude', { recursive: true })

    const { detectPlatforms } = await import('../../../src/platform/platform-detector.js')
    const result = detectPlatforms('/test-project')

    expect(result).toEqual(['claude-code'])
  })

  test('[P0] detectPlatforms() should detect Cursor via .cursor/ marker', async () => {
    vol.mkdirSync('/test-project/.cursor', { recursive: true })

    const { detectPlatforms } = await import('../../../src/platform/platform-detector.js')
    const result = detectPlatforms('/test-project')

    expect(result).toEqual(['cursor'])
  })

  test('[P0] detectPlatforms() should detect Windsurf via .windsurf/ marker', async () => {
    vol.mkdirSync('/test-project/.windsurf', { recursive: true })

    const { detectPlatforms } = await import('../../../src/platform/platform-detector.js')
    const result = detectPlatforms('/test-project')

    expect(result).toEqual(['windsurf'])
  })

  test('[P0] detectPlatforms() should detect GitHub Copilot via .github/ marker', async () => {
    vol.mkdirSync('/test-project/.github', { recursive: true })

    const { detectPlatforms } = await import('../../../src/platform/platform-detector.js')
    const result = detectPlatforms('/test-project')

    expect(result).toEqual(['github-copilot'])
  })

  test('[P0] detectPlatforms() should detect Cline via .cline/ marker', async () => {
    vol.mkdirSync('/test-project/.cline', { recursive: true })

    const { detectPlatforms } = await import('../../../src/platform/platform-detector.js')
    const result = detectPlatforms('/test-project')

    expect(result).toEqual(['cline'])
  })

  test('[P0] detectPlatforms() should detect Agents Universal via .agents/ marker', async () => {
    vol.mkdirSync('/test-project/.agents', { recursive: true })

    const { detectPlatforms } = await import('../../../src/platform/platform-detector.js')
    const result = detectPlatforms('/test-project')

    expect(result).toEqual(['agents-universal'])
  })

  test('[P0] detectPlatforms() should default to claude-code when no markers found', async () => {
    // Empty project -- no marker directories
    vol.mkdirSync('/test-project', { recursive: true })

    const { detectPlatforms } = await import('../../../src/platform/platform-detector.js')
    const result = detectPlatforms('/test-project')

    expect(result).toEqual(['claude-code'])
  })

  test('[P0] detectPlatforms() should detect multiple platforms when multiple markers exist', async () => {
    vol.mkdirSync('/test-project/.claude', { recursive: true })
    vol.mkdirSync('/test-project/.cursor', { recursive: true })

    const { detectPlatforms } = await import('../../../src/platform/platform-detector.js')
    const result = detectPlatforms('/test-project')

    expect(result).toContain('claude-code')
    expect(result).toContain('cursor')
    expect(result.length).toBe(2)
  })

  test('[P1] detectPlatforms() should detect all six platforms when all markers exist', async () => {
    vol.mkdirSync('/test-project/.claude', { recursive: true })
    vol.mkdirSync('/test-project/.cursor', { recursive: true })
    vol.mkdirSync('/test-project/.windsurf', { recursive: true })
    vol.mkdirSync('/test-project/.github', { recursive: true })
    vol.mkdirSync('/test-project/.cline', { recursive: true })
    vol.mkdirSync('/test-project/.agents', { recursive: true })

    const { detectPlatforms } = await import('../../../src/platform/platform-detector.js')
    const result = detectPlatforms('/test-project')

    expect(result).toHaveLength(6)
    expect(result).toContain('claude-code')
    expect(result).toContain('cursor')
    expect(result).toContain('windsurf')
    expect(result).toContain('github-copilot')
    expect(result).toContain('cline')
    expect(result).toContain('agents-universal')
  })

  test('[P1] detectPlatforms() should not detect platform from non-marker directories', async () => {
    vol.mkdirSync('/test-project/src', { recursive: true })
    vol.mkdirSync('/test-project/node_modules', { recursive: true })
    vol.mkdirSync('/test-project/.git', { recursive: true })

    const { detectPlatforms } = await import('../../../src/platform/platform-detector.js')
    const result = detectPlatforms('/test-project')

    // No recognized markers -- falls back to claude-code
    expect(result).toEqual(['claude-code'])
  })

  test('[P1] detectPlatforms() should handle marker directory with files inside', async () => {
    vol.mkdirSync('/test-project/.claude/skills', { recursive: true })
    vol.fromJSON({
      '/test-project/.claude/settings.json': '{}'
    })

    const { detectPlatforms } = await import('../../../src/platform/platform-detector.js')
    const result = detectPlatforms('/test-project')

    expect(result).toEqual(['claude-code'])
  })
})

// ============================================================================
// AC2: Marker Directory Mapping
// ============================================================================

describe('AC2: Platform Marker Registry', () => {
  test('[P0] platform-detector.js should define marker-to-code mapping', async () => {
    const { readFileSync } = await import('node:fs')
    const { join, dirname } = await import('node:path')
    const { fileURLToPath } = await import('node:url')
    const src = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), '../../../src/platform/platform-detector.js'),
      'utf8'
    )

    // Verify marker mapping entries
    expect(src).toMatch(/\.claude.*claude-code/)
    expect(src).toMatch(/\.cursor.*cursor/)
    expect(src).toMatch(/\.windsurf.*windsurf/)
    expect(src).toMatch(/\.github.*github-copilot/)
    expect(src).toMatch(/\.cline.*cline/)
    expect(src).toMatch(/\.agents.*agents-universal/)
  })

  test('[P0] platform-detector.js should use existsSync for detection', async () => {
    const { readFileSync } = await import('node:fs')
    const { join, dirname } = await import('node:path')
    const { fileURLToPath } = await import('node:url')
    const src = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), '../../../src/platform/platform-detector.js'),
      'utf8'
    )

    expect(src).toMatch(/existsSync/)
  })
})

// ============================================================================
// AC2: Module Export Verification
// ============================================================================

describe('AC2: Platform Detector Module Exports', () => {
  test('[P0] platform-detector.js should export named detectPlatforms function', async () => {
    const detector = await import('../../../src/platform/platform-detector.js')
    expect(typeof detector.detectPlatforms).toBe('function')
  })

  test('[P0] platform-detector.js should import from node:fs', async () => {
    const { readFileSync } = await import('node:fs')
    const { join, dirname } = await import('node:path')
    const { fileURLToPath } = await import('node:url')
    const src = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), '../../../src/platform/platform-detector.js'),
      'utf8'
    )

    expect(src).toMatch(/from\s+['"]node:fs['"]/)
  })

  test('[P0] platform-detector.js should import from node:path', async () => {
    const { readFileSync } = await import('node:fs')
    const { join, dirname } = await import('node:path')
    const { fileURLToPath } = await import('node:url')
    const src = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), '../../../src/platform/platform-detector.js'),
      'utf8'
    )

    expect(src).toMatch(/from\s+['"]node:path['"]/)
  })

  test('[P1] platform-detector.js should NOT use console.log for detection result', async () => {
    const { readFileSync } = await import('node:fs')
    const { join, dirname } = await import('node:path')
    const { fileURLToPath } = await import('node:url')
    const src = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), '../../../src/platform/platform-detector.js'),
      'utf8'
    )

    // Detection logic should be pure -- no console.log
    expect(src).not.toMatch(/console\.log/)
  })
})

// ============================================================================
// AC2: NFR Compliance -- Error Recovery & No External Dependencies
// ============================================================================

describe('AC2: NFR Compliance', () => {
  test('[P0] detectPlatforms() should default to claude-code on non-existent directory (NFR-14)', async () => {
    // Don't create any directory -- simulates non-existent path
    const { detectPlatforms } = await import('../../../src/platform/platform-detector.js')
    const result = detectPlatforms('/nonexistent/path')

    // NFR-14: Error recovery -- falls back to claude-code default
    expect(result).toEqual(['claude-code'])
  })

  test('[P1] detectPlatforms() should use only local filesystem (NFR-2)', async () => {
    const { readFileSync } = await import('node:fs')
    const { join, dirname } = await import('node:path')
    const { fileURLToPath } = await import('node:url')
    const src = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), '../../../src/platform/platform-detector.js'),
      'utf8'
    )

    // NFR-2: No external service dependency -- no fetch, axios, http imports
    expect(src).not.toMatch(/import.*fetch|import.*axios|import.*http/)
    // Only uses node:fs and node:path
    expect(src).toMatch(/existsSync/)
  })
})
