/**
 * Session Context Utility
 * Story 7.3: Implement Session Start & Context Loading
 *
 * Provides READ-ONLY functions for aggregating session context:
 * - Scanning open stories from _scrum-output/sprints/
 * - Loading recent decision records from _scrum-output/memory/decisions/
 * - Loading active risk notes from _scrum-output/memory/risks/
 * - Deriving next-step suggestions from story statuses
 * - Formatting the session summary for terminal display
 *
 * NFR Compliance:
 * - NFR-2: No external dependencies (pure Node.js, no npm packages)
 * - NFR-3: All reads are local file operations (offline capable)
 * - NFR-4: N/A — READ-ONLY module; no writes occur
 * - NFR-7: Each loaded artifact is presented with its source file reference
 * - NFR-9: Session summary is human-readable terminal output
 *
 * Architecture Compliance:
 * - MUST NOT import writeFileSync or mkdirSync (read-only module — Pattern 4)
 * - Uses readdirSync NOT glob() for SC-13 performance compliance
 * - Pure string YAML parsing — no external YAML library (NFR-2)
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// ─── Terminal Story Statuses ──────────────────────────────────────────────────

/** Stories in these statuses are NOT shown as open work */
const TERMINAL_STATUSES = new Set(['done', 'cancelled']);

// ─── YAML Frontmatter Parsing ─────────────────────────────────────────────────

/**
 * Parses YAML frontmatter block (between --- delimiters).
 * Pure string implementation — no external YAML library (NFR-2).
 * Mirrors parseRNFrontmatter() approach from risk-extraction.js.
 *
 * Returns {} (empty object) if no frontmatter found — graceful degradation.
 *
 * @param {string} content - Full file content
 * @returns {Object} Parsed key-value pairs from frontmatter (never null)
 */
export function parseFrontmatter(content) {
  if (!content || typeof content !== 'string') {
    return {};
  }

  // Must start with ---
  if (!content.startsWith('---')) {
    return {};
  }

  // Find the closing ---
  const closingIndex = content.indexOf('\n---', 3);
  if (closingIndex === -1) {
    return {};
  }

  const frontmatterText = content.slice(3, closingIndex).trim();
  const result = {};

  const lines = frontmatterText.split('\n');
  let currentArrayKey = null;

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines and comment lines
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    // Array item: starts with "- "
    if (trimmed.startsWith('- ')) {
      // We skip array values — only scalar fields needed for session-context
      // (status, title, ticket, decision_summary, risk_description, severity, affected_area, date)
      continue;
    }

    // Key-value pair
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) {
      continue;
    }

    const key = line.slice(0, colonIndex).trim();
    const rawValue = line.slice(colonIndex + 1).trim();

    // Check if this is a block array (value is empty after colon)
    if (rawValue === '') {
      currentArrayKey = key;
      continue;
    }

    // Scalar value — reset current array context
    currentArrayKey = null;

    // Strip surrounding double or single quotes
    const value = rawValue.replace(/^["']|["']$/g, '');
    result[key] = value;
  }

  // Suppress unused variable warning — currentArrayKey tracking is for future use
  void currentArrayKey;

  return result;
}

// ─── Open Stories ─────────────────────────────────────────────────────────────

/**
 * Scans _scrum-output/sprints/ for story.md files with non-terminal status.
 * Terminal statuses: 'done', 'cancelled'
 *
 * Performance: Uses readdirSync on sprintsDir — NOT recursive glob (SC-13).
 * Graceful degradation: returns [] if directory does not exist.
 *
 * @param {string} sprintsDir - Path to the sprints directory
 * @returns {Array<{ticket: string, status: string, title: string}>} Open stories
 */
export function scanOpenStories(sprintsDir) {
  if (!existsSync(sprintsDir)) {
    return [];
  }

  let entries;
  try {
    entries = readdirSync(sprintsDir);
  } catch {
    return [];
  }

  const openStories = [];

  for (const entry of entries) {
    const storyPath = join(sprintsDir, entry, 'story.md');

    if (!existsSync(storyPath)) {
      continue;
    }

    let content;
    try {
      content = readFileSync(storyPath, 'utf8');
    } catch {
      // Skip unreadable files — graceful degradation
      continue;
    }

    const fm = parseFrontmatter(content);

    // Skip if no frontmatter or no status field
    if (!fm || fm.status === undefined) {
      continue;
    }

    // Skip terminal statuses
    if (TERMINAL_STATUSES.has(fm.status)) {
      continue;
    }

    openStories.push({
      ticket: fm.ticket ?? entry,
      status: fm.status,
      title: fm.title ?? '',
    });
  }

  return openStories;
}

// ─── Recent Decisions ─────────────────────────────────────────────────────────

/**
 * Scans decisionsDir for DR-[0-9][0-9][0-9].md files.
 * Sorts by DR number descending, takes first `limit` files.
 * Reads each file, parses frontmatter.
 *
 * Performance: Only reads the top `limit` files (default 5) — not all DR files (SC-13).
 * Graceful degradation: returns [] if directory does not exist.
 *
 * @param {string} decisionsDir - Path to decisions directory
 * @param {number} [limit=5] - Maximum number of decisions to return
 * @returns {Array<{drNumber: string, decisionSummary: string, ticket: string, date: string}>}
 */
export function loadRecentDecisions(decisionsDir, limit = 5) {
  if (!existsSync(decisionsDir)) {
    return [];
  }

  let files;
  try {
    files = readdirSync(decisionsDir);
  } catch {
    return [];
  }

  // Filter to only DR-NNN.md files
  const drFiles = files.filter(f => /^DR-\d{3}\.md$/.test(f));

  if (drFiles.length === 0) {
    return [];
  }

  // Sort by DR number descending (highest first = most recent)
  drFiles.sort((a, b) => {
    const numA = parseInt(a.match(/^DR-(\d{3})\.md$/)[1], 10);
    const numB = parseInt(b.match(/^DR-(\d{3})\.md$/)[1], 10);
    return numB - numA;
  });

  // Take only the top `limit` files — avoids reading all DRs (SC-13 performance)
  const topFiles = drFiles.slice(0, limit);

  const decisions = [];

  for (const fileName of topFiles) {
    const filePath = join(decisionsDir, fileName);

    let content;
    try {
      content = readFileSync(filePath, 'utf8');
    } catch {
      // Skip unreadable files — graceful degradation
      continue;
    }

    const fm = parseFrontmatter(content);

    if (!fm) {
      continue;
    }

    // Extract DR number from filename (e.g., "DR-005.md" → "DR-005")
    const drNumber = fileName.replace('.md', '');

    decisions.push({
      drNumber,
      decisionSummary: fm.decision_summary ?? '',
      ticket: fm.ticket ?? '',
      date: fm.created ?? fm.date ?? '',
    });
  }

  return decisions;
}

// ─── Active Risk Notes ────────────────────────────────────────────────────────

/**
 * Scans risksDir for RN-[0-9][0-9][0-9].md files where status === 'active'.
 * Reuses pattern from risk-extraction.js filterActiveRiskNotes().
 *
 * Graceful degradation: returns [] if directory does not exist.
 * Read-only: NEVER writes or modifies files.
 *
 * @param {string} risksDir - Path to risks directory
 * @returns {Array<{rnNumber: string, riskDescription: string, severity: string, affectedArea: string, ticket: string}>}
 */
export function loadActiveRisks(risksDir) {
  if (!existsSync(risksDir)) {
    return [];
  }

  let files;
  try {
    files = readdirSync(risksDir);
  } catch {
    return [];
  }

  // Filter to only RN-NNN.md files
  const rnFiles = files.filter(f => /^RN-\d{3}\.md$/.test(f));

  const activeRisks = [];

  for (const fileName of rnFiles) {
    const filePath = join(risksDir, fileName);

    let content;
    try {
      content = readFileSync(filePath, 'utf8');
    } catch {
      // Skip unreadable files — graceful degradation
      continue;
    }

    const fm = parseFrontmatter(content);

    // Skip if no frontmatter, no status, or not active
    if (!fm || fm.status !== 'active') {
      continue;
    }

    // Extract RN number from filename (e.g., "RN-001.md" → "RN-001")
    const rnNumber = fileName.replace('.md', '');

    activeRisks.push({
      rnNumber,
      riskDescription: fm.risk_description ?? '',
      severity: fm.severity ?? '',
      affectedArea: fm.affected_area ?? '',
      ticket: fm.ticket ?? '',
    });
  }

  return activeRisks;
}

// ─── Next Step Derivation ─────────────────────────────────────────────────────

/**
 * Maps story status to actionable next-step suggestions.
 * Returns one suggestion string per open story.
 *
 * Status-to-action mapping (from Dev Notes):
 * - draft         → Refine ticket → /scrum-refine-ticket {ticket}
 * - refined       → Validate story → /scrum-refine-story {ticket}
 * - ready-for-dev → Implement → /scrum-dev-story {ticket}
 * - in-progress   → Continue → /scrum-dev-story {ticket}
 * - review        → Review → /scrum-review-story {ticket}
 * - changes-needed → Apply feedback → review review artifact
 * - approved      → Complete implementation → /scrum-dev-story {ticket}
 *
 * @param {Array<{ticket: string, status: string, title: string}>} openStories
 * @returns {string[]} Array of next-step suggestion strings
 */
export function deriveNextSteps(openStories) {
  if (!openStories || openStories.length === 0) {
    return [];
  }

  return openStories.map(story => {
    const { ticket, status } = story;

    switch (status) {
      case 'draft':
        return `Refine ticket ${ticket} → run \`/scrum-refine-ticket ${ticket}\``;

      case 'refined':
        return `Validate story ${ticket} → run \`/scrum-refine-story ${ticket}\``;

      case 'ready-for-dev':
        return `Implement story ${ticket} → run \`/scrum-dev-story ${ticket}\``;

      case 'in-progress':
        return `Continue implementation of ${ticket} → run \`/scrum-dev-story ${ticket}\``;

      case 'review':
        return `Review story ${ticket} → run \`/scrum-review-story ${ticket}\``;

      case 'changes-needed':
        return `Apply review feedback to ${ticket} → review \`_scrum-output/sprints/${ticket}/review-N.md\``;

      case 'approved':
        return `Story ${ticket} approved — run \`/scrum-dev-story ${ticket}\` to complete implementation`;

      default:
        return `Check status of ${ticket} (status: ${status})`;
    }
  });
}

// ─── Session Summary Formatter ────────────────────────────────────────────────

/**
 * Renders structured session summary as a string.
 * Output is human-readable multi-section text (NFR-9 Inspectability).
 * No binary formats, no ANSI escape codes.
 *
 * Template:
 *   ## Session Context — {ISO_DATE}
 *   ### Open Work ({count} stories)
 *   ### Recent Decisions (last {count})
 *   ### Active Risk Notes ({count} active)
 *   ### Suggested Next Steps
 *   ---
 *   Context loaded. Developer can resume immediately.
 *
 * @param {Array<{ticket: string, status: string, title: string}>} openStories
 * @param {Array<{drNumber: string, decisionSummary: string, ticket: string, date: string}>} recentDecisions
 * @param {Array<{rnNumber: string, riskDescription: string, severity: string, affectedArea: string, ticket: string}>} activeRisks
 * @param {string[]} nextSteps
 * @returns {string} Formatted session summary
 */
export function formatSessionSummary(openStories, recentDecisions, activeRisks, nextSteps) {
  const isoDate = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');

  const lines = [];

  // Header
  lines.push(`## Session Context — ${isoDate}`);
  lines.push('');

  // Open Work section
  lines.push(`### Open Work (${openStories.length} stories)`);
  lines.push('');
  if (openStories.length === 0) {
    lines.push('_(No open stories)_');
  } else {
    for (const story of openStories) {
      lines.push(`- **${story.ticket}** [${story.status}] — ${story.title}`);
    }
  }
  lines.push('');

  // Recent Decisions section
  lines.push(`### Recent Decisions (last ${recentDecisions.length})`);
  lines.push('');
  if (recentDecisions.length === 0) {
    lines.push('_(No decision records found)_');
  } else {
    for (const dr of recentDecisions) {
      lines.push(`- **${dr.drNumber}**: ${dr.decisionSummary} (ticket: ${dr.ticket}, date: ${dr.date})`);
    }
  }
  lines.push('');

  // Active Risk Notes section
  lines.push(`### Active Risk Notes (${activeRisks.length} active)`);
  lines.push('');
  if (activeRisks.length === 0) {
    lines.push('_(No active risk notes)_');
  } else {
    for (const risk of activeRisks) {
      lines.push(`- **${risk.rnNumber}** [${risk.severity}]: ${risk.riskDescription} — Affected: ${risk.affectedArea} (ticket: ${risk.ticket})`);
    }
  }
  lines.push('');

  // Suggested Next Steps section
  lines.push('### Suggested Next Steps');
  lines.push('');
  if (nextSteps.length === 0) {
    lines.push('_(No open stories — nothing pending)_');
  } else {
    nextSteps.forEach((step, index) => {
      lines.push(`${index + 1}. ${step}`);
    });
  }
  lines.push('');

  lines.push('---');
  lines.push('Context loaded. Developer can resume immediately.');

  return lines.join('\n');
}
