import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import fse from 'fs-extra'

const { ensureDirSync, writeFileSync } = fse

/**
 * Register skill shims for each selected platform.
 *
 * Reads skill shim templates from the bundled templates directory,
 * substitutes {{framework_path}} with the configured framework path,
 * and writes the processed shims to each platform's skill directory.
 *
 * @param {object} paths - Resolved paths from resolveInstallPaths()
 * @param {object} config - Config from buildConfig(): { platforms, frameworkPath, ... }
 * @returns {{ skillCount: number, platformCount: number }}
 */
export function registerSkills(paths, config) {
  const templateDir = paths.skillTemplateDir

  // Discover skill template directories
  const skillNames = readdirSync(templateDir).filter((entry) => {
    return statSync(join(templateDir, entry)).isDirectory()
  })

  let platformCount = 0

  for (const platformCode of config.platforms) {
    const platformSkillDir = paths.platformDirs.get(platformCode)
    if (!platformSkillDir) {
      continue
    }

    for (const skillName of skillNames) {
      const templatePath = join(templateDir, skillName, 'SKILL.md')
      const rawContent = readFileSync(templatePath, 'utf8')

      // Substitute {{framework_path}} with the configured framework path
      const processedContent = rawContent.replaceAll('{{framework_path}}', config.frameworkPath)

      const targetDir = join(platformSkillDir, skillName)
      const targetPath = join(targetDir, 'SKILL.md')

      ensureDirSync(targetDir)
      writeFileSync(targetPath, processedContent, 'utf8')
    }

    platformCount += 1
  }

  return { skillCount: skillNames.length, platformCount }
}
