import { resolve, basename } from 'node:path'
import { existsSync } from 'node:fs'
import { intro, text, multiselect, log, isCancel, cancel } from '@clack/prompts'
import { loadPlatformRegistry } from '../platform/platform-registry.js'

/**
 * Collect user configuration through interactive prompts (or use defaults
 * when --yes is passed) and return a normalized config object.
 *
 * @param {object} options - Commander options: { directory, platforms, yes }
 * @returns {Promise<{ directory: string, projectName: string, platforms: string[], frameworkPath: string }>}
 */
export async function buildConfig(options) {
  const resolvedDefault = resolve(options.directory)

  // --yes: skip all prompts, use resolved defaults directly
  if (options.yes === true) {
    const config = {
      directory: resolvedDefault,
      projectName: basename(resolvedDefault),
      platforms: options.platforms,
      frameworkPath: 'scrum_workflow'
    }

    intro('create-scrum-workflow')
    log.info(
      `Configuration (non-interactive):\n` +
      `  Directory:      ${config.directory}\n` +
      `  Project name:   ${config.projectName}\n` +
      `  Platforms:      ${config.platforms.join(', ')}\n` +
      `  Framework path: ${config.frameworkPath}`
    )

    return config
  }

  // Interactive mode
  intro('create-scrum-workflow')

  // --- Target directory prompt ---
  const dirAnswer = await text({
    message: 'Target project directory',
    defaultValue: resolvedDefault,
    placeholder: resolvedDefault,
    validate(value) {
      if (!existsSync(value)) {
        return 'Directory does not exist'
      }
    }
  })

  if (isCancel(dirAnswer)) {
    cancel('Installation cancelled')
    process.exit(0)
  }

  const resolvedDir = resolve(dirAnswer)

  // --- Project name prompt ---
  const defaultName = basename(resolvedDir)

  const nameAnswer = await text({
    message: 'Project name',
    defaultValue: defaultName,
    placeholder: defaultName,
    validate(value) {
      if (!value || !value.trim()) {
        return 'Project name is required'
      }
    }
  })

  if (isCancel(nameAnswer)) {
    cancel('Installation cancelled')
    process.exit(0)
  }

  // --- Platform multi-select prompt ---
  const registry = loadPlatformRegistry()
  const platformOptions = []

  for (const [code, entry] of registry) {
    platformOptions.push({
      value: code,
      label: entry.display_name,
      hint: entry.target_dir
    })
  }

  const platformsAnswer = await multiselect({
    message: 'Select target platforms',
    options: platformOptions,
    initialValues: ['claude-code'],
    required: true
  })

  if (isCancel(platformsAnswer)) {
    cancel('Installation cancelled')
    process.exit(0)
  }

  // --- Framework path name prompt ---
  const frameworkAnswer = await text({
    message: 'Framework directory name',
    defaultValue: 'scrum_workflow',
    placeholder: 'scrum_workflow',
    validate(value) {
      if (!value || !value.trim()) {
        return 'Framework path is required'
      }
      if (value.includes('/') || value.includes('\\')) {
        return 'Must be a directory name, not a path'
      }
    }
  })

  if (isCancel(frameworkAnswer)) {
    cancel('Installation cancelled')
    process.exit(0)
  }

  // --- Build and return config ---
  const config = {
    directory: resolvedDir,
    projectName: nameAnswer,
    platforms: platformsAnswer,
    frameworkPath: frameworkAnswer
  }

  log.info(
    `Configuration:\n` +
    `  Directory:      ${config.directory}\n` +
    `  Project name:   ${config.projectName}\n` +
    `  Platforms:      ${config.platforms.join(', ')}\n` +
    `  Framework path: ${config.frameworkPath}`
  )

  return config
}
