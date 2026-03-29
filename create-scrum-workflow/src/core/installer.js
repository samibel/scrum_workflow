import fse from 'fs-extra'
import { existsSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { spinner, confirm, log, isCancel, cancel } from '@clack/prompts'
import { resolveInstallPaths } from './path-resolver.js'
import { loadPlatformRegistry } from '../platform/platform-registry.js'
import { registerSkills } from './skill-registrar.js'
import { hashDirectory } from '../integrity/hash-tracker.js'
import { writeLockFile, buildLockData, LOCK_FILE_NAME } from '../integrity/lock-file.js'

const { copySync, ensureDirSync } = fse

/**
 * Main installer class that orchestrates the framework copy pipeline.
 *
 * Pipeline steps handled by this story:
 *   Step 4: Resolve Paths        (path-resolver.js)
 *   Step 5: Install Framework    (copyFramework)
 *   Step 6: Register Skills      (registerSkills)
 *   Step 7: Create Output Dirs   (createOutputDirs)
 *   Step 9: Generate Lock File   (generateLockFile)
 *   Step 10: Report Results      (printSummary)
 */
export class Installer {
  /**
   * @param {object} config - Config from buildConfig(): { directory, projectName, platforms, frameworkPath, yes? }
   */
  constructor(config) {
    this.config = config
    this.registry = loadPlatformRegistry()
    this.paths = resolveInstallPaths(config, this.registry)
  }

  /**
   * Run the full installation pipeline.
   */
  async run() {
    await this.checkExisting()
    this.copyFramework()
    this.registerSkills()
    this.createOutputDirs()
    this.generateLockFile()
    this.printSummary()
  }

  /**
   * Check if the framework directory already exists.
   * If --yes is set, warn and proceed. Otherwise, prompt for confirmation.
   */
  async checkExisting() {
    if (!existsSync(this.paths.frameworkDir)) {
      return
    }

    if (this.config.yes) {
      log.warn(`Framework directory already exists: ${this.paths.frameworkDir}`)
      log.warn('Overwriting (--yes flag set)')
      return
    }

    const shouldOverwrite = await confirm({
      message: `Framework directory already exists at ${this.paths.frameworkDir}. Overwrite?`
    })

    if (isCancel(shouldOverwrite) || shouldOverwrite === false) {
      cancel('Installation cancelled')
      process.exit(0)
    }
  }

  /**
   * Copy the bundled framework template directory verbatim to the target.
   */
  copyFramework() {
    const s = spinner()
    s.start('Copying framework files...')
    try {
      copySync(this.paths.templateSourceDir, this.paths.frameworkDir)
      s.stop('Framework files copied')
    } catch (err) {
      s.stop('Framework copy failed')
      throw err
    }
  }

  /**
   * Register skill shims for each selected platform.
   */
  registerSkills() {
    const s = spinner()
    s.start('Registering skill shims...')
    try {
      this.skillResult = registerSkills(this.paths, this.config)
      s.stop('Skill shims registered')
    } catch (err) {
      s.stop('Skill registration failed')
      throw err
    }
  }

  /**
   * Create the _scrum-output directories for planning and implementation artifacts.
   */
  createOutputDirs() {
    for (const dir of this.paths.outputDirs) {
      ensureDirSync(dir)
    }
    log.info('Output directories created')
  }

  /**
   * Generate a lock file with SHA-256 hashes for all installed files.
   *
   * Hashes both framework files and skill registration files, then writes
   * the lock file to the target project root.
   */
  generateLockFile() {
    const s = spinner()
    s.start('Generating lock file...')
    try {
      // Hash all framework files
      const frameworkHashes = hashDirectory(this.paths.frameworkDir, this.config.directory)

      // Hash all skill registration files across all platform dirs
      const skillHashes = {}
      for (const [, platformSkillDir] of this.paths.platformDirs) {
        if (existsSync(platformSkillDir)) {
          const dirHashes = hashDirectory(platformSkillDir, this.config.directory)
          Object.assign(skillHashes, dirHashes)
        }
      }

      // Merge framework + skill hashes, sort alphabetically
      const allHashes = {}
      const merged = { ...frameworkHashes, ...skillHashes }
      for (const key of Object.keys(merged).sort()) {
        allHashes[key] = merged[key]
      }

      // Build and write lock data
      const lockData = buildLockData(this.config, allHashes)
      writeLockFile(this.config.directory, lockData)
      this.lockData = lockData

      s.stop('Lock file generated')
    } catch (err) {
      s.stop('Lock file generation failed')
      throw err
    }
  }

  /**
   * Print a summary of the installation.
   */
  printSummary() {
    const fileCount = countFiles(this.paths.frameworkDir)
    const skillInfo = this.skillResult
      ? `\n  Skills registered: ${this.skillResult.skillCount} skills x ${this.skillResult.platformCount} platform(s)`
      : ''
    const lockInfo = this.lockData
      ? `\n  Files tracked:    ${Object.keys(this.lockData.files).length}\n  Lock file:        ${join(this.config.directory, LOCK_FILE_NAME)}`
      : ''
    log.success(
      `Installation summary:\n` +
      `  Framework path:   ${this.paths.frameworkDir}\n` +
      `  Files copied:     ${fileCount}${skillInfo}${lockInfo}\n` +
      `  Output dirs:      ${this.paths.outputDirs.join('\n                    ')}`
    )
  }
}

/**
 * Recursively count all files in a directory.
 */
function countFiles(dir) {
  let count = 0
  const entries = readdirSync(dir)
  for (const entry of entries) {
    const fullPath = join(dir, entry)
    if (statSync(fullPath).isDirectory()) {
      count += countFiles(fullPath)
    } else {
      count += 1
    }
  }
  return count
}
