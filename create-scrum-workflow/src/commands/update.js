import { existsSync, mkdtempSync, readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join, resolve, dirname } from 'node:path'
import { tmpdir } from 'node:os'
import { createRequire } from 'node:module'
import fse from 'fs-extra'
import { intro, spinner, log, outro } from '@clack/prompts'
import yaml from 'js-yaml'
import { readLockFile, writeLockFile } from '../integrity/lock-file.js'
import { hashFile, hashDirectory } from '../integrity/hash-tracker.js'
import { resolveInstallPaths } from '../core/path-resolver.js'
import { loadPlatformRegistry } from '../platform/platform-registry.js'
import { registerSkills } from '../core/skill-registrar.js'

const { copySync, ensureDirSync, removeSync } = fse

const require = createRequire(import.meta.url)
const pkg = require('../../package.json')

// ── Breaking changes documentation ──────────────────────────────────
const BREAKING_CHANGES = [
  {
    from: '1.2.0',
    to: '1.3.0',
    changes: [
      {
        field: 'status_history',
        description: 'New mandatory status_history field in story.yaml frontmatter',
        migration: 'Automatic retroactive entry added during migration'
      },
      {
        field: 'plan.md',
        description: 'Stories at ready-for-dev now require plan.md before /scrum-dev-story',
        migration: 'Warning issued for stories missing plan.md - this is a warning only, migration continues without halting'
      }
    ]
  }
]

// ── Helper: Parse YAML frontmatter ───────────────────────────────────
/**
 * Parse YAML frontmatter from a markdown file.
 * @param {string} filePath - Absolute path to markdown file
 * @returns {{ frontmatter: object|null, body: string, error: string|null }}
 */
function parseFrontmatter(filePath) {
  try {
    const content = readFileSync(filePath, 'utf8')
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
    if (!match) {
      return { frontmatter: null, body: content, error: 'No YAML frontmatter found' }
    }
    const frontmatter = yaml.load(match[1])
    const body = match[2]
    return { frontmatter, body, error: null }
  } catch (err) {
    return { frontmatter: null, body: '', error: `YAML parse error: ${err.message}` }
  }
}

/**
 * Serialize frontmatter back to YAML string.
 * @param {object} frontmatter - Parsed frontmatter object
 * @returns {string} YAML string
 */
function serializeFrontmatter(frontmatter) {
  return yaml.dump(frontmatter, { indent: 2, lineWidth: 120 })
}

// ── Helper: Migrate status_history in story files ────────────────────
/**
 * Scan _scrum-output/sprints/ for story.md files missing status_history
 * and add retroactive entry.
 * @param {string} targetDir - Target project directory
 * @returns {{ migrated: string[], warnings: string[], errors: string[] }}
 */
function migrateStoryStatusHistory(targetDir) {
  const sprintsDir = join(targetDir, '_scrum-output', 'sprints')
  const migrated = []
  const warnings = []
  const errors = []

  if (!existsSync(sprintsDir)) {
    return { migrated, warnings, errors }
  }

  // Scan all subdirectories for story.md
  const storyDirs = readdirSync(sprintsDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .filter((dirent) => {
      return readdirSync(join(sprintsDir, dirent.name), { withFileTypes: true }).some(
        (dent) => dent.isFile() && dent.name === 'story.md'
      )
    })
    .map((dirent) => dirent.name)

  for (const storyDir of storyDirs) {
    const storyPath = join(sprintsDir, storyDir, 'story.md')
    const { frontmatter, body, error } = parseFrontmatter(storyPath)

    if (error) {
      errors.push(`${storyPath}: ${error}`)
      continue
    }

    if (!frontmatter) {
      errors.push(`${storyPath}: No frontmatter parsed`)
      continue
    }

    // Check if status_history is missing
    if (!frontmatter.status_history) {
      const currentStatus = frontmatter.status || 'draft'
      const migrationEntry = {
        from: null,
        to: currentStatus,
        timestamp: new Date().toISOString(),
        trigger: 'migrated-from-v1.2.0',
        actor: 'system'
      }

      frontmatter.status_history = [migrationEntry]

      // Write back with serialized frontmatter
      const newContent = `---\n${serializeFrontmatter(frontmatter)}---\n${body}`
      try {
        writeFileSync(storyPath, newContent, 'utf8')
        migrated.push(storyPath)
      } catch (writeErr) {
        errors.push(`${storyPath}: Failed to write: ${writeErr.message}`)
      }
    }
  }

  return { migrated, warnings, errors }
}

// ── Helper: Check plan.md for ready-for-dev stories ──────────────────
/**
 * Check stories at ready-for-dev status for missing plan.md.
 * @param {string} targetDir - Target project directory
 * @returns {{ flagged: string[], suggestions: string[] }}
 */
function checkPlanMdForReadyStories(targetDir) {
  const sprintsDir = join(targetDir, '_scrum-output', 'sprints')
  const flagged = []
  const suggestions = []

  if (!existsSync(sprintsDir)) {
    return { flagged, suggestions }
  }

  // Scan all subdirectories for story.md
  const storyDirs = readdirSync(sprintsDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .filter((dirent) => {
      return readdirSync(join(sprintsDir, dirent.name), { withFileTypes: true }).some(
        (dent) => dent.isFile() && dent.name === 'story.md'
      )
    })
    .map((dirent) => dirent.name)

  for (const storyDir of storyDirs) {
    const storyPath = join(sprintsDir, storyDir, 'story.md')
    const planPath = join(sprintsDir, storyDir, 'plan.md')
    const { frontmatter } = parseFrontmatter(storyPath)

    if (!frontmatter) continue

    // Check if story is at ready-for-dev
    if (frontmatter.status === 'ready-for-dev') {
      if (!existsSync(planPath)) {
        // Extract ticket ID from directory name or frontmatter
        const ticketId = frontmatter.ticket || storyDir
        flagged.push(ticketId)
        suggestions.push(`Run /scrum-refine-ticket ${ticketId} to generate plan.md`)
      }
    }
  }

  return { flagged, suggestions }
}

// ── Helper: Post-migration validation ────────────────────────────────
/**
 * Validate YAML frontmatter and status_history arrays after migration.
 * @param {string} targetDir - Target project directory
 * @returns {{ valid: boolean, results: { path: string, status: string, issues: string[] }[] }}
 */
function validateMigration(targetDir) {
  const sprintsDir = join(targetDir, '_scrum-output', 'sprints')
  const results = []
  let allValid = true

  if (!existsSync(sprintsDir)) {
    return { valid: true, results: [] }
  }

  // Scan all subdirectories for story.md
  const storyDirs = readdirSync(sprintsDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .filter((dirent) => {
      return readdirSync(join(sprintsDir, dirent.name), { withFileTypes: true }).some(
        (dent) => dent.isFile() && dent.name === 'story.md'
      )
    })
    .map((dirent) => dirent.name)

  for (const storyDir of storyDirs) {
    const storyPath = join(sprintsDir, storyDir, 'story.md')
    const issues = []

    const { frontmatter, error } = parseFrontmatter(storyPath)

    // Check YAML parsing
    if (error) {
      issues.push(`YAML parsing failed: ${error}`)
      allValid = false
      results.push({ path: storyPath, status: 'fail', issues })
      continue
    }

    if (!frontmatter) {
      issues.push('No frontmatter found')
      allValid = false
      results.push({ path: storyPath, status: 'fail', issues })
      continue
    }

    // Validate status_history array if present
    // Each status_history entry must have: from, to, timestamp, trigger, actor
    if (frontmatter.status_history) {
      if (!Array.isArray(frontmatter.status_history)) {
        issues.push('status_history must be an array')
        allValid = false
      } else {
        for (let i = 0; i < frontmatter.status_history.length; i++) {
          const entry = frontmatter.status_history[i]
          const requiredFields = ['from', 'to', 'timestamp', 'trigger', 'actor']
          for (const field of requiredFields) {
            if (!(field in entry)) {
              issues.push(`status_history[${i}] missing required field: ${field}`)
              allValid = false
            }
          }
        }
      }
    }

    if (issues.length > 0) {
      results.push({ path: storyPath, status: 'fail', issues })
    } else {
      results.push({ path: storyPath, status: 'pass', issues: [] })
    }
  }

  return { valid: allValid, results }
}

// ── Helper: Generate validation report ──────────────────────────────
/**
 * Generate a validation report string.
 * @param {{ valid: boolean, results: object[] }} validation - Validation results
 * @param {{ migrated: string[], warnings: string[], errors: string[] }} migration - Migration results
 * @param {{ flagged: string[], suggestions: string[] }} planMd - plan.md check results
 * @returns {string}
 */
function generateValidationReport(validation, migration, planMd) {
  const lines = ['## Migration Validation Report', '']

  // Migration summary
  if (migration.migrated.length > 0) {
    lines.push(`### status_history Migration`)
    lines.push(`- Files migrated: ${migration.migrated.length}`)
    for (const f of migration.migrated) {
      lines.push(`  - ${f}`)
    }
    lines.push('')
  }

  // plan.md warnings
  if (planMd.flagged.length > 0) {
    lines.push(`### plan.md Warnings (${planMd.flagged.length} stories)`)
    for (let i = 0; i < planMd.flagged.length; i++) {
      lines.push(`- **Warning:** Story ${planMd.flagged[i]} is at ready-for-dev but missing plan.md`)
      lines.push(`  - **Suggestion:** ${planMd.suggestions[i]}`)
    }
    lines.push('')
  }

  // Validation results
  lines.push(`### YAML & status_history Validation`)
  if (validation.valid) {
    lines.push('**Status:** All validations passed')
    lines.push('')
    lines.push('All YAML frontmatter is parseable and all status_history arrays are consistent.')
  } else {
    lines.push('**Status:** Issues found')
    lines.push('')
    for (const result of validation.results) {
      if (result.status === 'fail') {
        lines.push(`- **${result.path}:**`)
        for (const issue of result.issues) {
          lines.push(`  - ${issue}`)
        }
      }
    }
    lines.push('')
    lines.push('**Next Step:** Address the issues listed above and re-run validation.')
  }

  return lines.join('\n')
}

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
    log.info('Breaking changes in this update:')
    for (const bc of BREAKING_CHANGES) {
      log.info(`  ${bc.from} → ${bc.to}:`)
      for (const change of bc.changes) {
        log.info(`    - ${change.field}: ${change.description}`)
      }
    }
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
  let planMdResult = { flagged: [], suggestions: [] }

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
    // User-modified files include custom skills, agents, and workflows
    // (detected by hash mismatch via the lock file mechanism)
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

    // ── Step 5.1: Migrate story status_history ─────────────────────────
    {
      const s = spinner()
      s.start('Migrating story status_history...')
      const migrationResult = migrateStoryStatusHistory(targetDir)
      if (migrationResult.migrated.length > 0) {
        log.info(`Migrated status_history in ${migrationResult.migrated.length} story files`)
      }
      if (migrationResult.errors.length > 0) {
        log.warn(`${migrationResult.errors.length} stories had errors during migration`)
      }
      s.stop('status_history migration complete')
    }

    // ── Step 5.2: Check plan.md for ready-for-dev stories ────────────────
    {
      const s = spinner()
      s.start('Checking plan.md requirements...')
      const planMdResult = checkPlanMdForReadyStories(targetDir)
      if (planMdResult.flagged.length > 0) {
        log.warn(`Warning: ${planMdResult.flagged.length} stories at ready-for-dev missing plan.md:`)
        for (let i = 0; i < planMdResult.flagged.length; i++) {
          log.warn(`  - Story ${planMdResult.flagged[i]}: ${planMdResult.suggestions[i]}`)
        }
      }
      s.stop('plan.md check complete')
    }

    // ── Step 5.3: Post-migration validation ────────────────────────────
    {
      const s = spinner()
      s.start('Running post-migration validation...')
      const validationResult = validateMigration(targetDir)

      if (validationResult.valid) {
        log.success('Post-migration validation passed')
      } else {
        log.error('Post-migration validation found issues:')
        for (const result of validationResult.results) {
          if (result.status === 'fail') {
            for (const issue of result.issues) {
              log.warn(`  - ${result.path}: ${issue}`)
            }
          }
        }
        log.warn('**Next Step:** Address the issues listed above and re-run update.')
      }
      s.stop('Post-migration validation complete')
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

  // Show any manual actions required (e.g., stories flagged for missing plan.md)
  if (planMdResult && planMdResult.flagged.length > 0) {
    log.warn('Manual actions required:')
    for (let i = 0; i < planMdResult.flagged.length; i++) {
      log.warn(`  - Run ${planMdResult.suggestions[i]}`)
    }
  }

  outro('Update complete!')
}
