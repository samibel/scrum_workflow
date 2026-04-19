#!/usr/bin/env node

/**
 * Syncs scrum_workflow source files into the create-scrum-workflow template.
 *
 * Directories synced (mirror-delete):
 *   scrum_workflow/{dir}  →  create-scrum-workflow/templates/scrum_workflow/{dir}
 *
 * Usage:
 *   node scripts/sync-templates.js          # sync (copy + delete)
 *   node scripts/sync-templates.js --check  # dry-run, exit 1 if out of sync
 */

import { existsSync, mkdirSync, readdirSync, statSync, copyFileSync, rmSync, readFileSync } from 'fs';
import { join, relative, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..', '..', '..');
const SOURCE = join(ROOT, 'src', 'core');
const TARGET = join(ROOT, 'src', 'cli', 'templates', 'scrum_workflow');

const CHECK_MODE = process.argv.includes('--check');

// Directories and files to sync (relative to scrum_workflow/)
const SYNC_DIRS = [
  'agents',
  'commands',
  'context',
  'data',
  'docs',
  'skills',
  'templates',
  'utils',
  'workflows',
];

const SYNC_FILES = [
  'config.yaml',
];

let added = [];
let deleted = [];
let updated = [];

function getAllFiles(dir) {
  const results = [];
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getAllFiles(fullPath));
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

function filesEqual(a, b) {
  try {
    const bufA = readFileSync(a);
    const bufB = readFileSync(b);
    return bufA.equals(bufB);
  } catch {
    return false;
  }
}

function syncDir(srcDir, tgtDir) {
  const srcFiles = new Set(
    getAllFiles(srcDir).map(f => relative(srcDir, f))
  );
  const tgtFiles = new Set(
    getAllFiles(tgtDir).map(f => relative(tgtDir, f))
  );

  // Delete files in target that no longer exist in source
  for (const rel of tgtFiles) {
    if (!srcFiles.has(rel)) {
      const tgtPath = join(tgtDir, rel);
      deleted.push(relative(TARGET, tgtPath));
      if (!CHECK_MODE) {
        rmSync(tgtPath);
      }
    }
  }

  // Copy new or changed files from source to target
  for (const rel of srcFiles) {
    const srcPath = join(srcDir, rel);
    const tgtPath = join(tgtDir, rel);

    if (!existsSync(tgtPath)) {
      added.push(relative(TARGET, tgtPath));
      if (!CHECK_MODE) {
        mkdirSync(dirname(tgtPath), { recursive: true });
        copyFileSync(srcPath, tgtPath);
      }
    } else if (!filesEqual(srcPath, tgtPath)) {
      updated.push(relative(TARGET, tgtPath));
      if (!CHECK_MODE) {
        copyFileSync(srcPath, tgtPath);
      }
    }
  }

  // Clean up empty directories in target
  if (!CHECK_MODE) {
    cleanEmptyDirs(tgtDir);
  }
}

function cleanEmptyDirs(dir) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      cleanEmptyDirs(join(dir, entry.name));
    }
  }
  if (readdirSync(dir).length === 0) {
    rmSync(dir, { recursive: true });
  }
}

// Sync each configured directory
for (const dir of SYNC_DIRS) {
  const srcDir = join(SOURCE, dir);
  const tgtDir = join(TARGET, dir);
  if (existsSync(srcDir)) {
    syncDir(srcDir, tgtDir);
  }
}

// Sync individual files
for (const file of SYNC_FILES) {
  const srcPath = join(SOURCE, file);
  const tgtPath = join(TARGET, file);
  if (!existsSync(srcPath)) continue;

  if (!existsSync(tgtPath)) {
    added.push(relative(TARGET, tgtPath));
    if (!CHECK_MODE) {
      copyFileSync(srcPath, tgtPath);
    }
  } else if (!filesEqual(srcPath, tgtPath)) {
    updated.push(relative(TARGET, tgtPath));
    if (!CHECK_MODE) {
      copyFileSync(srcPath, tgtPath);
    }
  }
}

// Report
const total = added.length + deleted.length + updated.length;

if (total === 0) {
  console.log('✓ Templates are in sync.');
  process.exit(0);
}

if (added.length)   { console.log(`\nAdded (${added.length}):`);   added.forEach(f => console.log(`  + ${f}`)); }
if (updated.length) { console.log(`\nUpdated (${updated.length}):`); updated.forEach(f => console.log(`  ~ ${f}`)); }
if (deleted.length) { console.log(`\nDeleted (${deleted.length}):`); deleted.forEach(f => console.log(`  - ${f}`)); }

if (CHECK_MODE) {
  console.log(`\n✗ Templates out of sync: ${total} difference(s). Run "npm run sync-templates" to fix.`);
  process.exit(1);
} else {
  console.log(`\n✓ Synced ${total} file(s).`);
}
