import { resolve, basename } from 'node:path'
import { existsSync } from 'node:fs'
import { intro } from '@clack/prompts'
import { loadPlatformRegistry } from '../platform/platform-registry.js'
import { detectPlatforms } from '../platform/platform-detector.js'
import * as output from './output.js'
import { inputText, multiSelectOptions } from './prompts.js'

/**
 * Collect user configuration through interactive prompts (or use defaults
 * when --yes is passed) and return a normalized config object.
 *
 * @param {object} options - Commander options: { directory, platforms, yes }
 * @returns {Promise<{ directory: string, projectName: string, platforms: string[], frameworkPath: string }>}
 */
export async function buildConfig(options) {
  const resolvedDefault = resolve(options.directory)

  // --yes: skip all prompts, use auto-detected or resolved defaults
  if (options.yes === true) {
    const detectedPlatforms = detectPlatforms(resolvedDefault)
    const platformsLabel = detectedPlatforms.length === 1 ? 'platform' : 'platforms'
    const config = {
      directory: resolvedDefault,
      projectName: basename(resolvedDefault),
      platforms: detectedPlatforms,
      frameworkPath: 'scrum_workflow'
    }

    intro('create-scrum-workflow')
    output.info(`Auto-detected ${platformsLabel}: ${detectedPlatforms.join(', ')}`)
    output.info('Configuration (non-interactive):')
    output.step(`Directory:      ${config.directory}`)
    output.step(`Project name:   ${config.projectName}`)
    output.step(`Platforms:      ${config.platforms.join(', ')}`)
    output.step(`Framework path: ${config.frameworkPath}`)

    return config
  }

  // Interactive mode
  intro('create-scrum-workflow')

  // --- Target directory prompt ---
  const dirAnswer = await inputText('Target project directory', {
    defaultValue: resolvedDefault,
    placeholder: resolvedDefault,
    validate(value) {
      if (!existsSync(value)) {
        return 'Directory does not exist'
      }
    }
  })

  const resolvedDir = resolve(dirAnswer)

  // --- Project name prompt ---
  const defaultName = basename(resolvedDir)

  const nameAnswer = await inputText('Project name', {
    defaultValue: defaultName,
    placeholder: defaultName,
    validate(value) {
      if (!value || !value.trim()) {
        return 'Project name is required'
      }
    }
  })

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

  const platformsAnswer = await multiSelectOptions('Select target platforms', platformOptions, {
    initialValues: ['claude-code']
  })

  // --- Framework path name prompt ---
  const frameworkAnswer = await inputText('Framework directory name', {
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

  // --- Build and return config ---
  const config = {
    directory: resolvedDir,
    projectName: nameAnswer,
    platforms: platformsAnswer,
    frameworkPath: frameworkAnswer
  }

  output.info('Configuration:')
  output.step(`Directory:      ${config.directory}`)
  output.step(`Project name:   ${config.projectName}`)
  output.step(`Platforms:      ${config.platforms.join(', ')}`)
  output.step(`Framework path: ${config.frameworkPath}`)

  return config
}
