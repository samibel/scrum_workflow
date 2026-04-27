import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * Resolve all installation target paths from the user config and platform registry.
 *
 * @param {object} config - Config from buildConfig(): { directory, projectName, platforms, frameworkPath }
 * @param {Map} registry - Platform registry Map from loadPlatformRegistry()
 * @returns {{ frameworkDir: string, outputDirs: string[], platformDirs: Map<string, string>, templateSourceDir: string, skillTemplateDir: string }}
 */
export function resolveInstallPaths(config, registry) {
  const frameworkDir = join(config.directory, config.frameworkPath)

  const outputDirs = [
    join(config.directory, '_scrum-output', 'context'),
    join(config.directory, '_scrum-output', 'concepts'),
    join(config.directory, '_scrum-output', 'docs'),
    join(config.directory, '_scrum-output', 'skills'),
    join(config.directory, '_scrum-output', 'sprints')
  ]

  const platformDirs = new Map()
  for (const code of config.platforms) {
    const entry = registry.get(code)
    if (entry) {
      platformDirs.set(code, join(config.directory, entry.target_dir))
    }
  }

  const templateSourceDir = join(__dirname, '..', '..', 'templates', 'scrum_workflow')
  const skillTemplateDir = join(__dirname, '..', '..', 'templates', 'skill-registrations')

  return { frameworkDir, outputDirs, platformDirs, templateSourceDir, skillTemplateDir }
}
