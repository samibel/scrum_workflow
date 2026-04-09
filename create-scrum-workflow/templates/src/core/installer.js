import fse from 'fs-extra'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { cancel } from '@clack/prompts'
import { resolveInstallPaths } from './path-resolver.js'
import { loadPlatformRegistry } from '../platform/platform-registry.js'
import { registerSkills } from './skill-registrar.js'
import { hashDirectory } from '../integrity/hash-tracker.js'
import { writeLockFile, buildLockData, LOCK_FILE_NAME } from '../integrity/lock-file.js'
import * as output from './output.js'
import * as progress from './progress.js'
import { confirmAction } from './prompts.js'

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
    this.verifyInstallation()
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
      output.warning(`Framework directory already exists: ${this.paths.frameworkDir}`)
      output.warning('Overwriting (auto-confirmed)')
      return
    }

    const shouldOverwrite = await confirmAction(
      `Framework directory already exists at ${this.paths.frameworkDir}. Overwrite?`
    )

    if (shouldOverwrite === false) {
      cancel('Installation cancelled')
      process.exit(0)
    }
  }

  /**
   * Copy the bundled framework template directory verbatim to the target.
   */
  copyFramework() {
    progress.start('Copying framework files...')
    try {
      copySync(this.paths.templateSourceDir, this.paths.frameworkDir)
      progress.succeed('Framework files copied complete')
    } catch (err) {
      progress.fail('Framework copy failed')
      throw err
    }
  }

  /**
   * Register skill shims for each selected platform.
   */
  registerSkills() {
    progress.start('Registering skill shims...')
    try {
      this.skillResult = registerSkills(this.paths, this.config)
      progress.succeed('Skill shims registered complete')
    } catch (err) {
      progress.fail('Skill registration failed')
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
    output.info('Output directories created')
  }

  /**
   * Generate a lock file with SHA-256 hashes for all installed files.
   *
   * Hashes both framework files and skill registration files, then writes
   * the lock file to the target project root.
   */
  generateLockFile() {
    progress.start('Generating lock file...')
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

      progress.succeed('Lock file generated complete')
    } catch (err) {
      progress.fail('Lock file generation failed')
      throw err
    }
  }

  /**
   * Quick post-install verification: check that critical files exist
   * and skill shims have no unresolved placeholders.
   */
  verifyInstallation() {
    const issues = []

    // Verify framework config exists
    const configPath = join(this.paths.frameworkDir, 'config.yaml')
    if (!existsSync(configPath)) {
      issues.push('Framework config.yaml missing after copy')
    }

    // Verify skill shims have no unresolved placeholders
    for (const [, platformSkillDir] of this.paths.platformDirs) {
      if (!existsSync(platformSkillDir)) continue
      const skills = readdirSync(platformSkillDir).filter(
        (e) => statSync(join(platformSkillDir, e)).isDirectory()
      )
      for (const skillName of skills) {
        const skillPath = join(platformSkillDir, skillName, 'SKILL.md')
        if (!existsSync(skillPath)) continue
        const content = readFileSync(skillPath, 'utf8')
        if (content.includes('{{framework_path}}')) {
          issues.push(`Unresolved placeholder in ${skillName}/SKILL.md`)
        }
      }
    }

    if (issues.length > 0) {
      output.warning(`Post-install verification found ${issues.length} issue(s):`)
      for (const issue of issues) {
        output.warning(`  - ${issue}`)
      }
    } else {
      output.info('Post-install verification passed')
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
    output.success('Installation summary:')
    output.step(`Framework path:   ${this.paths.frameworkDir}`)
    output.step(`Files copied:     ${fileCount}${skillInfo}${lockInfo}`)
    output.step(`Output dirs:      ${this.paths.outputDirs.join('\n                    ')}`)
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
