import { outro } from '@clack/prompts'
import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { buildConfig } from '../core/config-builder.js'
import { Installer } from '../core/installer.js'
import { resolveInstallPaths } from '../core/path-resolver.js'
import { loadPlatformRegistry } from '../platform/platform-registry.js'
import * as output from '../core/output.js'
import { getNextStep } from '../core/next-steps.js'

export async function install(options) {
  const config = await buildConfig(options)
  config.yes = options.yes === true

  output.success('Configuration complete')

  if (options.dryRun) {
    const registry = loadPlatformRegistry()
    const paths = resolveInstallPaths(config, registry)

    // Count template files
    const countFiles = (dir) => {
      let count = 0
      for (const entry of readdirSync(dir)) {
        const full = join(dir, entry)
        count += statSync(full).isDirectory() ? countFiles(full) : 1
      }
      return count
    }

    const fileCount = countFiles(paths.templateSourceDir)
    const skillNames = readdirSync(paths.skillTemplateDir).filter(
      (e) => statSync(join(paths.skillTemplateDir, e)).isDirectory()
    )

    console.log('')
    output.info('Dry run — no changes will be made')
    console.log('')
    console.log(`  Framework files:  ${fileCount} files → ${paths.frameworkDir}`)
    console.log(`  Skills:           ${skillNames.length} skills × ${config.platforms.length} platform(s)`)
    for (const p of config.platforms) {
      const dir = paths.platformDirs.get(p)
      console.log(`                    → ${dir}`)
    }
    console.log(`  Output dirs:      ${paths.outputDirs.length} directories`)
    console.log(`  Skills to register:`)
    for (const s of skillNames) {
      console.log(`    - ${s}`)
    }
    console.log('')
    outro('Dry run complete — run without dry-run flag to apply changes')
    return
  }

  const installer = new Installer(config)
  try {
    await installer.run()
  } catch (err) {
    output.error(`Installation failed: ${err.message}`)
    output.warning('Recovery steps:')
    output.warning('  1. Check that the target directory exists and is writable')
    output.warning('  2. Run `create-scrum-workflow status` to check current state')
    output.warning('  3. Run `create-scrum-workflow install` to retry')
    outro('Installation failed')
    process.exitCode = 1
    return
  }

  // getNextStep('install') returns: "Installation complete! Try: /scrum-create-ticket \"your feature description\""
  outro(getNextStep('install'))
}
