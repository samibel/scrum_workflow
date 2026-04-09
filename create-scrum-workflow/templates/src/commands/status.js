import { existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { outro } from '@clack/prompts'
import { readLockFile } from '../integrity/lock-file.js'
import { hashFile } from '../integrity/hash-tracker.js'
import * as output from '../core/output.js'
import { getNextStep } from '../core/next-steps.js'

export async function status(options) {
  const targetDir = resolve(options.directory)
  const lockData = readLockFile(targetDir)

  if (!lockData) {
    output.warning('No scrum_workflow installation found in this directory.')
    outro(getNextStep('status', { hasIssues: true }))
    return
  }

  // Installation info header
  console.log('')
  output.header('scrum_workflow Installation Status')
  output.header('==================================')
  console.log('')
  output.info(`Version:      ${lockData.version}`)
  output.info(`Installed:    ${lockData.installed}`)
  output.info(`Last Updated: ${lockData.updated}`)
  output.info(`Platforms:    ${lockData.platforms.join(', ')}`)
  output.info(`Framework:    ${lockData.framework_path}`)

  const trackedFiles = Object.keys(lockData.files)
  output.info(`Files:        ${trackedFiles.length} tracked`)

  // File integrity analysis
  const unchanged = []
  const modified = []
  const missing = []

  for (const relPath of trackedFiles) {
    const absPath = join(targetDir, relPath)

    if (!existsSync(absPath)) {
      missing.push(relPath)
      continue
    }

    const currentHash = hashFile(absPath)
    const storedHash = lockData.files[relPath]

    if (storedHash === `sha256:${currentHash}`) {
      unchanged.push(relPath)
    } else {
      modified.push(relPath)
    }
  }

  // File integrity summary
  console.log('')
  output.header('File Integrity')
  output.header('==============')
  console.log('')
  output.success(`Unchanged:    ${String(unchanged.length)}`)
  output.warning(`Modified:     ${String(modified.length)}`)
  output.error(`Missing:      ${String(missing.length)}`)

  if (modified.length > 0) {
    console.log('')
    output.warning('Modified files:')
    for (const relPath of modified) {
      output.warning(`  ${relPath}`)
    }
  }

  if (missing.length > 0) {
    console.log('')
    output.error('Missing files:')
    for (const relPath of missing) {
      output.error(`  ${relPath}`)
    }
  }

  console.log('')

  const hasIssues = modified.length > 0 || missing.length > 0
  outro(getNextStep('status', { hasIssues }))
}
