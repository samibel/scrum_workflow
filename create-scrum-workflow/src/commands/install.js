import { log, outro } from '@clack/prompts'
import { buildConfig } from '../core/config-builder.js'
import { Installer } from '../core/installer.js'

export async function install(options) {
  const config = await buildConfig(options)
  config.yes = options.yes === true

  log.success('Configuration complete')

  const installer = new Installer(config)
  await installer.run()

  outro('Installation complete!')
}
