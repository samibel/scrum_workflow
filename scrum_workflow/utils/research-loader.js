/**
 * Research Loader Utility Module
 *
 * Story 7.5: Implement Research Memory Integration
 *
 * This module provides functions to discover, load, and match Research Reports
 * with story domain tags. Used by the refinement workflow to provide research
 * context to agents.
 */

import * as fs from 'fs';
import path from 'path';

/**
 * Discover all Research Report files (RR-*.md) in a directory
 *
 * @param {string} researchDir - Path to research directory
 * @returns {string[]} Array of absolute paths to discovered RR-*.md files
 */
export function discoverResearchReports(researchDir) {
  try {
    // Check if directory exists
    if (!fs.existsSync(researchDir)) {
      return [];
    }

    // Read directory contents
    const files = fs.readdirSync(researchDir);

    // Filter for RR-*.md files and return absolute paths
    return files
      .filter(file => /^RR-\d{3}\.md$/.test(file))
      .map(file => path.resolve(researchDir, file));
  } catch (error) {
    // Graceful fallback on any error
    console.error(`Error discovering research reports in ${researchDir}:`, error.message);
    return [];
  }
}

/**
 * Extract tags array from YAML frontmatter of a research report
 *
 * @param {string} filePath - Path to RR-*.md file
 * @returns {string[]} Array of tags from frontmatter, or empty array if not found
 */
export function extractResearchTags(filePath) {
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return [];
    }

    const content = fs.readFileSync(filePath, 'utf-8');

    // Extract YAML frontmatter (content between --- markers)
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) {
      return [];
    }

    const frontmatter = frontmatterMatch[1];

    // Extract tags array from frontmatter
    // Look for: tags: ["tag1", "tag2", ...] or tags: [tag1, tag2, ...]
    const tagsMatch = frontmatter.match(/tags:\s*\[(.*?)\]/);
    if (!tagsMatch) {
      return [];
    }

    const tagsString = tagsMatch[1];

    // Parse tags: handle quoted and unquoted formats
    const tags = tagsString
      .split(',')
      .map(tag => tag.trim())
      .map(tag => {
        // Remove quotes if present
        return tag.replace(/^["']|["']$/g, '');
      })
      .filter(tag => tag.length > 0);

    return tags;
  } catch (error) {
    // Graceful fallback on any error
    console.error(`Error extracting tags from ${filePath}:`, error.message);
    return [];
  }
}

/**
 * Match research reports by domain tags
 *
 * Performs intersection matching: report.tags ∩ story.domain_tags
 * Returns matches sorted by:
 * 1. Match count (descending)
 * 2. Date (newest first)
 *
 * @param {Object[]} reports - Array of report objects with path and tags
 * @param {string[]} storyTags - Story's domain_tags
 * @returns {Object[]} Matched reports with metadata
 */
export function matchReportsByTags(reports, storyTags) {
  // Handle edge cases
  if (!Array.isArray(reports) || reports.length === 0) {
    return [];
  }

  if (!Array.isArray(storyTags) || storyTags.length === 0) {
    return [];
  }

  // Normalize story tags to lowercase for case-insensitive comparison
  const normalizedStoryTags = storyTags.map(tag => tag.toLowerCase());

  // Filter and score reports based on tag intersection
  const matches = reports
    .map(report => {
      // Normalize report tags to lowercase
      const normalizedReportTags = Array.isArray(report.tags)
        ? report.tags.map(tag => tag.toLowerCase())
        : [];

      // Find intersection of tags
      const intersection = normalizedReportTags.filter(tag =>
        normalizedStoryTags.includes(tag)
      );

      // Only include reports with at least one matching tag
      if (intersection.length === 0) {
        return null;
      }

      return {
        ...report,
        matchCount: intersection.length
      };
    })
    .filter(report => report !== null);

  // Sort by match count (descending), then by date (newest first)
  return matches.sort((a, b) => {
    // First sort by match count (descending)
    if (b.matchCount !== a.matchCount) {
      return b.matchCount - a.matchCount;
    }

    // Then by date (newest first) if both have dates
    if (a.date && b.date) {
      return new Date(b.date) - new Date(a.date);
    }

    return 0;
  });
}

/**
 * Load matching research reports for a story
 *
 * Orchestrates: discovery → tag extraction → tag matching
 *
 * Can be called with either:
 * - loadMatchingReports(sprintDir, storyPath) where sprintDir contains story.md
 * - loadMatchingReports(parentDir, storyPath) where parentDir is parent of sprints/ and memory/
 *
 * @param {string} baseDir - Path to sprint directory or parent directory
 * @param {string} storyPath - Path to story.md file
 * @returns {Object[]} Matched research reports
 */
export function loadMatchingReports(baseDir, storyPath) {
  try {
    // Determine research directory
    // Try to infer from story path and base directory structure
    let researchDir;

    if (fs.existsSync(path.join(baseDir, 'memory', 'research'))) {
      // baseDir is the root (parent of memory/ and sprints/)
      researchDir = path.join(baseDir, 'memory', 'research');
    } else if (fs.existsSync(path.join(baseDir, '..', '..', 'memory', 'research'))) {
      // baseDir is a sprint directory (e.g., sprints/SW-001)
      researchDir = path.join(baseDir, '..', '..', 'memory', 'research');
    } else {
      // Try canonical location
      researchDir = path.join(process.cwd(), '_scrum-output', 'memory', 'research');
    }

    // Step 1: Discover all research reports
    const reportPaths = discoverResearchReports(researchDir);

    if (reportPaths.length === 0) {
      return [];
    }

    // Step 2: Extract story domain tags
    if (!fs.existsSync(storyPath)) {
      return [];
    }

    const storyContent = fs.readFileSync(storyPath, 'utf-8');
    const storyDomainTags = extractStoryDomainTags(storyContent);

    if (storyDomainTags.length === 0) {
      return [];
    }

    // Step 3: Load report metadata and extract tags
    const reports = reportPaths
      .map(reportPath => {
        try {
          const tags = extractResearchTags(reportPath);
          const metadata = extractReportMetadata(reportPath);

          return {
            path: reportPath,
            filename: path.basename(reportPath),
            tags,
            ...metadata
          };
        } catch (error) {
          console.error(`Error loading report ${reportPath}:`, error.message);
          return null;
        }
      })
      .filter(report => report !== null);

    // Step 4: Match reports by tags
    const matched = matchReportsByTags(reports, storyDomainTags);

    return matched;
  } catch (error) {
    console.error(`Error loading matching reports for ${storyPath}:`, error.message);
    return [];
  }
}

/**
 * Format research reports as markdown context for agent consumption
 *
 * @param {Object[]} research - Array of research report objects
 * @returns {string} Formatted markdown context
 */
export function formatResearchContext(research) {
  if (!Array.isArray(research) || research.length === 0) {
    return '';
  }

  let context = '## Research Context\n\n';
  context += `${research.length} research report(s) loaded based on domain tags:\n\n`;

  research.forEach((report, index) => {
    context += `### ${index + 1}. ${report.topic || report.filename}\n`;
    context += `- **File**: ${report.filename}\n`;

    if (report.tags && report.tags.length > 0) {
      context += `- **Tags**: ${report.tags.join(', ')}\n`;
    }

    if (report.date) {
      context += `- **Date**: ${report.date}\n`;
    }

    if (report['referenced-by'] && report['referenced-by'].length > 0) {
      context += `- **Referenced by**: ${report['referenced-by'].join(', ')}\n`;
    }

    context += '\n';
  });

  return context;
}

/**
 * Extract domain_tags from story YAML frontmatter
 *
 * @param {string} storyContent - Raw story file content
 * @returns {string[]} Array of domain tags
 */
function extractStoryDomainTags(storyContent) {
  try {
    const frontmatterMatch = storyContent.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) {
      return [];
    }

    const frontmatter = frontmatterMatch[1];

    // Look for: domain_tags: ["tag1", "tag2", ...] or domain_tags: [tag1, tag2, ...]
    const tagsMatch = frontmatter.match(/domain_tags:\s*\[(.*?)\]/);
    if (!tagsMatch) {
      return [];
    }

    const tagsString = tagsMatch[1];

    // Parse tags: handle quoted and unquoted formats
    const tags = tagsString
      .split(',')
      .map(tag => tag.trim())
      .map(tag => {
        // Remove quotes if present
        return tag.replace(/^["']|["']$/g, '');
      })
      .filter(tag => tag.length > 0);

    return tags;
  } catch (error) {
    console.error('Error extracting story domain tags:', error.message);
    return [];
  }
}

/**
 * Extract metadata from research report YAML frontmatter
 *
 * @param {string} filePath - Path to research report file
 * @returns {Object} Metadata object with topic, date, referenced-by, etc.
 */
function extractReportMetadata(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

    if (!frontmatterMatch) {
      return {};
    }

    const frontmatter = frontmatterMatch[1];
    const metadata = {};

    // Extract topic
    const topicMatch = frontmatter.match(/topic:\s*["']?([^"\'\n]+)["']?/);
    if (topicMatch) {
      metadata.topic = topicMatch[1];
    }

    // Extract date
    const dateMatch = frontmatter.match(/date:\s*["']?([^"\'\n]+)["']?/);
    if (dateMatch) {
      metadata.date = dateMatch[1];
    }

    // Extract referenced-by
    const referencedMatch = frontmatter.match(/referenced-by:\s*\[(.*?)\]/);
    if (referencedMatch) {
      const referencedString = referencedMatch[1];
      metadata['referenced-by'] = referencedString
        .split(',')
        .map(ref => ref.trim())
        .map(ref => ref.replace(/^["']|["']$/g, ''))
        .filter(ref => ref.length > 0);
    }

    return metadata;
  } catch (error) {
    console.error(`Error extracting metadata from ${filePath}:`, error.message);
    return {};
  }
}
