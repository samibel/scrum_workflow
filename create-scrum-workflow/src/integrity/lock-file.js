import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const pkg = require('../../package.json')

export const LOCK_FILE_NAME = '.scrum-workflow-lock.json'

/**
 * Write lock data as pretty-printed JSON to the target directory.
 *
 * @param {string} targetDir - Absolute path to the target project root
 * @param {object} lockData - Lock file data object
 */
export function writeLockFile(targetDir, lockData) {
  const lockPath = join(targetDir, LOCK_FILE_NAME)
  writeFileSync(lockPath, JSON.stringify(lockData, null, 2) + '\n', 'utf8')
}

/**
 * Read and parse the lock file from the target directory.
 *
 * @param {string} targetDir - Absolute path to the target project root
 * @returns {object|null} Parsed lock data, or null if the file does not exist
 */
export function readLockFile(targetDir) {
  const lockPath = join(targetDir, LOCK_FILE_NAME)
  try {
    const raw = readFileSync(lockPath, 'utf8')
    return JSON.parse(raw)
  } catch (err) {
    if (err.code === 'ENOENT') {
      return null
    }
    throw err
  }
}

/**
 * Build the lock file data object.
 *
 * If an existing lock file is found, the `installed` timestamp is preserved
 * from the previous installation. Otherwise, `installed` is set to now.
 *
 * @param {object} config - Config from buildConfig(): { platforms, frameworkPath, directory, ... }
 * @param {Object<string, string>} fileHashes - Map of relative paths to `sha256:<hex>` strings
 * @returns {object} Lock file data object
 */
export function buildLockData(config, fileHashes) {
  const now = new Date().toISOString()

  // Preserve the original install timestamp if a lock file already exists
  const existing = readLockFile(config.directory)

  return {
    version: pkg.version,
    installed: existing ? existing.installed : now,
    updated: now,
    platforms: config.platforms,
    framework_path: config.frameworkPath,
    files: fileHashes
  }
}
