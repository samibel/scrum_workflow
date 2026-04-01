import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import yaml from 'js-yaml'

/**
 * Load the platform registry from the co-located YAML file.
 * Returns a Map<string, object> keyed by platform code.
 * Each value includes a `code` property so consumers don't need to track it separately.
 */
export function loadPlatformRegistry() {
  const currentDir = dirname(fileURLToPath(import.meta.url))
  const yamlPath = join(currentDir, 'platform-registry.yaml')
  const content = readFileSync(yamlPath, 'utf8')
  const parsed = yaml.load(content)

  const registry = new Map()

  for (const [code, entry] of Object.entries(parsed.platforms)) {
    registry.set(code, { code, ...entry })
  }

  return registry
}

/**
 * Get a single platform entry by its code, or undefined if not found.
 */
export function getPlatform(registry, code) {
  return registry.get(code)
}

/**
 * Get the platform entry marked as preferred (preferred: true).
 * Returns undefined if no platform is marked preferred.
 */
export function getPreferredPlatform(registry) {
  for (const entry of registry.values()) {
    if (entry.preferred === true) {
      return entry
    }
  }
  return undefined
}

/**
 * Filter platforms by category (cli, ide, or universal).
 * Returns an array of platform entries matching the given category.
 */
export function getPlatformsByCategory(registry, category) {
  const results = []
  for (const entry of registry.values()) {
    if (entry.category === category) {
      results.push(entry)
    }
  }
  return results
}

/**
 * Get an array of all platform code strings.
 * Useful for CLI validation and prompt choices.
 */
export function getPlatformCodes(registry) {
  return [...registry.keys()]
}
