import { createHash } from 'node:crypto'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

/**
 * Compute SHA-256 hex digest for a single file.
 *
 * Reads raw bytes (Buffer) to ensure consistent hashes across platforms
 * regardless of line-ending normalization or encoding differences.
 *
 * @param {string} filePath - Absolute path to the file
 * @returns {string} Hex-encoded SHA-256 hash
 */
export function hashFile(filePath) {
  const content = readFileSync(filePath)
  return createHash('sha256').update(content).digest('hex')
}

/**
 * Recursively walk a directory and compute SHA-256 hashes for every file.
 *
 * @param {string} dirPath - Absolute path to the directory to walk
 * @param {string} basePath - Project root used to compute relative keys
 * @returns {Object<string, string>} Map of relative paths to `sha256:<hex>` strings, sorted alphabetically
 */
export function hashDirectory(dirPath, basePath) {
  const hashes = {}
  walkDir(dirPath, basePath, hashes)

  // Sort entries alphabetically for deterministic output
  const sorted = {}
  for (const key of Object.keys(hashes).sort()) {
    sorted[key] = hashes[key]
  }
  return sorted
}

/**
 * Hash an array of { dir, files } entries (e.g., skill registrations across multiple platform dirs).
 *
 * @param {Array<{ dir: string, files: string[] }>} fileEntries - Each entry is a directory path + array of relative file paths within it
 * @param {string} basePath - Project root used to compute relative keys
 * @returns {Object<string, string>} Map of relative paths to `sha256:<hex>` strings, sorted alphabetically
 */
export function hashFiles(fileEntries, basePath) {
  const hashes = {}

  for (const { dir, files } of fileEntries) {
    for (const file of files) {
      const fullPath = join(dir, file)
      const relPath = relative(basePath, fullPath)
      hashes[relPath] = `sha256:${hashFile(fullPath)}`
    }
  }

  // Sort entries alphabetically for deterministic output
  const sorted = {}
  for (const key of Object.keys(hashes).sort()) {
    sorted[key] = hashes[key]
  }
  return sorted
}

/**
 * Internal recursive directory walker.
 */
function walkDir(dirPath, basePath, hashes) {
  const entries = readdirSync(dirPath)
  for (const entry of entries) {
    const fullPath = join(dirPath, entry)
    if (statSync(fullPath).isDirectory()) {
      walkDir(fullPath, basePath, hashes)
    } else {
      const relPath = relative(basePath, fullPath)
      hashes[relPath] = `sha256:${hashFile(fullPath)}`
    }
  }
}
