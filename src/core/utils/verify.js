import { readFileSync, writeFileSync, existsSync, mkdirSync, renameSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';
import yaml from 'js-yaml';
import { appendStatusHistory } from './status_history.js';

/**
 * Story 8.1: Implement Post-Implementation Verification
 *
 * This module provides utility functions for the /scrum-verify command,
 * running automated checks and generating reports.
 */

/**
 * Executes a shell command and captures its output and exit code
 * @param {string} command - The command to execute
 * @returns {Object} { success: boolean, output: string, exitCode: number }
 */
export function executeCheck(command, timeoutMs = 300000) {
  try {
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe', timeout: timeoutMs });
    return {
      success: true,
      output: output || '',
      exitCode: 0
    };
  } catch (error) {
    return {
      success: false,
      output: error.stdout + error.stderr || error.message,
      exitCode: error.status || 1,
      timedOut: error.killed && error.code === 'ETIMEDOUT'
    };
  }
}

/**
 * Parses Vitest output for test counts and coverage
 * @param {string} output - The test output string
 * @returns {Object} { total: number, passed: number, failed: number, coverage: string }
 */
export function parseTestOutput(output) {
  const result = {
    total: 0,
    passed: 0,
    failed: 0,
    coverage: 'N/A',
    parseWarning: null
  };

  // Basic regex for Vitest output: "Tests  X passed | Y failed | Z total"
  const testsMatch = output.match(/Tests\s+(\d+)\s+passed\s+\|\s+(\d+)\s+failed\s+\|\s+(\d+)\s+total/);
  if (testsMatch) {
    result.passed = parseInt(testsMatch[1], 10);
    result.failed = parseInt(testsMatch[2], 10);
    result.total = parseInt(testsMatch[3], 10);
  } else if (output.trim().length > 0) {
    // Output exists but doesn't match expected format - warn but don't fail silently
    result.parseWarning = 'Test output format unrecognized; counts may be inaccurate';
  }

  // Coverage regex (depends on reporter, but common pattern)
  const coverageMatch = output.match(/All files\s+\|\s+([\d\.]+)/);
  if (coverageMatch) {
    result.coverage = `${coverageMatch[1]}%`;
  }

  return result;
}

/**
 * Generates the verification report from results
 * @param {Object} reportData - Report metadata and results
 * @returns {string} Path to the created report file
 */
export function createVerificationReport(reportData) {
  const {
    ticketId,
    storyTitle,
    outputDir,
    results,
    templatePath
  } = reportData;

  const timestamp = new Date().toISOString();
  const overallVerdict = results.test.success && 
                        (results.lint.skipped || results.lint.success) && 
                        (results.build.skipped || results.build.success) ? 'PASS' : 'FAIL';
  const verificationStatus = overallVerdict === 'PASS' ? 'passed' : 'failed';
  const tools = [
    {
      name: 'test',
      command: 'npm test',
      exit_code: results.test.exitCode ?? (results.test.success ? 0 : 1),
      summary: results.test.success ? 'Tests passed' : 'Tests failed'
    },
    {
      name: 'lint',
      command: 'npm run lint',
      exit_code: results.lint.skipped ? 0 : (results.lint.exitCode ?? (results.lint.success ? 0 : 1)),
      summary: results.lint.skipped ? 'Skipped: lint script not configured' : (results.lint.success ? 'Lint passed' : 'Lint failed')
    },
    {
      name: 'build',
      command: 'npm run build',
      exit_code: results.build.skipped ? 0 : (results.build.exitCode ?? (results.build.success ? 0 : 1)),
      summary: results.build.skipped ? 'Skipped: build script not configured' : (results.build.success ? 'Build passed' : 'Build failed')
    }
  ];
  const toolsYaml = yaml.dump(tools, { lineWidth: -1 })
    .trimEnd()
    .split('\n')
    .map((line) => `  ${line}`)
    .join('\n');

  let template = '';
  if (existsSync(templatePath)) {
    template = readFileSync(templatePath, 'utf8');
  } else {
    // Fallback template
    template = `---
schema_version: 1
ticket: {{ticket_id}}
title: "{{story_title}}"
status: {{verification_status}}
verified_at: {{verified_at}}
verification_date: {{verification_date}}
verdict: {{verdict}}
tools:
{{tools_yaml}}
---

# Verification Report: {{story_title}}

Verdict: {{verdict}}`;
  }

  const testStats = parseTestOutput(results.test.output);

  let actionableGuidance = '';
  if (overallVerdict === 'PASS') {
    actionableGuidance = '✅ All automated checks passed. The story has been moved to `review` status.';
  } else {
    actionableGuidance = '❌ One or more checks failed. Please review the detailed output below and fix the issues before re-running verification.';
    if (!results.test.success) actionableGuidance += '\n- **Tests failed**: Check test output for failing assertions.';
    if (!results.lint.skipped && !results.lint.success) actionableGuidance += '\n- **Lint failed**: Check lint output for style violations.';
    if (!results.build.skipped && !results.build.success) actionableGuidance += '\n- **Build failed**: Check build output for compilation errors.';
  }

  const replacements = {
    '{{ticket_id}}': ticketId,
    '{{story_title}}': storyTitle,
    '{{verification_date}}': timestamp,
    '{{verified_at}}': timestamp,
    '{{verification_status}}': verificationStatus,
    '{{verdict}}': overallVerdict,
    '{{tools_yaml}}': toolsYaml,
    '{{test_result}}': results.test.success ? 'PASS' : 'FAIL',
    '{{lint_result}}': results.lint.skipped ? 'SKIPPED' : (results.lint.success ? 'PASS' : 'FAIL'),
    '{{build_result}}': results.build.skipped ? 'SKIPPED' : (results.build.success ? 'PASS' : 'FAIL'),
    '{{test_total}}': testStats.total,
    '{{test_passed}}': testStats.passed,
    '{{test_failed}}': testStats.failed,
    '{{test_coverage}}': testStats.coverage,
    '{{actionable_guidance}}': actionableGuidance,
    '{{test_output}}': results.test.output,
    '{{lint_output}}': results.lint.output || 'N/A',
    '{{build_output}}': results.build.output || 'N/A'
  };

  let reportContent = template;
  // Escape any template-like syntax in replacement values to prevent nested replacement
  const escapedReplacements = {};
  for (const [key, value] of Object.entries(replacements)) {
    const strValue = String(value);
    // Replace any existing template markers to prevent nested substitution
    escapedReplacements[key] = strValue.replace(/\{\{/g, '&#123;&#123;').replace(/\}\}/g, '&#125;&#125;');
  }
  for (const [key, value] of Object.entries(escapedReplacements)) {
    reportContent = reportContent.split(key).join(value);
  }

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const reportFile = join(outputDir, 'verification-report.md');
  // Atomic write: write to temp file then rename (atomic on same filesystem)
  const tempFile = reportFile + '.tmp.' + Date.now();
  writeFileSync(tempFile, reportContent, 'utf8');
  renameSync(tempFile, reportFile);

  return { reportFile, overallVerdict };
}

/**
 * Validates whether an in-progress story may transition to review.
 * The transition is only allowed after a verification-report.md exists and
 * its frontmatter records a passed verification status.
 *
 * @param {Object} story - Story object with parsed frontmatter
 * @param {string} storyDir - Directory containing the story artifacts
 * @returns {Object} { allowed: boolean, reason?: string }
 */
export function validateReviewTransitionGuard(story, storyDir) {
  const status = story?.frontmatter?.status;
  if (status !== 'in-progress') {
    return {
      allowed: false,
      reason: `Review transition requires story status 'in-progress', got '${status}'`
    };
  }

  const reportPath = join(storyDir, 'verification-report.md');
  if (!existsSync(reportPath)) {
    return {
      allowed: false,
      reason: 'verification-report.md not found; run /scrum-verify before moving to review'
    };
  }

  const reportContent = readFileSync(reportPath, 'utf8');
  const frontmatterMatch = reportContent.match(/^---\n([\s\S]+?)\n---/);
  if (!frontmatterMatch) {
    return {
      allowed: false,
      reason: 'verification-report.md is missing YAML frontmatter with passed status'
    };
  }

  let frontmatter;
  try {
    frontmatter = yaml.load(frontmatterMatch[1]);
  } catch (err) {
    return {
      allowed: false,
      reason: `verification-report.md YAML parsing failed: ${err.message}`
    };
  }

  if (frontmatter?.status !== 'passed') {
    return {
      allowed: false,
      reason: `verification-report.md status is '${frontmatter?.status}', not passed`
    };
  }

  return { allowed: true };
}

/**
 * Executes the /scrum-verify command
 * @param {string} ticketId - Ticket ID
 * @param {Object} options - Options
 */
export function executeScrumVerify(ticketId, options) {
  const {
    projectRoot = process.cwd(),
    packageJsonPath = join(projectRoot, 'package.json'),
    templatePath = join(projectRoot, 'scrum_workflow/templates/verification-report.md')
  } = options;

  // Validate ticketId format to prevent path traversal
  if (!/^SW-\d{3}$/.test(ticketId)) {
    return { success: false, error: `Invalid ticket ID format '${ticketId}'. Expected SW-XXX.` };
  }

  const outputDir = join(projectRoot, '_scrum-output', 'sprints', ticketId);
  const storyPath = join(outputDir, 'story.md');

  if (!existsSync(storyPath)) {
    return { success: false, error: `Story file '${storyPath}' not found` };
  }

  let storyContent;
  try {
    storyContent = readFileSync(storyPath, 'utf8');
  } catch (err) {
    if (err.code === 'ENOENT') {
      return { success: false, error: `Story file '${storyPath}' not found` };
    }
    return { success: false, error: `Failed to read story file: ${err.message}` };
  }

  const frontmatterMatch = storyContent.match(/^---\n([\s\S]+?)\n---/);
  if (!frontmatterMatch) return { success: false, error: 'Invalid story frontmatter' };

  let frontmatter;
  try {
    frontmatter = yaml.load(frontmatterMatch[1]);
  } catch (err) {
    return { success: false, error: `YAML Parsing Error: ${err.message}` };
  }

  if (frontmatter.status !== 'in-progress') {
    return { success: false, error: `Status Guard Violation: Expected 'in-progress', got '${frontmatter.status}'` };
  }

  if (!existsSync(packageJsonPath)) {
    return { success: false, error: `package.json not found at '${packageJsonPath}'` };
  }

  let pkg;
  try {
    pkg = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  } catch (err) {
    return { success: false, error: `Failed to parse package.json: ${err.message}` };
  }
  const results = {
    test: executeCheck('npm test'),
    lint: pkg.scripts?.lint ? executeCheck('npm run lint') : { skipped: true, output: '' },
    build: pkg.scripts?.build ? executeCheck('npm run build') : { skipped: true, output: '' }
  };

  const { reportFile, overallVerdict } = createVerificationReport({
    ticketId,
    storyTitle: frontmatter.title,
    outputDir,
    results,
    templatePath
  });

  let message = '';
  if (overallVerdict === 'PASS') {
    // Re-read story file to get latest state (avoid TOCTOU)
    let latestStoryContent;
    try {
      latestStoryContent = readFileSync(storyPath, 'utf8');
    } catch (err) {
      return { success: false, error: `Failed to re-read story file for update: ${err.message}` };
    }

    const latestFrontmatterMatch = latestStoryContent.match(/^---\n([\s\S]+?)\n---/);
    if (!latestFrontmatterMatch) return { success: false, error: 'Invalid story frontmatter on re-read' };

    let latestFrontmatter;
    try {
      latestFrontmatter = yaml.load(latestFrontmatterMatch[1]);
    } catch (err) {
      return { success: false, error: `YAML Parsing Error on re-read: ${err.message}` };
    }

    // Verify status hasn't changed since initial read
    if (latestFrontmatter.status !== 'in-progress') {
      return { success: false, error: `Status changed during verification from 'in-progress' to '${latestFrontmatter.status}'` };
    }

    const story = { frontmatter: latestFrontmatter, content: latestStoryContent };
    const reviewGuard = validateReviewTransitionGuard(story, outputDir);
    if (!reviewGuard.allowed) {
      return { success: false, error: `Status Guard Violation: ${reviewGuard.reason}` };
    }

    const updatedStory = appendStatusHistory(story, '/scrum-verify', 'review', {
      actor: 'verification-skill',
      artifact: 'verification-report.md'
    });

    const fmString = `---\n${yaml.dump(updatedStory.frontmatter)}---`;
    const newStoryContent = latestStoryContent.replace(/^---\n[\s\S]+?\n---/, fmString);

    // Atomic write: temp file then rename
    const tempStoryFile = storyPath + '.tmp.' + Date.now();
    writeFileSync(tempStoryFile, newStoryContent, 'utf8');
    renameSync(tempStoryFile, storyPath);

    message = `✅ Verification PASSED for ${ticketId}. Story moved to 'review'.\nReport: ${reportFile}`;
  } else {
    message = `❌ Verification FAILED for ${ticketId}. Story remains 'in-progress'.\nReport: ${reportFile}`;
  }

  return {
    success: true,
    overallVerdict,
    reportFile,
    message
  };
}
