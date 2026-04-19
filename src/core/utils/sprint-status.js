/**
 * Story 8.4: Implement Sprint Status Command
 *
 * Utility functions for displaying sprint-level story status.
 * Scans all story directories and displays a summary table with status, age, and pending actions.
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'url';

// Status priority order (highest to lowest priority)
const STATUS_PRIORITY = {
  'changes-needed': 1,
  'blocked': 2,
  'in-progress': 3,
  'review': 4,
  'approved': 5,
  'refined': 6,
  'ready-for-dev': 7,
  'draft': 8,
  'done': 9,
  'cancelled': 10
};

// Pending action mapping
const PENDING_ACTION_MAP = {
  'draft': '/scrum-refine-ticket',
  'refined': '/scrum-refine-story',
  'ready-for-dev': '/scrum-dev-story',
  'in-progress': '/scrum-verify',
  'review': '/scrum-approve',
  'approved': '/scrum-approve',
  'changes-needed': '/scrum-dev-story',
  'blocked': '/scrum-refine-ticket',
  'done': 'N/A',
  'cancelled': 'N/A'
};

// Color mapping for status (ANSI escape codes via picocolors-style)
const STATUS_COLORS = {
  'changes-needed': 'red',
  'blocked': 'red',
  'in-progress': 'yellow',
  'review': 'cyan',
  'approved': 'green',
  'done': 'green',
  'refined': 'default',
  'ready-for-dev': 'default',
  'draft': 'default',
  'cancelled': 'default'
};

/**
 * Validates ticket ID format
 * @param {string} ticketId - Ticket ID to validate
 * @returns {boolean} True if valid
 */
export function isValidTicketId(ticketId) {
  return /^SW-\d{3}$/.test(ticketId);
}

/**
 * Calculates age in days from a timestamp
 * @param {string} timestamp - ISO 8601 timestamp
 * @returns {number|null} Age in days or null if invalid timestamp
 */
export function calculateAgeInDays(timestamp) {
  if (!timestamp) return null;

  try {
    const created = new Date(timestamp);
    if (isNaN(created.getTime())) return null;
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return diffDays;
  } catch {
    return null;
  }
}

/**
 * Gets priority for a status (lower number = higher priority)
 * @param {string} status - Story status
 * @returns {number} Priority value
 */
export function getStatusPriority(status) {
  return STATUS_PRIORITY[status] || 999;
}

/**
 * Determines pending action based on current status
 * @param {string} status - Story status
 * @returns {string} Next command to run
 */
export function getPendingAction(status) {
  return PENDING_ACTION_MAP[status] || 'N/A';
}

/**
 * Checks if a story requires action (is in a transitional state)
 * @param {string} status - Story status
 * @returns {boolean} True if action is needed
 */
export function requiresAction(status) {
  return ['changes-needed', 'in-progress', 'review', 'approved'].includes(status);
}

/**
 * Gets color name for a status
 * @param {string} status - Story status
 * @returns {string} Color name
 */
export function getStatusColor(status) {
  return STATUS_COLORS[status] || 'default';
}

/**
 * Parses story metadata from a story.md YAML frontmatter
 * @param {string} filePath - Path to story.md file
 * @returns {Object|null} Parsed metadata or null if error
 */
export function parseStoryMetadata(filePath) {
  if (!existsSync(filePath)) {
    return null;
  }

  try {
    const content = readFileSync(filePath, 'utf8');

    // Extract YAML frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]+?)\n---/);
    if (!frontmatterMatch) {
      return null;
    }

    const frontmatter = {};
    const lines = frontmatterMatch[1].split('\n');

    for (const line of lines) {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim();
        frontmatter[key] = value;
      }
    }

    return {
      ticket: frontmatter.ticket || null,
      title: frontmatter.title || null,
      status: frontmatter.status || null,
      created: frontmatter.created || null,
      updated: frontmatter.updated || null,
      epic: frontmatter.epic || null,
      content: content
    };
  } catch {
    return null;
  }
}

/**
 * Scans sprint directory for all story directories
 * @param {string} projectRoot - Project root directory
 * @param {number|null} epicFilter - Optional epic number to filter by
 * @returns {Array} Array of story metadata objects
 */
export function scanSprintStories(projectRoot, epicFilter = null) {
  const sprintsDir = join(projectRoot, '_scrum-output', 'sprints');
  const stories = [];

  if (!existsSync(sprintsDir)) {
    return stories;
  }

  let entries;
  try {
    entries = readdirSync(sprintsDir);
  } catch {
    return stories;
  }

  for (const entry of entries) {
    // Check if it's a story directory (SW-XXX format)
    if (!/^SW-\d{3}$/.test(entry)) {
      continue;
    }

    const storyDir = join(sprintsDir, entry);
    const storyFile = join(storyDir, 'story.md');

    if (!existsSync(storyFile)) {
      continue;
    }

    const metadata = parseStoryMetadata(storyFile);
    if (!metadata || !metadata.ticket) {
      continue;
    }

    // Apply epic filter if specified
    if (epicFilter !== null) {
      const storyEpic = metadata.epic ? parseInt(metadata.epic, 10) : null;
      if (storyEpic !== epicFilter) {
        continue;
      }
    }

    // Calculate age
    const age = calculateAgeInDays(metadata.created);
    const pendingAction = getPendingAction(metadata.status);

    stories.push({
      ticket: metadata.ticket,
      title: metadata.title,
      status: metadata.status,
      created: metadata.created,
      age: age,
      pendingAction: pendingAction,
      requiresAction: requiresAction(metadata.status),
      color: getStatusColor(metadata.status),
      priority: getStatusPriority(metadata.status)
    });
  }

  return stories;
}

/**
 * Sorts stories by status priority
 * @param {Array} stories - Array of story objects
 * @returns {Array} Sorted stories (highest priority first)
 */
export function sortStoriesByPriority(stories) {
  return [...stories].sort((a, b) => {
    // First sort by priority
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    // Then by ticket ID for stable sort
    return a.ticket.localeCompare(b.ticket);
  });
}

/**
 * Formats a story row for terminal display
 * @param {Object} story - Story object
 * @param {Object} options - Formatting options
 * @returns {string} Formatted row
 */
export function formatStoryRow(story, options = {}) {
  const { showColor = true } = options;

  const ticket = story.ticket || '?';
  const title = story.title || 'Untitled';
  const status = story.status || 'unknown';
  const age = story.age !== null ? `${story.age}d` : '?';
  const pendingAction = story.pendingAction || 'N/A';

  // Truncate title if too long
  const maxTitleLength = 40;
  const truncatedTitle = title.length > maxTitleLength
    ? title.substring(0, maxTitleLength - 3) + '...'
    : title;

  return `${ticket} | ${truncatedTitle} | ${status} | ${age} | ${pendingAction}`;
}

/**
 * Formats empty state message
 * @returns {string} Empty state message
 */
export function formatEmptyState() {
  return 'No stories found. Start with /scrum-create-ticket';
}

/**
 * Parses subtask completion from story.md content
 * @param {string} content - Full story.md file content
 * @returns {{ done: number, total: number }} Subtask counts
 */
export function parseSubtasks(content) {
  const subtasksMatch = content.match(/## Subtasks\n([\s\S]*?)(?=\n## |\n---|\s*$)/);
  if (!subtasksMatch) return { done: 0, total: 0 };

  const section = subtasksMatch[1];
  const done = (section.match(/- \[x\]/gi) || []).length;
  const open = (section.match(/- \[ \]/g) || []).length;
  return { done, total: done + open };
}

/**
 * Renders a compact 4-char progress bar for task completion
 * @param {number} done - Completed tasks
 * @param {number} total - Total tasks
 * @returns {string} Formatted progress string
 */
export function formatTaskProgress(done, total) {
  if (total === 0) return 'no tasks';
  if (done === total) return '✓ done';

  const filled = Math.round((done / total) * 4);
  const bar = '█'.repeat(filled) + '░'.repeat(4 - filled);
  return `[${bar}] ${done}/${total}`;
}

// Column groupings for the Kanban dashboard
const DASHBOARD_COLUMNS = [
  { label: '📝 BACKLOG', sub: 'draft/refined/ready', statuses: ['draft', 'refined', 'ready-for-dev'] },
  { label: '🔧 IN PROGRESS', sub: 'in-prog/blocked', statuses: ['in-progress', 'changes-needed', 'blocked'] },
  { label: '👀 REVIEW', sub: 'review/approved', statuses: ['review', 'approved'] },
  { label: '✅ DONE', sub: 'done/cancelled', statuses: ['done', 'cancelled'] },
];

const COL_WIDTH = 20;
const CARD_LINES = 4; // lines per story card: header, title, tasks, action

/**
 * Pads or truncates a string to an exact width
 * @param {string} str
 * @param {number} width
 * @returns {string}
 */
function cell(str, width) {
  const s = String(str ?? '');
  return s.length >= width ? s.substring(0, width) : s + ' '.repeat(width - s.length);
}

/**
 * Renders the ASCII Kanban dashboard
 * @param {Array} stories - Story objects (with subtasks: {done, total} attached)
 * @returns {string} Full dashboard string
 */
export function formatDashboard(stories, dateStr = new Date().toISOString().split('T')[0]) {
  const colCount = DASHBOARD_COLUMNS.length;
  const totalWidth = 1 + colCount * (COL_WIDTH + 1); // borders included

  // Group stories by column
  const grouped = DASHBOARD_COLUMNS.map(col =>
    stories.filter(s => col.statuses.includes(s.status))
  );

  const maxRows = Math.max(...grouped.map(g => g.length), 0);

  // Header row
  const title = `SPRINT BOARD`;
  const headerInner = cell(title + ' '.repeat(Math.max(0, totalWidth - 4 - title.length - dateStr.length)) + dateStr, totalWidth - 2);
  const lines = [];

  // Top border
  lines.push('┌' + '─'.repeat(totalWidth - 2) + '┐');
  lines.push(`│ ${headerInner} │`);

  // Column headers separator
  lines.push('├' + DASHBOARD_COLUMNS.map(() => '─'.repeat(COL_WIDTH)).join('┬') + '┤');

  // Column label row
  lines.push('│' + DASHBOARD_COLUMNS.map(c => cell(` ${c.label}`, COL_WIDTH + 1)).join('│').slice(0, -1 * (DASHBOARD_COLUMNS.length - 1)) + '│');
  // Sub-label row
  lines.push('│' + DASHBOARD_COLUMNS.map(c => cell(`  ${c.sub}`, COL_WIDTH + 1)).join('│').slice(0, -1 * (DASHBOARD_COLUMNS.length - 1)) + '│');

  // Body separator
  lines.push('├' + DASHBOARD_COLUMNS.map(() => '─'.repeat(COL_WIDTH)).join('┼') + '┤');

  // Story cards
  for (let row = 0; row < Math.max(maxRows, 1); row++) {
    // 4 lines per card slot
    for (let line = 0; line < CARD_LINES; line++) {
      const rowCells = DASHBOARD_COLUMNS.map((_, ci) => {
        const story = grouped[ci][row];
        if (!story) return ' '.repeat(COL_WIDTH);

        if (line === 0) {
          const badge = story.status === 'changes-needed' ? '⚠️ ' : story.status === 'blocked' ? '🔴 ' : '';
          const age = story.age !== null ? ` ${story.age}d` : '';
          return cell(` ${badge}${story.ticket}${age}`, COL_WIDTH);
        }
        if (line === 1) {
          const title = (story.title || 'Untitled').substring(0, COL_WIDTH - 2);
          return cell(` ${title}`, COL_WIDTH);
        }
        if (line === 2) {
          const sub = story.subtasks ?? { done: 0, total: 0 };
          return cell(` Tasks: ${formatTaskProgress(sub.done, sub.total)}`, COL_WIDTH);
        }
        // line === 3: pending action
        return cell(` ${story.pendingAction || 'N/A'}`, COL_WIDTH);
      });
      lines.push('│' + rowCells.join('│') + '│');
    }

    // Blank separator between cards (except last row)
    if (row < maxRows - 1) {
      lines.push('│' + DASHBOARD_COLUMNS.map(() => ' '.repeat(COL_WIDTH)).join('│') + '│');
    }
  }

  // Bottom border
  lines.push('└' + DASHBOARD_COLUMNS.map(() => '─'.repeat(COL_WIDTH)).join('┴') + '┘');

  // Footer stats
  const total = stories.length;
  const actionNeeded = stories.filter(s => requiresAction(s.status)).length;
  const blocked = stories.filter(s => ['blocked', 'changes-needed'].includes(s.status)).length;
  const done = stories.filter(s => s.status === 'done').length;
  lines.push(` Total: ${total}  |  ⚠️ Action Needed: ${actionNeeded}  |  🔴 Blocked: ${blocked}  |  ✅ Done: ${done}`);

  return lines.join('\n');
}

// Re-export constants for external use
export { STATUS_PRIORITY, PENDING_ACTION_MAP, STATUS_COLORS, DASHBOARD_COLUMNS };
