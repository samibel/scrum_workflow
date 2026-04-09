/**
 * Decision Extraction Utility
 * Story 7.1: Implement Decision Record Extraction
 *
 * Provides functions for detecting decisions in refinement and approval artifacts,
 * generating sequential DR-XXX.md files, and enforcing write boundary rules.
 *
 * NFR Compliance:
 * - NFR-2: No external dependencies (pure Node.js, no npm packages beyond existing)
 * - NFR-3: All writes are local file operations (offline capable)
 * - NFR-4: Each DR-XXX.md is written atomically (single writeFileSync call)
 * - NFR-7: Every DR includes ticket field linking back to source story
 * - NFR-9: DR artifacts are human-readable Markdown with YAML frontmatter
 */

import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

// ─── Constants ────────────────────────────────────────────────────────────────

/**
 * Decision signal patterns — phrases that indicate an explicit choice was made
 * between alternatives with documented rationale.
 */
const DECISION_SIGNAL_PATTERNS = [
  // "chose X over Y" / "chosen over"
  /\bcho(?:se|osen)\s+\S+(?:\s+\S+){0,5}\s+over\s+\S+/i,
  // "selected because" / "was selected"
  /\b(?:was\s+)?selected\s+(?:because|over|as|for)\b/i,
  // "using X instead of Y"
  /\busing\s+\S+(?:\s+\S+){0,3}\s+instead\s+of\s+\S+/i,
  // "use X over Y" / "use X instead of Y"
  /\buse\s+\S+(?:\s+\S+){0,3}\s+(?:over|instead\s+of)\s+\S+/i,
  // "approved because X chosen over Y"
  /\bapproved\s+because\s+\S+(?:\s+\S+){0,5}\s+(?:chosen|selected|picked)\s+over\s+\S+/i,
  // "X was chosen" / "X is chosen"
  /\b\S+\s+(?:was|is)\s+chosen\b/i,
  // "X was preferred over Y"
  /\b\S+(?:\s+\S+){0,3}\s+(?:was\s+)?preferred\s+over\s+\S+/i,
  // "decided to use X"
  /\bdecided\s+to\s+use\s+\S+/i,
  // "X rejected because" / "rejected in favor of"
  /\b\S+(?:\s+\S+){0,3}\s+rejected\s+(?:because|due|in\s+favor)/i,
];

/**
 * Patterns that do NOT indicate decisions (to prevent false positives)
 */
const NON_DECISION_PATTERNS = [
  // Simple task descriptions
  /^(?:Task|Step|Phase)\s+\d+:/i,
  // Status updates
  /^(?:Status|Progress|Update):/i,
  // Bug descriptions
  /\b(?:Bug|Issue|Error|Fix):/i,
];

// ─── Core Functions ───────────────────────────────────────────────────────────

/**
 * Ensures the decisions directory exists, creating it if necessary.
 * This is expected on first run and is NOT an error condition.
 *
 * @param {string} decisionsDir - Absolute path to the decisions directory
 */
export function ensureDecisionsDirExists(decisionsDir) {
  if (!existsSync(decisionsDir)) {
    mkdirSync(decisionsDir, { recursive: true });
  }
}

/**
 * Formats a DR number as a zero-padded 3-digit string.
 *
 * @param {number} n - The DR number (1-999)
 * @returns {string} Zero-padded string (e.g., "001", "042", "100")
 */
export function formatDRNumber(n) {
  return String(n).padStart(3, '0');
}

/**
 * Scans decisions directory for existing DR-NNN.md files and returns the next
 * sequential number. If no DRs exist, returns 1 (DR-001).
 *
 * Sequential numbering critical requirements:
 * - Always scan for existing files matching DR-[0-9][0-9][0-9].md
 * - Sort numerically, take highest, increment by 1
 * - Never fill gaps — always use highest + 1
 *
 * @param {string} decisionsDir - Path to the decisions directory
 * @returns {number} Next DR number (1-based)
 */
export function getNextDRNumber(decisionsDir) {
  ensureDecisionsDirExists(decisionsDir);

  const files = readdirSync(decisionsDir);
  const drFiles = files.filter(f => /^DR-\d{3}\.md$/.test(f));

  if (drFiles.length === 0) {
    return 1;
  }

  const numbers = drFiles.map(f => {
    const match = f.match(/^DR-(\d{3})\.md$/);
    return match ? parseInt(match[1], 10) : 0;
  });

  return Math.max(...numbers) + 1;
}

/**
 * Detects decision signals in text content.
 * A decision is an explicit choice between alternatives where the rationale is documented.
 *
 * What counts as a decision:
 * - Technology choice: framework, library, pattern, approach selection
 * - Architecture selection: pattern choice, structural decision
 * - Scope decision: what's in/out, phased vs all-at-once
 * - Signal phrases: "chose X over Y", "selected because", "using X instead of Y", etc.
 *
 * What does NOT count as a decision:
 * - Simple task descriptions
 * - Status updates
 * - Bug descriptions without alternatives
 * - Implementation steps without rationale
 *
 * @param {string} content - Text content to scan for decision signals
 * @returns {Array<{text: string, pattern: string}>} Array of detected decision signals
 */
export function detectDecisionSignals(content) {
  if (!content || typeof content !== 'string') {
    return [];
  }

  const signals = [];
  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Skip lines that match non-decision patterns
    const isNonDecision = NON_DECISION_PATTERNS.some(p => p.test(trimmed));
    if (isNonDecision) continue;

    // Check if line contains a decision signal
    for (const pattern of DECISION_SIGNAL_PATTERNS) {
      if (pattern.test(trimmed)) {
        signals.push({
          text: trimmed,
          pattern: pattern.toString(),
        });
        break; // One signal per line is enough
      }
    }
  }

  return signals;
}

/**
 * Enforces write boundary: decision-extraction may ONLY write to
 * _scrum-output/memory/decisions/ directory.
 *
 * Write Boundary Error format (from architecture.md):
 * "❌ Write Boundary Violation: decision-extraction-skill attempted to write '{file_path}'"
 *
 * @param {string} filePath - The file path to write
 * @param {string} content - The content to write
 * @throws {Error} If path is outside the allowed boundary
 */
export function writeDRWithBoundaryCheck(filePath, content) {
  const resolvedPath = resolve(filePath);

  // Prohibited paths: things the decision-extraction skill must never write to
  // These match specific artifact file patterns and sprint directories
  const PROHIBITED_PATTERNS = [
    /\/sprints\//,           // Sprint artifacts (story.md, refinement.md, etc.)
    /\/story\.md$/,          // Story files
    /\/refinement\.md$/,     // Refinement files
    /\/plan\.md$/,           // Plan files
    /\/review-\d+\.md$/,     // Review files
    /\/approval-\d+\.md$/,   // Approval files
    /\/skills\//,            // Framework skill files (within scrum_workflow/skills/)
    /\/workflows\//,         // Framework workflow files
    /\/commands\//,          // Framework command files
    /\/create-scrum-workflow\//, // CLI installer files
  ];

  // Check if path hits any prohibited pattern
  const isProhibited = PROHIBITED_PATTERNS.some(p => p.test(resolvedPath));

  // Also require the path to be within a memory-related directory
  // (either _scrum-output/memory/ or _test-output/memory/ for test isolation)
  const isInMemoryDir =
    resolvedPath.includes('/memory/') ||
    resolvedPath.includes('\\memory\\');

  const isAllowed = !isProhibited && isInMemoryDir;

  if (!isAllowed) {
    throw new Error(
      `❌ Write Boundary Violation: decision-extraction-skill attempted to write '${filePath}'\n\n` +
      `**Details:** The decision-extraction skill may only write to _scrum-output/memory/decisions/. ` +
      `Attempted write target is outside the allowed boundary.\n\n` +
      `**Next Step:** Halt immediately. Do not write the file. Report this boundary violation to the user.`
    );
  }

  // Ensure parent directory exists (use dirname for cross-platform safety)
  ensureDecisionsDirExists(dirname(resolvedPath));

  // Atomic write (single writeFileSync — NFR-4)
  writeFileSync(resolvedPath, content, 'utf8');
}

/**
 * Creates a DR-XXX.md artifact with required YAML frontmatter and Markdown body.
 *
 * Required frontmatter fields (from architecture.md):
 * - schema_version: "1.0.0"
 * - ticket: source story ID
 * - decision_summary: one-line summary
 * - date: ISO 8601 UTC timestamp
 * - context: why this decision was made
 * - alternatives_considered: array of {option, rejected_because}
 * - source: "refinement" or "approval"
 * - source_file: relative path to source artifact
 *
 * @param {Object} request - DR creation request
 * @param {string} request.ticketId - Source story ticket ID (e.g., "SW-001")
 * @param {string} request.decisionSummary - One-line summary of the decision
 * @param {string} request.date - ISO 8601 UTC timestamp
 * @param {string} request.context - Why this decision was made
 * @param {Array<{option: string, rejectedBecause: string}>} request.alternativesConsidered - Rejected alternatives
 * @param {string} request.source - "refinement" or "approval"
 * @param {string} request.sourceFile - Relative path to source artifact
 * @param {string} request.outputDir - Directory to write the DR file
 * @param {number} request.drNumber - The DR number to use
 * @returns {string} Absolute path to the created DR file
 */
export function createDRArtifact(request) {
  const {
    ticketId,
    decisionSummary,
    date,
    context,
    alternativesConsidered = [],
    source,
    sourceFile,
    outputDir,
    drNumber,
  } = request;

  const formattedNumber = formatDRNumber(drNumber);
  const fileName = `DR-${formattedNumber}.md`;
  const filePath = join(outputDir, fileName);

  // Sanitize values for YAML double-quoted scalars: escape backslashes first, then double-quotes.
  // Also collapse newlines to spaces so multi-line text remains a valid YAML scalar.
  const escapeYaml = (str) =>
    String(str ?? '').replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, ' ');

  // Build YAML frontmatter alternatives_considered block
  const alternativesYaml = alternativesConsidered.map(alt =>
    `  - option: "${escapeYaml(alt.option)}"\n    rejected_because: "${escapeYaml(alt.rejectedBecause)}"`
  ).join('\n');

  // Build alternatives table for Markdown body
  const alternativesTable = alternativesConsidered.length > 0
    ? alternativesConsidered.map(alt =>
        `| ${alt.option} | ${alt.rejectedBecause} |`
      ).join('\n')
    : '| — | No alternatives recorded |';

  const content = `---
schema_version: 1.0.0
ticket: "${escapeYaml(ticketId)}"
decision_summary: "${escapeYaml(decisionSummary)}"
date: "${date}"
context: "${escapeYaml(context)}"
alternatives_considered:
${alternativesYaml || '  - option: ""\n    rejected_because: ""'}
source: "${source}"
source_file: "${escapeYaml(sourceFile)}"
---

# Decision Record: ${decisionSummary}

**Ticket:** ${ticketId}
**Date:** ${date}
**Source:** ${sourceFile}

## Decision

${decisionSummary}

## Context

${context}

## Alternatives Considered

| Option | Reason Not Chosen |
|--------|------------------|
${alternativesTable}

## Consequences

This decision was extracted from ${source} artifact ${sourceFile} for ticket ${ticketId}.
`;

  // Enforce write boundary and write atomically (NFR-4)
  writeDRWithBoundaryCheck(filePath, content);

  return filePath;
}

/**
 * Extracts decision records from a refinement.md artifact.
 *
 * Algorithm:
 * 1. Scan content for decision signal phrases
 * 2. For each decision found, derive next DR number sequentially
 * 3. Create DR-NNN.md artifact with required YAML frontmatter
 * 4. Return list of created DR filenames
 *
 * If no decisions found: returns { created: [], noDecisionsDetected: true }
 * This is NOT an error condition.
 *
 * @param {Object} params
 * @param {string} params.content - Refinement artifact content
 * @param {string} params.ticketId - Source ticket ID
 * @param {string} params.sourceFile - Relative path to the refinement.md
 * @param {string} params.decisionsDir - Directory to write DR files
 * @returns {Promise<{created: string[], noDecisionsDetected: boolean}>}
 */
export async function extractDecisionsFromRefinement({ content, ticketId, sourceFile, decisionsDir }) {
  ensureDecisionsDirExists(decisionsDir);

  const signals = detectDecisionSignals(content);

  if (signals.length === 0) {
    return {
      created: [],
      noDecisionsDetected: true,
    };
  }

  const created = [];
  const date = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');

  for (const signal of signals) {
    const drNumber = getNextDRNumber(decisionsDir);
    const fileName = `DR-${formatDRNumber(drNumber)}.md`;

    createDRArtifact({
      ticketId,
      decisionSummary: signal.text.length > 120
        ? signal.text.substring(0, 117) + '...'
        : signal.text,
      date,
      context: signal.text,
      alternativesConsidered: [],
      source: 'refinement',
      sourceFile,
      outputDir: decisionsDir,
      drNumber,
    });

    created.push(fileName);
  }

  return {
    created,
    noDecisionsDetected: false,
  };
}

/**
 * Extracts decision records from an approval-N.md artifact.
 *
 * Decisions may be present in both approved and changes-needed approvals.
 * Source type will be "approval" (not "refinement").
 *
 * If no decisions found: returns { created: [], noDecisionsDetected: true }
 * This is NOT an error condition.
 *
 * @param {Object} params
 * @param {string} params.content - Approval artifact content
 * @param {string} params.ticketId - Source ticket ID
 * @param {string} params.sourceFile - Relative path to the approval-N.md
 * @param {string} params.decisionsDir - Directory to write DR files
 * @returns {Promise<{created: string[], noDecisionsDetected: boolean}>}
 */
export async function extractDecisionsFromApproval({ content, ticketId, sourceFile, decisionsDir }) {
  ensureDecisionsDirExists(decisionsDir);

  const signals = detectDecisionSignals(content);

  if (signals.length === 0) {
    return {
      created: [],
      noDecisionsDetected: true,
    };
  }

  const created = [];
  const date = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');

  for (const signal of signals) {
    const drNumber = getNextDRNumber(decisionsDir);
    const fileName = `DR-${formatDRNumber(drNumber)}.md`;

    createDRArtifact({
      ticketId,
      decisionSummary: signal.text.length > 120
        ? signal.text.substring(0, 117) + '...'
        : signal.text,
      date,
      context: signal.text,
      alternativesConsidered: [],
      source: 'approval',
      sourceFile,
      outputDir: decisionsDir,
      drNumber,
    });

    created.push(fileName);
  }

  return {
    created,
    noDecisionsDetected: false,
  };
}

/**
 * Simulates executing the approval workflow with decision extraction integration.
 * Used for workflow integration tests (AC2, 7.1-INT-016 and 7.1-INT-017).
 *
 * After the approval record is written, this function invokes decision extraction
 * and formats the completion summary with extracted DR references.
 *
 * @param {Object} params
 * @param {string} params.approvalContent - Content of the approval artifact
 * @param {string} params.ticketId - Source ticket ID
 * @param {string} params.sourceFile - Relative path to the approval-N.md
 * @param {string} params.decisionsDir - Directory to write DR files
 * @returns {Promise<{summary: string, created: string[]}>}
 */
export async function executeApprovalWorkflowWithDecisionExtraction({
  approvalContent,
  ticketId,
  sourceFile,
  decisionsDir,
}) {
  const result = await extractDecisionsFromApproval({
    content: approvalContent,
    ticketId,
    sourceFile,
    decisionsDir,
  });

  let summary;
  if (result.noDecisionsDetected || result.created.length === 0) {
    summary = `Approval complete for ${ticketId}. No decisions detected in approval reasoning.`;
  } else {
    const drList = result.created.join(', ');
    summary = `Approval complete for ${ticketId}. Extracted ${result.created.length} decision record${result.created.length > 1 ? 's' : ''}: ${drList}`;
  }

  return {
    summary,
    created: result.created,
  };
}
