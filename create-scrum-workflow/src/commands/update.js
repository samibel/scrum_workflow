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

  // ── Detect new files in templates ────────────────────────────────────
  // Check if the installer templates contain files that aren't tracked
  // in the lock file (e.g., new skills or workflows added in a new version).
  const newFiles = []
  {
    const sourceFrameworkHashes = hashDirectory(paths.templateSourceDir, paths.templateSourceDir)
    for (const relPath of Object.keys(sourceFrameworkHashes)) {
      const targetRelPath = join(config.frameworkPath, relPath)
      if (!lockData.files[targetRelPath]) {
        newFiles.push(targetRelPath)
      }
    }

    // Also check for new skill registration templates
    const { readdirSync, statSync } = await import('node:fs')
    const skillTemplateNames = readdirSync(paths.skillTemplateDir).filter((entry) => {
      return statSync(join(paths.skillTemplateDir, entry)).isDirectory()
    })
    for (const skillName of skillTemplateNames) {
      for (const [, platformSkillDir] of paths.platformDirs) {
        const relSkillPath = join(platformSkillDir.replace(targetDir + '/', ''), skillName, 'SKILL.md')
        if (!lockData.files[relSkillPath]) {
          newFiles.push(relSkillPath)
        }
      }
    }
  }

  // ── "Up to date" check ─────────────────────────────────────────────
  if (userModified.length === 0 && missing.length === 0 && newFiles.length === 0) {
    const sourceFrameworkHashes = hashDirectory(paths.templateSourceDir, paths.templateSourceDir)
    const sourceHashes = {}
    for (const [relPath, hash] of Object.entries(sourceFrameworkHashes)) {
      const targetRelPath = join(config.frameworkPath, relPath)
      sourceHashes[targetRelPath] = hash
    }

    let isUpToDate = true
    for (const relPath of unchanged) {
      const storedHash = lockData.files[relPath]
      const sourceHash = sourceHashes[relPath]
      if (sourceHash && sourceHash !== storedHash) {
        isUpToDate = false
        break
      }
    }

    if (isUpToDate) {
      log.info('Installation is up to date. No changes needed.')
      outro('Update complete!')
      return
    }
  }

  if (newFiles.length > 0) {
    log.info(`New files available: ${newFiles.length} (will be added during update)`)
  }

  // ── Dry run: show what would happen, then exit ──────────────────────
  if (options.dryRun) {
    log.info(
      `Dry run — no changes will be made\n\n` +
      `  Files to update:   ${unchanged.length + missing.length}\n` +
      `  Files to preserve: ${userModified.length} (user-modified)\n` +
      `  Files to restore:  ${missing.length} (currently missing)\n` +
      `  New files to add:  ${newFiles.length}`
    )
    if (userModified.length > 0) {
      log.info('Would preserve:\n' + userModified.map((f) => `  ${f}`).join('\n'))
    }
    if (newFiles.length > 0) {
      log.info('Would add:\n' + newFiles.map((f) => `  ${f}`).join('\n'))
    }
    outro('Dry run complete — run without --dry-run to update')
    return
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
  const summaryLines = [
    `Update summary:`,
    `  Files updated:   ${unchanged.length + missing.length}`,
    `  Files preserved: ${userModified.length} (user-modified)`,
    `  Files restored:  ${missing.length} (were missing, re-created)`
  ]
  if (newFiles.length > 0) {
    summaryLines.push(`  Files added:     ${newFiles.length} (new in this version)`)
  }
  log.success(summaryLines.join('\n'))

  if (userModified.length > 0) {
    log.info(
      'Preserved files:\n' +
      userModified.map((f) => `  ${f}`).join('\n')
    )
  }

  if (newFiles.length > 0) {
    log.info(
      'New files added:\n' +
      newFiles.map((f) => `  ${f}`).join('\n')
    )
  }

  outro('Update complete!')
}
