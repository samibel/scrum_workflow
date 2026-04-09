/**
 * Platform auto-detection module.
 *
 * Detects AI platforms by checking for marker directories in the project root.
 * Used by the zero-config installation flow to automatically determine which
 * platforms to install for.
 *
 * Architecture compliance:
 * - UX-DR4: Auto-detection of AI platform
 * - NFR-2: No external service dependency (local filesystem only)
 * - NFR-14: Error recovery -- falls back to claude-code default
 *
 * @module platform-detector
 */

import { existsSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Marker directory to platform code mapping.
 * Each key is a directory name checked in the project root.
 * Each value is the platform code used throughout the system.
 */
const PLATFORM_MARKERS = {
  '.claude': 'claude-code',
  '.cursor': 'cursor',
  '.windsurf': 'windsurf',
  '.github': 'github-copilot',
  '.cline': 'cline',
  '.agents': 'agents-universal'
}

/**
 * Detect AI platforms present in the given directory by checking for marker directories.
 *
 * Detection logic:
 * 1. Check each marker directory for existence using existsSync()
 * 2. If exactly one found: return that platform (most common case)
 * 3. If multiple found: return all detected platforms
 * 4. If none found: default to claude-code (preferred platform per registry)
 *
 * @param {string} directory - Absolute or relative path to check
 * @returns {string[]} Array of detected platform codes (at least one entry)
 */
export function detectPlatforms(directory) {
  const detected = []
  for (const [marker, code] of Object.entries(PLATFORM_MARKERS)) {
    if (existsSync(join(directory, marker))) {
      detected.push(code)
    }
  }
  if (detected.length === 0) {
    return ['claude-code']
  }
  return detected
}
