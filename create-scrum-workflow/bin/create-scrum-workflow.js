#!/usr/bin/env node
import { program } from 'commander'
import { install } from '../src/commands/install.js'
import { update } from '../src/commands/update.js'
import { status } from '../src/commands/status.js'
import { validate } from '../src/commands/validate.js'

program
  .name('create-scrum-workflow')
  .description('Install the Scrum Workflow framework into your project')
  .version('1.0.0')

program
  .command('install')
  .description('Install scrum_workflow into current or specified directory')
  .option('-d, --directory <path>', 'Target project directory', '.')
  .option('-p, --platforms <platforms...>', 'Target platforms', ['claude-code'])
  .option('-y, --yes', 'Accept all defaults')
  .option('--dry-run', 'Show what would be installed without making changes')
  .action(install)

program
  .command('update')
  .description('Update existing scrum_workflow installation')
  .option('-d, --directory <path>', 'Target project directory', '.')
  .option('--dry-run', 'Show what would be updated without making changes')
  .action(update)

program
  .command('status')
  .description('Show installation status')
  .option('-d, --directory <path>', 'Target project directory', '.')
  .action(status)

program
  .command('validate')
  .description('Validate installation completeness and integrity')
  .option('-d, --directory <path>', 'Target project directory', '.')
  .action(validate)

program.parse()
