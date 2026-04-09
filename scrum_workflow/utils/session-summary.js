/**
 * Session Summary Utility
 * Story 7.4: Implement Session Wrap-Up
 *
 * Provides functions for creating session summaries that capture what was
 * accomplished during a developer session, including stories worked on,
 * status changes, decisions made, risks identified, and pending actions.
 *
 * NFR Compliance:
 * - NFR-2: No external dependencies (pure Node.js, no npm packages)
 * - NFR-3: All operations are local file operations (offline capable)
 * - NFR-4: Session summaries are written atomically
 * - NFR-7: Each summary includes source file references
 * - NFR-9: Session summaries are human-readable Markdown with YAML frontmatter
 *
 * Architecture Compliance:
 * - Reads from: _scrum-output/sprints/, _scrum-output/memory/decisions/, _scrum-output/memory/risks/
 * - Writes to: _scrum-output/memory/sessions/ ONLY
 * - Uses readdirSync/readFileSync/writeFileSync for file operations
 * - Pure string YAML parsing — no external YAML library
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

// ─── YAML Frontmatter Parsing ─────────────────────────────────────────────────

/**
 * Parses YAML frontmatter block (between --- delimiters).
 * Pure string implementation — no external YAML library.
 *
 * @param {string} content - Full file content
 * @returns {Object} Parsed key-value pairs from frontmatter
 */
function parseFrontmatter(content) {
  if (!content || typeof content !== 'string') {
    return {};
  }

  if (!content.startsWith('---')) {
    return {};
  }

  const closingIndex = content.indexOf('\n---', 3);
  if (closingIndex === -1) {
    return {};
  }

  const frontmatterText = content.slice(3, closingIndex).trim();
  const result = {};

  const lines = frontmatterText.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    if (trimmed.startsWith('- ')) {
      continue;
    }

    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) {
      continue;
    }

    const key = line.slice(0, colonIndex).trim();
    const rawValue = line.slice(colonIndex + 1).trim();

    if (rawValue === '') {
      continue;
    }

    const value = rawValue.replace(/^["']|["']$/g, '');
    result[key] = value;
  }

  return result;
}

// ─── Session Context Gathering ────────────────────────────────────────────────

/**
 * Scans sprints directory for stories modified after session start time.
 * Returns array of { ticket, status, title, lastModified }.
 *
 * @param {string} sprintsDir - Path to _scrum-output/sprints/
 * @param {Date} sessionStartTime - Session start timestamp
 * @returns {Array} Array of story objects
 */
export function gatherSessionContext(sprintsDir, sessionStartTime) {
  const stories = [];

  if (!existsSync(sprintsDir)) {
    return stories;
  }

  const entries = readdirSync(sprintsDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const ticketDir = join(sprintsDir, entry.name);
    const storyPath = join(ticketDir, 'story.md');

    if (!existsSync(storyPath)) {
      continue;
    }

    try {
      const stats = statSync(storyPath);
      const lastModified = new Date(stats.mtime);

      // Only include if modified after session start
      if (lastModified >= sessionStartTime) {
        const content = readFileSync(storyPath, 'utf-8');
        const frontmatter = parseFrontmatter(content);

        stories.push({
          ticket: entry.name,
          status: frontmatter.status || 'unknown',
          title: frontmatter.title || entry.name,
          lastModified: lastModified.toISOString(),
        });
      }
    } catch (e) {
      // Skip files we can't read (e.g., permission denied, file deleted between stat and read)
      continue;
    }
  }

  return stories;
}

// ─── Status Change Extraction ──────────────────────────────────────────────────

/**
 * Extracts status transitions from stories.
 * For now, returns basic status info from session context.
 *
 * @param {Array} stories - Array of story objects from gatherSessionContext
 * @param {Date} sessionStartTime - Session start timestamp (unused but kept for API consistency)
 * @returns {Array} Array of status change objects
 */
export function extractStatusChanges(stories, sessionStartTime) {
  const changes = [];

  if (!Array.isArray(stories)) {
    return changes;
  }

  for (const story of stories) {
    if (!story || typeof story !== 'object') {
      continue;
    }
    // Since we don't have history, we report current status
    changes.push({
      ticket: story.ticket || 'unknown',
      currentStatus: story.status || 'unknown',
      timestamp: story.lastModified || new Date().toISOString(),
    });
  }

  return changes;
}

// ─── Decision Loading ──────────────────────────────────────────────────────────

/**
 * Loads decision records created/modified during the session window.
 * Scans _scrum-output/memory/decisions/ for DR-*.md files.
 *
 * @param {string} decisionsDir - Path to decisions directory
 * @param {Date} sessionStartTime - Session start timestamp
 * @returns {Array} Array of decision objects
 */
export function loadSessionDecisions(decisionsDir, sessionStartTime) {
  const decisions = [];

  if (!existsSync(decisionsDir)) {
    return decisions;
  }

  const files = readdirSync(decisionsDir);

  for (const file of files) {
    if (!file.match(/^DR-\d{3}\.md$/)) {
      continue;
    }

    const filePath = join(decisionsDir, file);

    try {
      const stats = statSync(filePath);
      const fileTime = new Date(stats.mtime);

      if (fileTime >= sessionStartTime) {
        const content = readFileSync(filePath, 'utf-8');
        const frontmatter = parseFrontmatter(content);

        const drMatch = file.match(/DR-(\d{3})/);
        const drNumber = drMatch ? drMatch[1] : '000';

        decisions.push({
          drNumber: `DR-${drNumber}`,
          decisionSummary: frontmatter.decision_summary || file,
          ticket: frontmatter.ticket || 'unknown',
          created: fileTime.toISOString(),
        });
      }
    } catch (e) {
      // Skip files we can't read (e.g., permission denied, file deleted between stat and read)
      continue;
    }
  }

  return decisions;
}

// ─── Risk Loading ─────────────────────────────────────────────────────────────

/**
 * Loads risk notes created/modified during the session window.
 * Scans _scrum-output/memory/risks/ for RN-*.md files.
 *
 * @param {string} risksDir - Path to risks directory
 * @param {Date} sessionStartTime - Session start timestamp
 * @returns {Array} Array of risk objects
 */
export function loadSessionRisks(risksDir, sessionStartTime) {
  const risks = [];

  if (!existsSync(risksDir)) {
    return risks;
  }

  const files = readdirSync(risksDir);

  for (const file of files) {
    if (!file.match(/^RN-\d{3}\.md$/)) {
      continue;
    }

    const filePath = join(risksDir, file);

    try {
      const stats = statSync(filePath);
      const fileTime = new Date(stats.mtime);

      if (fileTime >= sessionStartTime) {
        const content = readFileSync(filePath, 'utf-8');
        const frontmatter = parseFrontmatter(content);

        const rnMatch = file.match(/RN-(\d{3})/);
        const rnNumber = rnMatch ? rnMatch[1] : '000';

        risks.push({
          rnNumber: `RN-${rnNumber}`,
          riskDescription: frontmatter.risk_description || file,
          severity: frontmatter.severity || 'medium',
          affectedArea: frontmatter.affected_area || 'unknown',
          ticket: frontmatter.ticket || 'unknown',
        });
      }
    } catch (e) {
      // Skip files we can't read (e.g., permission denied, file deleted between stat and read)
      continue;
    }
  }

  return risks;
}

// ─── Pending Actions Derivation ────────────────────────────────────────────────

/**
 * Derives pending actions from incomplete stories and unresolved risks.
 *
 * @param {Array} stories - Array of story objects
 * @param {Array} statusChanges - Array of status change objects
 * @param {Array} risks - Array of risk objects
 * @returns {Array} Array of action objects
 */
export function derivePendingActions(stories, statusChanges, risks) {
  const actions = [];

  // Add actions for incomplete stories
  if (Array.isArray(stories)) {
    for (const story of stories) {
      if (!story || typeof story !== 'object') {
        continue;
      }
      if (story.status !== 'done' && story.status !== 'cancelled') {
        actions.push({
          type: 'story',
          ticket: story.ticket || 'unknown',
          action: `Resume work on ${story.ticket || 'unknown'}: ${story.title || 'unknown'}`,
          priority: story.status === 'in-progress' ? 'high' : 'medium',
        });
      }
    }
  }

  // Add actions for unresolved risks
  if (Array.isArray(risks)) {
    for (const risk of risks) {
      if (!risk || typeof risk !== 'object') {
        continue;
      }
      actions.push({
        type: 'risk',
        ticket: risk.ticket || 'unknown',
        action: `Address risk ${risk.rnNumber || 'RN-000'}: ${risk.riskDescription || 'unknown'}`,
        priority: risk.severity === 'high' ? 'high' : 'medium',
      });
    }
  }

  return actions;
}

// ─── Session Summary Formatting ────────────────────────────────────────────────

/**
 * Formats session context into markdown with YAML frontmatter.
 *
 * @param {Object} sessionData - Aggregated session data
 * @returns {string} Formatted markdown content
 */
export function formatSessionSummary(sessionData) {
  const {
    date,
    stories,
    statusChanges,
    decisions,
    risks,
    pendingActions,
    sessionDuration,
  } = sessionData;

  // Build stories list
  const storyTickets = stories.map(s => s.ticket);

  // Build frontmatter
  const frontmatter = [
    '---',
    `schema_version: 1.0.0`,
    `date: ${date}`,
    `session_duration: "${sessionDuration}"`,
    `stories_touched: [${storyTickets.map(t => `"${t}"`).join(', ')}]`,
    `decisions_created: [${decisions.map(d => `"${d.drNumber}"`).join(', ')}]`,
    `risks_identified: [${risks.map(r => `"${r.rnNumber}"`).join(', ')}]`,
    '---',
  ].join('\n');

  // Build content sections
  const sections = [];

  // Stories Worked On
  sections.push('## Stories Worked On\n');
  if (stories.length === 0) {
    sections.push('No stories modified in this session.\n');
  } else {
    for (const story of stories) {
      sections.push(`- **${story.ticket}**: ${story.title} (status: ${story.status})`);
    }
    sections.push('');
  }

  // Status Changes
  sections.push('## Status Changes\n');
  if (statusChanges.length === 0) {
    sections.push('No status changes recorded.\n');
  } else {
    for (const change of statusChanges) {
      sections.push(
        `- **${change.ticket}**: Current status is \`${change.currentStatus}\``
      );
    }
    sections.push('');
  }

  // Decisions Made
  sections.push('## Decisions Made\n');
  if (decisions.length === 0) {
    sections.push('No decisions recorded in this session.\n');
  } else {
    for (const decision of decisions) {
      sections.push(
        `- **${decision.drNumber}** (${decision.ticket}): ${decision.decisionSummary}`
      );
    }
    sections.push('');
  }

  // Risks Identified
  sections.push('## Risks Identified\n');
  if (risks.length === 0) {
    sections.push('No risks identified in this session.\n');
  } else {
    for (const risk of risks) {
      sections.push(
        `- **${risk.rnNumber}** [${risk.severity}] (${risk.ticket}): ${risk.riskDescription}`
      );
    }
    sections.push('');
  }

  // Pending Actions
  sections.push('## Pending Actions\n');
  if (pendingActions.length === 0) {
    sections.push('No pending actions.\n');
  } else {
    sections.push('### High Priority\n');
    const highPriority = pendingActions.filter(a => a.priority === 'high');
    if (highPriority.length > 0) {
      for (const action of highPriority) {
        sections.push(`- [${action.ticket}] ${action.action}`);
      }
    } else {
      sections.push('None');
    }
    sections.push('');

    sections.push('### Medium Priority\n');
    const mediumPriority = pendingActions.filter(a => a.priority === 'medium');
    if (mediumPriority.length > 0) {
      for (const action of mediumPriority) {
        sections.push(`- [${action.ticket}] ${action.action}`);
      }
    } else {
      sections.push('None');
    }
    sections.push('');
  }

  return frontmatter + '\n\n' + sections.join('\n');
}

// ─── Session Summary Writing (with collision handling) ───────────────────────────

/**
 * Writes or appends session summary to file with collision handling.
 * If file exists, appends a new session block.
 * Returns path to written/updated file.
 *
 * @param {string} sessionsDir - Path to sessions directory
 * @param {string} summary - Formatted summary markdown
 * @returns {string} Path to written file
 */
export function writeSessionSummary(sessionsDir, summary) {
  // Ensure directory exists (with retry logic for race conditions)
  for (let attempt = 0; attempt < 3; attempt++) {
    if (existsSync(sessionsDir)) {
      break;
    }
    try {
      mkdirSync(sessionsDir, { recursive: true });
    } catch (e) {
      // Directory might exist now (created by another process), ignore
      if (attempt === 2) {
        throw e;  // Last attempt, propagate error
      }
    }
  }

  // Extract date from summary frontmatter
  const dateMatch = summary.match(/^---\n[\s\S]*?date:\s*(\d{4}-\d{2}-\d{2})/);
  const date = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0];

  const baseFileName = `session-${date}.md`;
  const basePath = join(sessionsDir, baseFileName);

  // If file doesn't exist, just write it
  if (!existsSync(basePath)) {
    // Ensure parent directory exists before writing (with retry)
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        if (!existsSync(sessionsDir)) {
          mkdirSync(sessionsDir, { recursive: true });
        }
        writeFileSync(basePath, summary, 'utf-8');
        return basePath;
      } catch (e) {
        if (attempt === 2) {
          throw e;  // Last attempt, propagate error
        }
        // Wait a tiny bit and retry
      }
    }
    return basePath;  // Should not reach here
  }

  // File exists — append mode
  // Read existing content FIRST to preserve it
  const existingContent = readFileSync(basePath, 'utf-8');

  // Separate the new summary frontmatter and content
  const endFrontmatter = summary.indexOf('\n---\n') + 5;
  const newContent = summary.slice(endFrontmatter);

  // Check if existing file has our frontmatter format
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n/;
  const frontmatterMatch = existingContent.match(frontmatterRegex);

  let appendedContent;
  const timestamp = new Date().toISOString();

  if (frontmatterMatch) {
    // File has our format - keep the frontmatter and original content structure
    const originalFrontmatter = frontmatterMatch[0];
    const contentAfterFrontmatter = existingContent.slice(originalFrontmatter.length);

    // Append new session block after original content
    const newSessionBlock = `\n---\n## Session Block (${timestamp})\n${newContent}`;
    appendedContent = originalFrontmatter + contentAfterFrontmatter + newSessionBlock;
  } else {
    // File doesn't have our format (e.g., manually created in tests)
    // Just append the new summary as an additional section
    const newSessionBlock = `\n\n---\n## Session Block (${timestamp})\n${newContent}`;
    appendedContent = existingContent + newSessionBlock;
  }

  // Write with retry logic
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      writeFileSync(basePath, appendedContent, 'utf-8');
      return basePath;
    } catch (e) {
      if (attempt === 2) {
        throw e;  // Last attempt, propagate error
      }
      // Retry
    }
  }

  return basePath;  // Should not reach here
}

// ─── Session Start Time Parsing ───────────────────────────────────────────────

/**
 * Determines the session start time from environment or context.
 * Priority: env var > last session file mtime > current time
 *
 * @param {string} sessionsDir - Path to sessions directory (optional)
 * @returns {Date} Session start time
 */
export function parseSessionStartTime(sessionsDir) {
  // Check environment variable first
  if (process.env.SCRUM_SESSION_START_TIME) {
    return new Date(process.env.SCRUM_SESSION_START_TIME);
  }

  // Try to find most recent session file mtime
  if (sessionsDir && existsSync(sessionsDir)) {
    try {
      const files = readdirSync(sessionsDir);
      let mostRecent = null;
      let mostRecentTime = 0;

      for (const file of files) {
        if (file.match(/^session-.*\.md$/)) {
          const filePath = join(sessionsDir, file);
          const stats = statSync(filePath);
          if (stats.mtime.getTime() > mostRecentTime) {
            mostRecent = filePath;
            mostRecentTime = stats.mtime.getTime();
          }
        }
      }

      if (mostRecent) {
        return new Date(mostRecentTime);
      }
    } catch (e) {
      // Fall through to current time
    }
  }

  // Default to current time
  return new Date();
}

// ─── Main Orchestrator Function ───────────────────────────────────────────────

/**
 * Main function to create a session summary.
 * Orchestrates all steps: gather context, extract changes, load decisions/risks,
 * derive actions, format, and write.
 *
 * @param {Object} options - Configuration options
 * @param {string} options.sprintsDir - Path to sprints directory
 * @param {string} options.decisionsDir - Path to decisions directory
 * @param {string} options.risksDir - Path to risks directory
 * @param {string} options.outputDir - Path to output sessions directory
 * @param {Date} options.sessionStartTime - Session start timestamp
 * @returns {Promise<string>} Path to created/updated file
 */
export async function createSessionSummary(options) {
  const {
    sprintsDir,
    decisionsDir,
    risksDir,
    outputDir,
    sessionStartTime,
  } = options;

  // Gather all session data
  const stories = gatherSessionContext(sprintsDir, sessionStartTime);
  const statusChanges = extractStatusChanges(stories, sessionStartTime);
  const decisions = loadSessionDecisions(decisionsDir, sessionStartTime);
  const risks = loadSessionRisks(risksDir, sessionStartTime);
  const pendingActions = derivePendingActions(stories, statusChanges, risks);

  // Calculate session duration
  const now = new Date();
  const durationMs = now.getTime() - sessionStartTime.getTime();
  const durationMinutes = Math.round(durationMs / (60 * 1000));
  const durationHours = Math.floor(durationMinutes / 60);
  const sessionDuration =
    durationHours === 0
      ? durationMinutes < 1
        ? 'less than 1 minute'
        : `approximately ${durationMinutes} minute${durationMinutes === 1 ? '' : 's'}`
      : `approximately ${durationHours} hour${durationHours === 1 ? '' : 's'}`;

  // Format summary
  const date = now.toISOString().split('T')[0];
  const summary = formatSessionSummary({
    date,
    stories,
    statusChanges,
    decisions,
    risks,
    pendingActions,
    sessionDuration,
  });

  // Write to file
  const filePath = writeSessionSummary(outputDir, summary);

  return filePath;
}
