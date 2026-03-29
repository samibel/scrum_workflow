import { existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import pc from 'picocolors'
import { readLockFile } from '../integrity/lock-file.js'
import { hashFile } from '../integrity/hash-tracker.js'

export async function status(options) {
  const targetDir = resolve(options.directory)
  const lockData = readLockFile(targetDir)

  if (!lockData) {
    console.log(pc.yellow('No scrum_workflow installation found in this directory.'))
    return
  }

  // Installation info header
  console.log('')
  console.log(pc.bold('scrum_workflow Installation Status'))
  console.log(pc.bold('=================================='))
  console.log('')
  console.log(`  ${pc.bold('Version:')}      ${lockData.version}`)
  console.log(`  ${pc.bold('Installed:')}    ${lockData.installed}`)
  console.log(`  ${pc.bold('Last Updated:')} ${lockData.updated}`)
  console.log(`  ${pc.bold('Platforms:')}    ${lockData.platforms.join(', ')}`)
  console.log(`  ${pc.bold('Framework:')}    ${lockData.framework_path}`)

  const trackedFiles = Object.keys(lockData.files)
  console.log(`  ${pc.bold('Files:')}        ${trackedFiles.length} tracked`)

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
  console.log(pc.bold('File Integrity'))
  console.log(pc.bold('=============='))
  console.log('')
  console.log(`  ${pc.bold('Unchanged:')}    ${pc.green(String(unchanged.length))}`)
  console.log(`  ${pc.bold('Modified:')}     ${pc.yellow(String(modified.length))}`)
  console.log(`  ${pc.bold('Missing:')}      ${pc.red(String(missing.length))}`)

  if (modified.length > 0) {
    console.log('')
    console.log(pc.bold('Modified files:'))
    for (const relPath of modified) {
      console.log(`  ${pc.yellow(relPath)}`)
    }
  }

  if (missing.length > 0) {
    console.log('')
    console.log(pc.bold('Missing files (warning):'))
    for (const relPath of missing) {
      console.log(`  ${pc.red(relPath)}`)
    }
  }

  console.log('')
}
