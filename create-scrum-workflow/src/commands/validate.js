import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'
import pc from 'picocolors'
import { readLockFile } from '../integrity/lock-file.js'
import { hashFile } from '../integrity/hash-tracker.js'
import { resolveInstallPaths } from '../core/path-resolver.js'
import { loadPlatformRegistry } from '../platform/platform-registry.js'

/**
 * Validate an existing scrum_workflow installation for completeness and integrity.
 *
 * Checks:
 *   1. Lock file exists and is valid
 *   2. All tracked files exist with correct hashes
 *   3. All skill shims exist for each platform
 *   4. {{framework_path}} placeholders are fully substituted in skill shims
 *   5. Framework commands referenced by skills exist
 *   6. Output directories exist
 *
 * @param {object} options - CLI options: { directory }
 */
export async function validate(options) {
  const targetDir = resolve(options.directory)
  const errors = []
  const warnings = []
  let checks = 0
  let passed = 0

  console.log('')
  console.log(pc.bold('scrum_workflow Installation Validation'))
  console.log(pc.bold('======================================'))
  console.log('')

  // ── Check 1: Lock file ──────────────────────────────────────────────
  checks++
  const lockData = readLockFile(targetDir)
  if (!lockData) {
    errors.push('Lock file (.scrum-workflow-lock.json) not found')
    console.log(`  ${pc.red('FAIL')} Lock file exists`)
    console.log('')
    console.log(pc.red(`Validation failed: ${errors.length} error(s)`))
    console.log(pc.yellow('Run `create-scrum-workflow install` to set up the framework.'))
    console.log('')
    return { errors, warnings, checks, passed }
  }
  passed++
  console.log(`  ${pc.green('PASS')} Lock file exists (version ${lockData.version})`)

  // ── Check 2: File integrity ─────────────────────────────────────────
  const trackedFiles = Object.keys(lockData.files)
  const integrityIssues = { missing: [], modified: [] }

  for (const relPath of trackedFiles) {
    checks++
    const absPath = join(targetDir, relPath)

    if (!existsSync(absPath)) {
      integrityIssues.missing.push(relPath)
      continue
    }

    const currentHash = hashFile(absPath)
    if (lockData.files[relPath] !== `sha256:${currentHash}`) {
      integrityIssues.modified.push(relPath)
    }
    passed++
  }

  if (integrityIssues.missing.length > 0) {
    errors.push(`${integrityIssues.missing.length} tracked file(s) missing`)
    console.log(`  ${pc.red('FAIL')} File integrity: ${integrityIssues.missing.length} missing`)
    for (const f of integrityIssues.missing.slice(0, 5)) {
      console.log(`       ${pc.red(f)}`)
    }
    if (integrityIssues.missing.length > 5) {
      console.log(`       ... and ${integrityIssues.missing.length - 5} more`)
    }
  } else {
    console.log(`  ${pc.green('PASS')} File integrity: all ${trackedFiles.length} tracked files present`)
  }

  if (integrityIssues.modified.length > 0) {
    warnings.push(`${integrityIssues.modified.length} file(s) modified by user`)
    console.log(`  ${pc.yellow('WARN')} ${integrityIssues.modified.length} file(s) modified (user changes detected)`)
  }

  // ── Check 3: Skill shims per platform ───────────────────────────────
  const registry = loadPlatformRegistry()
  const config = {
    directory: targetDir,
    frameworkPath: lockData.framework_path,
    platforms: lockData.platforms
  }
  const paths = resolveInstallPaths(config, registry)

  // Discover expected skills from templates
  const expectedSkills = readdirSync(paths.skillTemplateDir).filter((entry) => {
    return statSync(join(paths.skillTemplateDir, entry)).isDirectory()
  })

  for (const platformCode of lockData.platforms) {
    checks++
    const platformSkillDir = paths.platformDirs.get(platformCode)
    if (!platformSkillDir || !existsSync(platformSkillDir)) {
      errors.push(`Platform skill directory missing: ${platformCode}`)
      console.log(`  ${pc.red('FAIL')} Platform ${platformCode}: skill directory missing`)
      continue
    }

    const installedSkills = readdirSync(platformSkillDir).filter((entry) => {
      const skillPath = join(platformSkillDir, entry, 'SKILL.md')
      return existsSync(skillPath)
    })

    const missingSkills = expectedSkills.filter(s => !installedSkills.includes(s))

    if (missingSkills.length > 0) {
      errors.push(`${platformCode}: ${missingSkills.length} skill(s) missing`)
      console.log(`  ${pc.red('FAIL')} Platform ${platformCode}: ${missingSkills.length}/${expectedSkills.length} skills missing`)
      for (const s of missingSkills) {
        console.log(`       ${pc.red(s)}`)
      }
    } else {
      passed++
      console.log(`  ${pc.green('PASS')} Platform ${platformCode}: all ${expectedSkills.length} skills registered`)
    }
  }

  // ── Check 4: Placeholder substitution ───────────────────────────────
  checks++
  let placeholderIssues = 0
  for (const platformCode of lockData.platforms) {
    const platformSkillDir = paths.platformDirs.get(platformCode)
    if (!platformSkillDir || !existsSync(platformSkillDir)) continue

    for (const skillName of expectedSkills) {
      const skillPath = join(platformSkillDir, skillName, 'SKILL.md')
      if (!existsSync(skillPath)) continue

      const content = readFileSync(skillPath, 'utf8')
      if (content.includes('{{framework_path}}')) {
        placeholderIssues++
        errors.push(`Unsubstituted placeholder in ${platformCode}/${skillName}/SKILL.md`)
      }
    }
  }

  if (placeholderIssues > 0) {
    console.log(`  ${pc.red('FAIL')} Placeholder substitution: ${placeholderIssues} unresolved {{framework_path}}`)
  } else {
    passed++
    console.log(`  ${pc.green('PASS')} Placeholder substitution: all {{framework_path}} resolved`)
  }

  // ── Check 5: Framework commands exist ───────────────────────────────
  checks++
  const commandsDir = join(targetDir, lockData.framework_path, 'commands')
  const expectedCommands = [
    'create-ticket.md', 'refine-ticket.md', 'refine-story.md',
    'dev-story.md', 'review-story.md', 'create-project-context.md',
    'create-project-docs.md', 'create-architecture-docs.md',
    'research-general.md', 'research-technical.md'
  ]
  const missingCommands = expectedCommands.filter(cmd => !existsSync(join(commandsDir, cmd)))

  if (missingCommands.length > 0) {
    errors.push(`${missingCommands.length} framework command(s) missing`)
    console.log(`  ${pc.red('FAIL')} Framework commands: ${missingCommands.length} missing`)
    for (const c of missingCommands) {
      console.log(`       ${pc.red(c)}`)
    }
  } else {
    passed++
    console.log(`  ${pc.green('PASS')} Framework commands: all ${expectedCommands.length} present`)
  }

  // ── Check 6: Output directories ─────────────────────────────────────
  checks++
  const outputSubdirs = ['context', 'docs', 'skills', 'sprints']
  const missingOutputDirs = outputSubdirs.filter(
    sub => !existsSync(join(targetDir, '_scrum-output', sub))
  )

  if (missingOutputDirs.length > 0) {
    warnings.push(`${missingOutputDirs.length} output directory/ies missing`)
    console.log(`  ${pc.yellow('WARN')} Output directories: ${missingOutputDirs.join(', ')} missing`)
  } else {
    passed++
    console.log(`  ${pc.green('PASS')} Output directories: all 4 present`)
  }

  // ── Summary ─────────────────────────────────────────────────────────
  console.log('')
  if (errors.length === 0) {
    console.log(pc.green(pc.bold(`Validation passed: ${passed}/${checks} checks OK`)))
    if (warnings.length > 0) {
      console.log(pc.yellow(`  ${warnings.length} warning(s)`))
    }
  } else {
    console.log(pc.red(pc.bold(`Validation failed: ${errors.length} error(s), ${warnings.length} warning(s)`)))
    console.log(pc.yellow('Run `create-scrum-workflow update` to fix issues.'))
  }
  console.log('')

  return { errors, warnings, checks, passed }
}
