import { existsSync, mkdtempSync } from 'node:fs'
import { join, resolve, dirname } from 'node:path'
import { tmpdir } from 'node:os'
import { createRequire } from 'node:module'
import fse from 'fs-extra'
import { intro, spinner, log, outro } from '@clack/prompts'
import { readLockFile, writeLockFile } from '../integrity/lock-file.js'
import { hashFile, hashDirectory } from '../integrity/hash-tracker.js'
import { resolveInstallPaths } from '../core/path-resolver.js'
import { loadPlatformRegistry } from '../platform/platform-registry.js'
import { registerSkills } from '../core/skill-registrar.js'

const { copySync, ensureDirSync, removeSync } = fse

const require = createRequire(import.meta.url)
const pkg = require('../../package.json')

/**
 * Update an existing scrum_workflow installation while preserving user-modified files.
 *
 * Pipeline:
 *   1. Read lock file
 *   2. Classify files (unchanged / user-modified / missing)
 *   3. Back up user-modified files to OS temp dir
 *   4. Overwrite all tracked files from installer templates + re-register skills
 *   5. Restore user-modified files from backup
 *   6. Regenerate lock file with new hashes
 *   7. Print summary
 *
 * @param {object} options - CLI options: { directory }
 */
export async function update(options) {
  intro('Update scrum_workflow installation')

  const targetDir = resolve(options.directory)

  // ── Step 1: Read lock file ──────────────────────────────────────────
  const lockData = readLockFile(targetDir)

  if (lockData === null) {
    log.error('No existing installation found. Run `install` first.')
    outro('Update aborted')
    return
  }

  // ── Reconstruct config from lock file ───────────────────────────────
  const config = {
    directory: targetDir,
    frameworkPath: lockData.framework_path,
    platforms: lockData.platforms
  }

  const registry = loadPlatformRegistry()
  const paths = resolveInstallPaths(config, registry)

  // ── Step 2: Classify files ──────────────────────────────────────────
  const unchanged = []
  const userModified = []
  const missing = []

  {
    const s = spinner()
    s.start('Analyzing installed files...')
    try {
      for (const [relPath, storedHash] of Object.entries(lockData.files)) {
        const absPath = join(targetDir, relPath)

        if (!existsSync(absPath)) {
          missing.push(relPath)
          continue
        }

        const currentHash = hashFile(absPath)
        if (storedHash === `sha256:${currentHash}`) {
          unchanged.push(relPath)
        } else {
          userModified.push(relPath)
        }
      }
      s.stop('File analysis complete')
    } catch (err) {
      s.stop('File analysis failed')
      throw err
    }
  }

  // ── "Up to date" check ─────────────────────────────────────────────
  // If no files are user-modified or missing, check whether the source
  // templates have actually changed compared to what is installed. If
  // every tracked file already matches the new template, nothing needs
  // to happen.
  if (userModified.length === 0 && missing.length === 0) {
    // Compute hashes for the current installer templates
    const sourceFrameworkHashes = hashDirectory(paths.templateSourceDir, paths.templateSourceDir)

    // Re-key source hashes: template-relative paths → target-relative paths
    // e.g., "config.yaml" → "scrum_workflow/config.yaml"
    const sourceHashes = {}
    for (const [relPath, hash] of Object.entries(sourceFrameworkHashes)) {
      const targetRelPath = join(config.frameworkPath, relPath)
      sourceHashes[targetRelPath] = hash
    }

    // Also hash skill registration templates after substitution would apply
    // (we compare against already-installed skill files, which are already
    // hashed in the lock file). For skills, the lock file stores the hash of
    // the *substituted* content. If the template + frameworkPath haven't
    // changed, the installed skill files will match. We can simply compare
    // the lock file hashes against the currently installed files -- which we
    // already know all match (unchanged array covers them all). So we only
    // need to check framework files against source templates.
    let isUpToDate = true
    for (const relPath of unchanged) {
      const storedHash = lockData.files[relPath]
      const sourceHash = sourceHashes[relPath]
      // If a source hash exists and differs from stored, templates have changed
      if (sourceHash && sourceHash !== storedHash) {
        isUpToDate = false
        break
      }
      // Skill files (not in sourceHashes) are unchanged, so they are fine
    }

    if (isUpToDate) {
      log.info('Installation is up to date. No changes needed.')
      outro('Update complete!')
      return
    }
  }

  // ── Step 3-5: Backup, overwrite, restore ────────────────────────────
  let backupDir = null

  try {
    // ── Step 3: Back up user-modified files ────────────────────────────
    if (userModified.length > 0) {
      const s = spinner()
      s.start('Backing up user-modified files...')
      try {
        backupDir = mkdtempSync(join(tmpdir(), 'scrum-workflow-backup-'))

        for (const relPath of userModified) {
          const srcPath = join(targetDir, relPath)
          const backupPath = join(backupDir, relPath)
          ensureDirSync(dirname(backupPath))
          copySync(srcPath, backupPath)
        }
        s.stop('Backup complete')
      } catch (err) {
        s.stop('Backup failed')
        throw err
      }
    }

    // ── Step 4: Overwrite with new installer files ────────────────────
    {
      const s = spinner()
      s.start('Updating framework files...')
      try {
        // Copy framework templates
        copySync(paths.templateSourceDir, paths.frameworkDir)

        // Re-register skills (substitutes {{framework_path}})
        registerSkills(paths, config)

        s.stop('Framework files updated')
      } catch (err) {
        s.stop('Framework update failed')
        throw err
      }
    }

    // ── Step 5: Restore user-modified files ───────────────────────────
    if (userModified.length > 0 && backupDir) {
      const s = spinner()
      s.start('Restoring user modifications...')
      try {
        for (const relPath of userModified) {
          const backupPath = join(backupDir, relPath)
          const restorePath = join(targetDir, relPath)
          ensureDirSync(dirname(restorePath))
          copySync(backupPath, restorePath)
        }
        s.stop('User modifications restored')
      } catch (err) {
        s.stop('Restore failed')
        throw err
      }
    }
  } finally {
    // Always clean up the temp backup directory
    if (backupDir) {
      try {
        removeSync(backupDir)
      } catch {
        // Best-effort cleanup; OS will handle it on reboot
      }
    }
  }

  // ── Step 6: Regenerate lock file ────────────────────────────────────
  {
    const s = spinner()
    s.start('Updating lock file...')
    try {
      // Hash all framework files
      const frameworkHashes = hashDirectory(paths.frameworkDir, targetDir)

      // Hash all skill registration files across all platform dirs
      const skillHashes = {}
      for (const [, platformSkillDir] of paths.platformDirs) {
        if (existsSync(platformSkillDir)) {
          const dirHashes = hashDirectory(platformSkillDir, targetDir)
          Object.assign(skillHashes, dirHashes)
        }
      }

      // Merge and sort
      const allHashes = {}
      const merged = { ...frameworkHashes, ...skillHashes }
      for (const key of Object.keys(merged).sort()) {
        allHashes[key] = merged[key]
      }

      // Build updated lock data
      const updatedLockData = {
        version: pkg.version,
        installed: lockData.installed,
        updated: new Date().toISOString(),
        platforms: lockData.platforms,
        framework_path: lockData.framework_path,
        files: allHashes
      }

      writeLockFile(targetDir, updatedLockData)
      s.stop('Lock file updated')
    } catch (err) {
      s.stop('Lock file update failed')
      throw err
    }
  }

  // ── Step 7: Print summary ───────────────────────────────────────────
  log.success(
    `Update summary:\n` +
    `  Files updated:   ${unchanged.length + missing.length}\n` +
    `  Files preserved: ${userModified.length} (user-modified)\n` +
    `  Files missing:   ${missing.length} (re-created from installer)`
  )

  if (userModified.length > 0) {
    log.info(
      'Preserved files:\n' +
      userModified.map((f) => `  ${f}`).join('\n')
    )
  }

  outro('Update complete!')
}
