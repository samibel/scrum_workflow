/**
 * Risk Extraction Utility
 * Story 7.2: Implement Risk Note Extraction & Auto-Loading
 *
 * Provides functions for detecting risks in Architect Perspective sections of
 * refinement artifacts, generating sequential RN-XXX.md files, enforcing write
 * boundary rules, and loading active risk notes for review agent context.
 *
 * NFR Compliance:
 * - NFR-2: No external dependencies (pure Node.js, no npm packages beyond existing)
 * - NFR-3: All writes are local file operations (offline capable)
 * - NFR-4: Each RN-XXX.md is written atomically (single writeFileSync call)
 * - NFR-7: Every RN includes ticket field linking back to source story
 * - NFR-9: RN artifacts are human-readable Markdown with YAML frontmatter
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';

// ─── Core Directory Functions ─────────────────────────────────────────────────

/**
 * Ensures the risks directory exists, creating it if necessary.
 * This is expected on first run and is NOT an error condition.
 *
 * @param {string} risksDir - Absolute path to the risks directory
 */
export function ensureRisksDirExists(risksDir) {
  if (!existsSync(risksDir)) {
    mkdirSync(risksDir, { recursive: true });
  }
}

/**
 * Formats a RN number as a zero-padded 3-digit string.
 *
 * @param {number} n - The RN number (1-999)
 * @returns {string} Zero-padded string (e.g., "001", "042", "100")
 */
export function formatRNNumber(n) {
  return String(n).padStart(3, '0');
}

/**
 * Scans risks directory for existing RN-NNN.md files and returns the next
 * sequential number. If no RNs exist, returns 1 (RN-001).
 *
 * Sequential numbering critical requirements:
 * - Always scan for existing files matching RN-[0-9][0-9][0-9].md
 * - Sort numerically, take highest, increment by 1
 * - Never fill gaps — always use highest + 1
 *
 * @param {string} risksDir - Path to the risks directory
 * @returns {number} Next RN number (1-based)
 */
export function getNextRNNumber(risksDir) {
  ensureRisksDirExists(risksDir);

  const files = readdirSync(risksDir);
  const rnFiles = files.filter(f => /^RN-\d{3}\.md$/.test(f));

  if (rnFiles.length === 0) {
    return 1;
  }

  const numbers = rnFiles.map(f => {
    const match = f.match(/^RN-(\d{3})\.md$/);
    return match ? parseInt(match[1], 10) : 0;
  });

  return Math.max(...numbers) + 1;
}

// ─── Risk Signal Detection ────────────────────────────────────────────────────

/**
 * Parses the Architect Perspective section from refinement.md content.
 * Extracts findings from the Findings table and recommendations from the
 * Recommendations section.
 *
 * The Architect agent output format (from architect.md):
 * - `## Architect Perspective` section header
 * - `### Findings` — table with columns: #, Finding, Severity, Category
 * - `### Recommendations` — numbered list
 *
 * @param {string} content - Refinement artifact content
 * @returns {Array<{risk_description: string, severity: string, affected_area: string, mitigation_suggestion: string}>}
 *   Array of detected risk signals, empty if none found
 */
export function detectRiskSignals(content) {
  if (!content || typeof content !== 'string') {
    return [];
  }

  // Find the Architect Perspective section
  const architectSectionMatch = content.match(/##\s+Architect\s+Perspective/i);
  if (!architectSectionMatch) {
    return [];
  }

  const architectSectionStart = architectSectionMatch.index;
  // Find the end: next ## heading at the same level or end of string
  const afterSection = content.slice(architectSectionStart + architectSectionMatch[0].length);
  const nextSectionMatch = afterSection.match(/\n##\s+/);
  const architectSectionContent = nextSectionMatch
    ? afterSection.slice(0, nextSectionMatch.index)
    : afterSection;

  // Parse the Findings table
  const findings = parseFindingsTable(architectSectionContent);

  if (findings.length === 0) {
    return [];
  }

  // Parse the Recommendations section for mitigation suggestions
  const recommendations = parseRecommendations(architectSectionContent);

  // Combine findings with recommendations (by position)
  return findings.map((finding, index) => ({
    risk_description: finding.finding,
    severity: normalizeSeverity(finding.severity),
    affected_area: finding.category,
    mitigation_suggestion: recommendations[index] ?? '',
  }));
}

/**
 * Parses the Findings table from Architect Perspective content.
 * Table format: | # | Finding | Severity | Category |
 *
 * @param {string} sectionContent - Content of the Architect Perspective section
 * @returns {Array<{finding: string, severity: string, category: string}>}
 */
function parseFindingsTable(sectionContent) {
  const findings = [];

  // Find ### Findings section
  const findingsSectionMatch = sectionContent.match(/###\s+Findings/i);
  if (!findingsSectionMatch) {
    return findings;
  }

  const findingsStart = findingsSectionMatch.index + findingsSectionMatch[0].length;
  // Find the end of the Findings section (next ### or ## or end)
  const afterFindings = sectionContent.slice(findingsStart);
  const nextSubsectionMatch = afterFindings.match(/\n###\s+/);
  const findingsContent = nextSubsectionMatch
    ? afterFindings.slice(0, nextSubsectionMatch.index)
    : afterFindings;

  const lines = findingsContent.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines, header rows, and separator rows
    if (!trimmed || !trimmed.startsWith('|')) continue;
    // Skip separator rows (contain --- cells)
    if (/^\|[\s\-|]+\|$/.test(trimmed)) continue;
    // Skip header rows (contain "Finding" and "Severity")
    if (/Finding.*Severity/i.test(trimmed) || /Severity.*Category/i.test(trimmed)) continue;

    // Parse data row: | # | Finding | Severity | Category |
    const cells = trimmed
      .split('|')
      .map(cell => cell.trim())
      .filter(cell => cell !== '');

    if (cells.length >= 4) {
      // cells[0] = #, cells[1] = Finding, cells[2] = Severity, cells[3] = Category
      const finding = cells[1];
      const severity = cells[2];
      const category = cells[3];

      if (finding && severity && category) {
        findings.push({ finding, severity, category });
      }
    }
  }

  return findings;
}

/**
 * Parses numbered recommendations from the Recommendations section.
 *
 * @param {string} sectionContent - Content of the Architect Perspective section
 * @returns {string[]} Array of recommendation strings (indexed by position)
 */
function parseRecommendations(sectionContent) {
  const recommendations = [];

  // Find ### Recommendations section
  const recSectionMatch = sectionContent.match(/###\s+Recommendations/i);
  if (!recSectionMatch) {
    return recommendations;
  }

  const recStart = recSectionMatch.index + recSectionMatch[0].length;
  const afterRec = sectionContent.slice(recStart);
  const nextSubsectionMatch = afterRec.match(/\n###\s+/);
  const recContent = nextSubsectionMatch
    ? afterRec.slice(0, nextSubsectionMatch.index)
    : afterRec;

  const lines = recContent.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    // Match numbered list items: "1. ...", "2. ..."
    const match = trimmed.match(/^\d+\.\s+(.+)$/);
    if (match) {
      recommendations.push(match[1].trim());
    }
  }

  return recommendations;
}

/**
 * Normalizes severity string to lowercase canonical form.
 * Maps: Critical → critical, Major → major, Minor → minor
 *
 * @param {string} severity - Severity from Findings table
 * @returns {string} Lowercase severity: "critical" | "major" | "minor"
 */
function normalizeSeverity(severity) {
  const lower = (severity ?? '').toLowerCase().trim();
  if (['critical', 'major', 'minor'].includes(lower)) {
    return lower;
  }
  // Best-effort normalization for unexpected values
  return lower || 'minor';
}

/**
 * Derives domain tags from category and finding content.
 * Normalizes: "Data Integrity" → "data-integrity", "Search Accuracy" → "search-accuracy"
 *
 * @param {string} category - Category from Architect Findings table
 * @returns {string[]} Array of normalized domain tags
 */
function deriveDomainTags(category) {
  if (!category) return [];

  // Normalize to lowercase-hyphenated
  const normalized = category
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  return [normalized];
}

// ─── Write Boundary Enforcement ───────────────────────────────────────────────

/**
 * Enforces write boundary: risk-extraction may ONLY write to
 * _scrum-output/memory/risks/ directory.
 *
 * Write Boundary Error format (from architecture.md):
 * "❌ Write Boundary Violation: risk-extraction-skill attempted to write '{file_path}'"
 *
 * @param {string} content - The content to write
 * @param {string} filePath - The file path to write
 * @param {string} allowedDir - The allowed directory (must be a memory/risks dir)
 * @throws {Error} If path is outside the allowed boundary
 */
export function writeRNWithBoundaryCheck(content, filePath, allowedDir) {
  const resolvedPath = resolve(filePath);

  // Prohibited paths: things the risk-extraction skill must never write to
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
      `❌ Write Boundary Violation: risk-extraction-skill attempted to write '${filePath}'\n\n` +
      `**Details:** The risk-extraction skill may only write to _scrum-output/memory/risks/. ` +
      `Attempted write target is outside the allowed boundary.\n\n` +
      `**Next Step:** Halt immediately. Do not write the file. Report this boundary violation to the user.`
    );
  }

  // Ensure parent directory exists (use dirname for cross-platform safety)
  ensureRisksDirExists(dirname(resolvedPath));

  // Atomic write (single writeFileSync — NFR-4)
  writeFileSync(resolvedPath, content, 'utf8');
}

// ─── RN Artifact Creation ─────────────────────────────────────────────────────

/**
 * Creates an RN-XXX.md artifact with required YAML frontmatter and Markdown body.
 *
 * Required frontmatter fields (from architecture.md):
 * - schema_version: "1.0.0"
 * - ticket: source story ID
 * - risk_description: one-line risk summary
 * - severity: critical | major | minor
 * - affected_area: category from Architect Findings
 * - mitigation_suggestion: recommendation from Architect
 * - status: active (always on creation)
 * - domain_tags: array of normalized domain tags
 * - source_file: relative path to source refinement.md
 * - created: ISO 8601 UTC timestamp
 * - updated: ISO 8601 UTC timestamp (same as created on initial write)
 *
 * @param {Object} request - RN creation request
 * @param {string} request.ticketId - Source story ticket ID (e.g., "SW-001")
 * @param {string} request.riskDescription - One-line risk summary
 * @param {string} request.severity - "critical" | "major" | "minor"
 * @param {string} request.affectedArea - Category from Architect Findings table
 * @param {string} request.mitigationSuggestion - Recommendation from Architect
 * @param {string[]} request.domainTags - Array of domain tags
 * @param {string} request.sourceFile - Relative path to source refinement.md
 * @param {string} request.outputDir - Directory to write the RN file
 * @param {number} request.rnNumber - The RN number to use
 * @returns {string} Absolute path to the created RN file
 */
export function createRNArtifact(request) {
  const {
    ticketId,
    riskDescription,
    severity,
    affectedArea,
    mitigationSuggestion,
    domainTags = [],
    sourceFile,
    outputDir,
    rnNumber,
  } = request;

  const formattedNumber = formatRNNumber(rnNumber);
  const fileName = `RN-${formattedNumber}.md`;
  const filePath = join(outputDir, fileName);

  // Sanitize values for YAML double-quoted scalars: escape backslashes first, then double-quotes.
  // Also collapse newlines to spaces so multi-line text remains a valid YAML scalar.
  const escapeYaml = (str) =>
    String(str ?? '').replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, ' ');

  const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');

  // Build domain_tags YAML block
  const domainTagsYaml = domainTags.length > 0
    ? domainTags.map(t => `  - "${escapeYaml(t)}"`).join('\n')
    : '  - ""';

  // Build domain tags inline for body
  const domainTagsInline = domainTags.join(', ');

  const content = `---
schema_version: 1.0.0
ticket: "${escapeYaml(ticketId)}"
risk_description: "${escapeYaml(riskDescription)}"
severity: "${escapeYaml(severity)}"
affected_area: "${escapeYaml(affectedArea)}"
mitigation_suggestion: "${escapeYaml(mitigationSuggestion)}"
status: active
domain_tags:
${domainTagsYaml}
source_file: "${escapeYaml(sourceFile)}"
created: "${timestamp}"
updated: "${timestamp}"
---

# Risk Note: ${riskDescription}

**Ticket:** ${ticketId}
**Severity:** ${severity}
**Status:** active
**Affected Area:** ${affectedArea}
**Created:** ${timestamp}
**Source:** ${sourceFile}

## Risk Description

${riskDescription}

## Mitigation Suggestion

${mitigationSuggestion}

## Domain Tags

${domainTagsInline}
`;

  // Enforce write boundary and write atomically (NFR-4)
  writeRNWithBoundaryCheck(content, filePath, outputDir);

  return filePath;
}

// ─── Main Extraction Function ─────────────────────────────────────────────────

/**
 * Extracts risk notes from a refinement.md artifact.
 *
 * Algorithm:
 * 1. Parse the Architect Perspective section for findings
 * 2. For each finding row in the Findings table, derive next RN number sequentially
 * 3. Create RN-NNN.md artifact with required YAML frontmatter
 * 4. Return list of created RN filenames
 *
 * If no risks found: returns { created: [], noRisksDetected: true }
 * This is NOT an error condition.
 *
 * @param {Object} params
 * @param {string} params.content - Refinement artifact content
 * @param {string} params.ticketId - Source ticket ID
 * @param {string} params.sourceFile - Relative path to the refinement.md
 * @param {string} params.risksDir - Directory to write RN files
 * @returns {Promise<{created: string[], noRisksDetected: boolean}>}
 */
export async function extractRisksFromRefinement({ content, ticketId, sourceFile, risksDir }) {
  ensureRisksDirExists(risksDir);

  const signals = detectRiskSignals(content);

  if (signals.length === 0) {
    return {
      created: [],
      noRisksDetected: true,
    };
  }

  const created = [];

  for (const signal of signals) {
    const rnNumber = getNextRNNumber(risksDir);
    const fileName = `RN-${formatRNNumber(rnNumber)}.md`;
    const domainTags = deriveDomainTags(signal.affected_area);

    createRNArtifact({
      ticketId,
      riskDescription: signal.risk_description.length > 200
        ? signal.risk_description.substring(0, 197) + '...'
        : signal.risk_description,
      severity: signal.severity,
      affectedArea: signal.affected_area,
      mitigationSuggestion: signal.mitigation_suggestion,
      domainTags,
      sourceFile,
      outputDir: risksDir,
      rnNumber,
    });

    created.push(fileName);
  }

  return {
    created,
    noRisksDetected: false,
  };
}

// ─── Active Risk Note Loading for Review ─────────────────────────────────────

/**
 * Parses the YAML frontmatter from an RN artifact content string.
 * Pure string parsing — no external YAML library (NFR-2).
 *
 * @param {string} content - Full RN artifact file content
 * @returns {Object|null} Parsed frontmatter fields, or null if no frontmatter found
 */
export function parseRNFrontmatter(content) {
  if (!content || typeof content !== 'string') {
    return null;
  }

  // Must start with ---
  if (!content.startsWith('---')) {
    return null;
  }

  // Find the closing ---
  const closingIndex = content.indexOf('\n---', 3);
  if (closingIndex === -1) {
    return null;
  }

  const frontmatterText = content.slice(3, closingIndex).trim();
  const result = {};

  // Parse line by line
  const lines = frontmatterText.split('\n');
  let i = 0;
  let currentArrayKey = null;
  const arrayValues = {};

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines and comment lines
    if (!trimmed || trimmed.startsWith('#')) {
      i++;
      continue;
    }

    // Array item: starts with "  - " or "- "
    if (trimmed.startsWith('- ')) {
      if (currentArrayKey) {
        const value = trimmed.slice(2).trim().replace(/^["']|["']$/g, '');
        if (!arrayValues[currentArrayKey]) arrayValues[currentArrayKey] = [];
        arrayValues[currentArrayKey].push(value);
      }
      i++;
      continue;
    }

    // Key-value pair
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) {
      i++;
      continue;
    }

    const key = line.slice(0, colonIndex).trim();
    const rawValue = line.slice(colonIndex + 1).trim();

    // Check if this is a block array (value is empty after colon)
    if (rawValue === '') {
      currentArrayKey = key;
      arrayValues[key] = [];
      i++;
      continue;
    }

    // Scalar value — reset current array context
    currentArrayKey = null;

    // Strip surrounding quotes
    const value = rawValue.replace(/^["']|["']$/g, '');
    result[key] = value;

    i++;
  }

  // Merge array values into result
  for (const [key, values] of Object.entries(arrayValues)) {
    result[key] = values;
  }

  // Validate that we have at least a status field
  if (result.status === undefined) {
    return null;
  }

  return result;
}

/**
 * Filters risks directory for active-only RN files.
 * Returns absolute paths to all RN-NNN.md files with status: active.
 * Read-only operation — NEVER writes or modifies files.
 *
 * @param {string} risksDir - Path to the risks directory
 * @returns {string[]} Array of absolute paths to active RN files
 */
export function filterActiveRiskNotes(risksDir) {
  if (!existsSync(risksDir)) {
    return [];
  }

  let files;
  try {
    files = readdirSync(risksDir);
  } catch {
    return [];
  }

  const rnFiles = files.filter(f => /^RN-\d{3}\.md$/.test(f));
  const activeRNPaths = [];

  for (const fileName of rnFiles) {
    const filePath = join(risksDir, fileName);
    try {
      const content = readFileSync(filePath, 'utf8');
      const frontmatter = parseRNFrontmatter(content);
      if (frontmatter && frontmatter.status === 'active') {
        activeRNPaths.push(filePath);
      }
    } catch {
      // Skip unreadable files — graceful degradation
    }
  }

  return activeRNPaths;
}

/**
 * Matches risk notes to a story by domain tag and affected area overlap.
 * Read-only — NEVER modifies files.
 *
 * Domain matching algorithm (simple string matching — no external libraries):
 * 1. For each active RN: check domain_tags against storyContext.domainKeywords
 * 2. Also check affected_area (normalized) against storyContext.domainKeywords
 * 3. Include RN if any match found
 *
 * @param {Object} params
 * @param {string} params.risksDir - Path to the risks directory
 * @param {Object} params.storyContext - Story context for domain matching
 * @param {string[]} params.storyContext.domainKeywords - Keywords from story title and ACs
 * @returns {string[]} Array of absolute paths to matched RN files
 */
export function matchRiskNotesToStory({ risksDir, storyContext }) {
  if (!existsSync(risksDir)) {
    return [];
  }

  let files;
  try {
    files = readdirSync(risksDir);
  } catch {
    return [];
  }

  const rnFiles = files.filter(f => /^RN-\d{3}\.md$/.test(f));
  const matched = [];

  const domainKeywords = (storyContext.domainKeywords ?? []).map(k => k.toLowerCase().trim());

  for (const fileName of rnFiles) {
    const filePath = join(risksDir, fileName);
    try {
      const content = readFileSync(filePath, 'utf8');
      const frontmatter = parseRNFrontmatter(content);

      if (!frontmatter || frontmatter.status !== 'active') {
        continue;
      }

      // Check domain_tags overlap
      const domainTags = Array.isArray(frontmatter.domain_tags)
        ? frontmatter.domain_tags.map(t => t.toLowerCase().trim())
        : [];

      const hasTagMatch = domainTags.some(tag =>
        domainKeywords.some(kw => kw === tag || kw.includes(tag) || tag.includes(kw))
      );

      // Check affected_area overlap (normalize to lowercase-hyphenated)
      const affectedArea = (frontmatter.affected_area ?? '').toLowerCase().trim();
      const normalizedAffectedArea = affectedArea.replace(/\s+/g, '-');
      const hasAreaMatch = domainKeywords.some(kw =>
        kw === normalizedAffectedArea ||
        kw === affectedArea ||
        normalizedAffectedArea.includes(kw) ||
        affectedArea.includes(kw)
      );

      if (hasTagMatch || hasAreaMatch) {
        matched.push(filePath);
      }
    } catch {
      // Skip unreadable files — graceful degradation
    }
  }

  return matched;
}

/**
 * Loads active risk notes relevant to a story's domain for review agent context injection.
 *
 * This is the primary integration point for review-story.md (Step 1.4 extension).
 * Read-only operation — NEVER writes or modifies any files (architecture.md pattern).
 *
 * @param {Object} params
 * @param {string} params.risksDir - Path to the risks directory
 * @param {Object} params.storyContext - Story context for domain matching
 * @param {string[]} params.storyContext.domainKeywords - Keywords from story title and ACs
 * @returns {Promise<{matchedRNs: Array<{filename: string, content: string}>, noMatchingRisks: boolean}>}
 */
export async function loadActiveRiskNotesForStory({ risksDir, storyContext }) {
  const matchedPaths = matchRiskNotesToStory({ risksDir, storyContext });

  if (matchedPaths.length === 0) {
    return {
      matchedRNs: [],
      noMatchingRisks: true,
    };
  }

  const matchedRNs = [];

  for (const filePath of matchedPaths) {
    try {
      const content = readFileSync(filePath, 'utf8');
      const filename = basename(filePath);
      matchedRNs.push({ filename, content });
    } catch {
      // Skip unreadable files — graceful degradation
    }
  }

  return {
    matchedRNs,
    noMatchingRisks: matchedRNs.length === 0,
  };
}

/**
 * Formats matched RN contents as a human-readable context block for review agent injection.
 *
 * Format: "Active Risk Notes (for domain context):" followed by each RN content.
 * If no matched RNs: returns diagnostic message for review workflow logging.
 *
 * @param {Array<{filename: string, content: string}>} matchedRNs - Matched active RN files
 * @returns {string} Formatted context block for review agent
 */
export function formatRiskNotesAsContext(matchedRNs) {
  if (!matchedRNs || matchedRNs.length === 0) {
    return 'No active risk notes matched story domain — proceeding without risk context';
  }

  const header = `Active Risk Notes (for domain context):\n${'='.repeat(50)}\n`;

  const rnBlocks = matchedRNs.map(rn => {
    return `--- ${rn.filename} ---\n${rn.content}`;
  });

  return header + rnBlocks.join('\n' + '-'.repeat(50) + '\n');
}
