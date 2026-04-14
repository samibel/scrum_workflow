import { existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { outro, note } from '@clack/prompts'
import pc from 'picocolors'
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

  // ── File integrity analysis ─────────────────────────────────────────
  const trackedFiles = Object.keys(lockData.files)
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

  // ── Build note box content ──────────────────────────────────────────
  const lines = []

  // Version + platforms row
  const platforms = lockData.platforms.map(output.badge).join('  ')
  lines.push(`${pc.dim('Version')}    ${pc.bold(lockData.version)}  ·  ${platforms}`)

  // Timestamps
  lines.push(`${pc.dim('Installed')}  ${output.formatDate(lockData.installed)}`)
  lines.push(`${pc.dim('Updated')}    ${output.formatDate(lockData.updated)}`)

  // Framework path
  lines.push(`${pc.dim('Location')}   ${output.filepath(lockData.framework_path)}`)
  lines.push('')

  // Integrity summary
  const integrityParts = [
    pc.green(`${unchanged.length} unchanged`),
    modified.length > 0
      ? pc.magenta(`${modified.length} modified`)
      : pc.dim(`${modified.length} modified`),
    missing.length > 0
      ? pc.red(`${missing.length} missing`)
      : pc.dim(`${missing.length} missing`)
  ]
  lines.push(integrityParts.join('  ·  '))

  // Modified file list
  if (modified.length > 0) {
    lines.push('')
    lines.push(pc.magenta('Modified:'))
    for (const relPath of modified) {
      lines.push(`  ${output.filepath(relPath)}`)
    }
  }

  // Missing file list
  if (missing.length > 0) {
    lines.push('')
    lines.push(pc.red('Missing:'))
    for (const relPath of missing) {
      lines.push(`  ${output.filepath(relPath)}`)
    }
  }

  const hasIssues = modified.length > 0 || missing.length > 0
  const titleColor = hasIssues ? pc.bold(pc.magenta('scrum_workflow')) : pc.bold(pc.green('scrum_workflow'))
  note(lines.join('\n'), titleColor)

  outro(getNextStep('status', { hasIssues }))
}
