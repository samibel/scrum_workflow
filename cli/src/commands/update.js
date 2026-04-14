import { existsSync, mkdtempSync, readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join, resolve, dirname } from 'node:path'
import { tmpdir } from 'node:os'
import { createRequire } from 'node:module'
import fse from 'fs-extra'
import { intro, outro, note } from '@clack/prompts'
import pc from 'picocolors'
import yaml from 'js-yaml'
import { readLockFile, writeLockFile } from '../integrity/lock-file.js'
import { hashFile, hashDirectory } from '../integrity/hash-tracker.js'
import { resolveInstallPaths } from '../core/path-resolver.js'
import { loadPlatformRegistry } from '../platform/platform-registry.js'
import { registerSkills } from '../core/skill-registrar.js'
import * as output from '../core/output.js'
import * as progress from '../core/progress.js'
import { getNextStep } from '../core/next-steps.js'

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

// ── Helper: Find story directories ───────────────────────────────────
/**
 * Scan _scrum-output/sprints/ for subdirectories containing story.md.
 * @param {string} targetDir - Target project directory
 * @returns {string[]} Array of directory names containing story.md
 */
function findStoryDirs(targetDir) {
  const sprintsDir = join(targetDir, '_scrum-output', 'sprints')
  if (!existsSync(sprintsDir)) return []

  return readdirSync(sprintsDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .filter((dirent) => {
      return readdirSync(join(sprintsDir, dirent.name), { withFileTypes: true }).some(
        (dent) => dent.isFile() && dent.name === 'story.md'
      )
    })
    .map((dirent) => dirent.name)
}

// ── Helper: Migrate status_history in story files ────────────────────
/**
 * Scan _scrum-output/sprints/ for story.md files missing status_history
 * and add retroactive entry.
 * @param {string} targetDir - Target project directory
 * @returns {{ migrated: string[], errors: string[] }}
 */
function migrateStoryStatusHistory(targetDir) {
  const sprintsDir = join(targetDir, '_scrum-output', 'sprints')
  const migrated = []
  const errors = []

  if (!existsSync(sprintsDir)) {
    return { migrated, errors }
  }

  const storyDirs = findStoryDirs(targetDir)

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

  return { migrated, errors }
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

  const storyDirs = findStoryDirs(targetDir)

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

  const storyDirs = findStoryDirs(targetDir)

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
    output.error('No existing installation found. Run `install` first.')
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
    progress.start('Analyzing installed files...')
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
      progress.succeed('File analysis complete')
    } catch (err) {
      progress.fail('File analysis failed')
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
      output.info('Installation is up to date. No changes needed.')
      outro(getNextStep('update'))
      return
    }
  }

  if (newFiles.length > 0) {
    output.info(`New files available: ${newFiles.length} (will be added during update)`)
  }

  // ── Dry run: show what would happen, then exit ──────────────────────
  if (options.dryRun) {
    output.info('Dry run — no changes will be made')
    console.log(`  Files to update:   ${unchanged.length + missing.length}`)
    console.log(`  Files to preserve: ${userModified.length} (user-modified)`)
    console.log(`  Files to restore:  ${missing.length} (currently missing)`)
    console.log(`  New files to add:  ${newFiles.length}`)
    output.info('Breaking changes in this update:')
    for (const bc of BREAKING_CHANGES) {
      console.log(`  ${bc.from} → ${bc.to}:`)
      for (const change of bc.changes) {
        console.log(`    - ${change.field}: ${change.description}`)
      }
    }
    if (userModified.length > 0) {
      output.info('Would preserve:')
      for (const f of userModified) {
        console.log(`  ${f}`)
      }
    }
    if (newFiles.length > 0) {
      output.info('Would add:')
      for (const f of newFiles) {
        console.log(`  ${f}`)
      }
    }
    outro('Dry run complete — run without dry-run flag to apply changes')
    return
  }

  // ── Step 3-5: Backup, overwrite, restore ────────────────────────────
  let backupDir = null
  let skillResult = null
  let planMdResult = { flagged: [], suggestions: [] }

  try {
    // ── Step 3: Back up user-modified files ────────────────────────────
    if (userModified.length > 0) {
      progress.start('Backing up user-modified files...')
      try {
        backupDir = mkdtempSync(join(tmpdir(), 'scrum-workflow-backup-'))

        for (const relPath of userModified) {
          const srcPath = join(targetDir, relPath)
          const backupPath = join(backupDir, relPath)
          ensureDirSync(dirname(backupPath))
          copySync(srcPath, backupPath)
        }
        progress.succeed('User files backed up')
      } catch (err) {
        progress.fail('Backup failed')
        throw err
      }
    }

    // ── Step 4: Overwrite with new installer files ────────────────────
    {
      progress.start('Updating framework files...')
      try {
        // Copy framework templates
        copySync(paths.templateSourceDir, paths.frameworkDir)

        // Re-register skills (substitutes {{framework_path}})
        skillResult = registerSkills(paths, config)

        progress.succeed('Framework updated')
      } catch (err) {
        progress.fail('Framework update failed')
        throw err
      }
    }

    // ── Step 5: Restore user-modified files ───────────────────────────
    // User-modified files include custom skills, agents, and workflows
    // (detected by hash mismatch via the lock file mechanism)
    if (userModified.length > 0 && backupDir) {
      progress.start('Restoring user modifications...')
      try {
        for (const relPath of userModified) {
          const backupPath = join(backupDir, relPath)
          const restorePath = join(targetDir, relPath)
          ensureDirSync(dirname(restorePath))
          copySync(backupPath, restorePath)
        }
        progress.succeed('User modifications restored')
      } catch (err) {
        progress.fail('Restore failed')
        throw err
      }
    }

    // ── Step 5.1: Migrate story status_history ─────────────────────────
    {
      progress.start('Migrating story status_history...')
      const migrationResult = migrateStoryStatusHistory(targetDir)
      if (migrationResult.migrated.length > 0) {
        output.info(`Migrated status_history in ${migrationResult.migrated.length} story files`)
      }
      if (migrationResult.errors.length > 0) {
        output.warning(`${migrationResult.errors.length} stories had errors during migration`)
      }
      progress.succeed('status_history migration complete')
    }

    // ── Step 5.2: Check plan.md for ready-for-dev stories ────────────────
    {
      progress.start('Checking plan.md requirements...')
      planMdResult = checkPlanMdForReadyStories(targetDir)
      if (planMdResult.flagged.length > 0) {
        output.warning(`Warning: ${planMdResult.flagged.length} stories at ready-for-dev missing plan.md:`)
        for (let i = 0; i < planMdResult.flagged.length; i++) {
          output.warning(`  - Story ${planMdResult.flagged[i]}: ${planMdResult.suggestions[i]}`)
        }
      }
      progress.succeed('plan.md check complete')
    }

    // ── Step 5.3: Post-migration validation ────────────────────────────
    {
      progress.start('Running post-migration validation...')
      const validationResult = validateMigration(targetDir)

      if (validationResult.valid) {
        output.success('Post-migration validation passed')
      } else {
        output.error('Post-migration validation found issues:')
        for (const result of validationResult.results) {
          if (result.status === 'fail') {
            for (const issue of result.issues) {
              output.warning(`  - ${result.path}: ${issue}`)
            }
          }
        }
        output.warning('Next: Address the issues listed above and re-run update.')
      }
      progress.succeed('Post-migration validation complete')
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
    progress.start('Updating lock file...')
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
      progress.succeed('Lock file updated')
    } catch (err) {
      progress.fail('Lock file update failed')
      throw err
    }
  }

  // ── Step 7: Print summary ───────────────────────────────────────────
  const noteLines = []

  // File counts row
  const countParts = [
    `${pc.green(String(unchanged.length + missing.length))} updated`,
    `${pc.cyan(String(userModified.length))} preserved`,
    `${pc.cyan(String(missing.length))} restored`
  ]
  if (newFiles.length > 0) {
    countParts.push(`${pc.bold(pc.cyan(String(newFiles.length)))} new`)
  }
  noteLines.push(countParts.join('  ·  '))

  // Preserved files (user modifications kept)
  if (userModified.length > 0) {
    noteLines.push('')
    noteLines.push(pc.dim('Your modifications kept:'))
    for (const f of userModified) {
      noteLines.push(`  ${output.filepath(f)}`)
    }
  }

  // New files added
  if (newFiles.length > 0) {
    noteLines.push('')
    noteLines.push(pc.dim('New files added:'))
    for (const f of newFiles) {
      noteLines.push(`  ${output.filepath(f)}`)
    }
  }

  // Available commands
  if (skillResult?.skillNames?.length) {
    noteLines.push('')
    noteLines.push(pc.bold('Commands available:'))
    for (const skillName of skillResult.skillNames) {
      noteLines.push(`  ${output.highlight(skillName)}`)
    }
  }

  // Manual actions required
  if (planMdResult?.flagged?.length > 0) {
    noteLines.push('')
    noteLines.push(pc.magenta('Manual actions required:'))
    for (let i = 0; i < planMdResult.flagged.length; i++) {
      noteLines.push(`  ⚠ ${planMdResult.suggestions[i]}`)
    }
  }

  note(noteLines.join('\n'), pc.bold(pc.green(`Updated to v${pkg.version}`)))

  const hasFlaggedStories = planMdResult && planMdResult.flagged.length > 0
  outro(getNextStep('update', { hasFlaggedStories }))
}
