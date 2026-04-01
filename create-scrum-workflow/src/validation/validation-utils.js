/**
 * Story 8-4: Platform Registry Validation for New Skills
 *
 * Validation utilities for platform configuration and skill verification.
 * This module provides functions to parse platform registry, validate skill
 * installations, and generate validation reports.
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { load } from 'js-yaml';

/**
 * Parse platform-registry.yaml and return structured data
 * @param {string} registryPath - Path to platform-registry.yaml
 * @returns {Object} Parsed platform registry
 */
export function parsePlatformRegistry(registryPath) {
  try {
    const registryContent = readFileSync(registryPath, 'utf-8');
    const registry = load(registryContent);

    if (!registry || !registry.platforms) {
      throw new Error('Invalid platform registry format');
    }

    return registry.platforms;
  } catch (error) {
    throw new Error(`Failed to parse platform registry: ${error.message}`);
  }
}

/**
 * Extract target directories for all platforms
 * @param {Object} registry - Parsed platform registry
 * @returns {Object} Map of platform codes to target directories
 */
export function extractTargetDirs(registry) {
  const targetDirs = {};

  for (const [platformCode, platformConfig] of Object.entries(registry)) {
    if (platformConfig.target_dir) {
      targetDirs[platformCode] = platformConfig.target_dir;
    }
  }

  return targetDirs;
}

/**
 * Verify skill format consistency across all platforms
 * @param {Object} registry - Parsed platform registry
 * @returns {boolean} True if all platforms use the same skill format
 */
export function verifySkillFormatConsistency(registry) {
  const formats = new Set();

  for (const platformConfig of Object.values(registry)) {
    if (platformConfig.skill_format) {
      formats.add(platformConfig.skill_format);
    }
  }

  // All platforms should use the same format
  return formats.size === 1;
}

/**
 * Parse fallback_scan configuration for platforms
 * @param {Object} registry - Parsed platform registry
 * @returns {Object} Map of platform codes to fallback scan directories
 */
export function parseFallbackScanConfig(registry) {
  const fallbackConfigs = {};

  for (const [platformCode, platformConfig] of Object.entries(registry)) {
    if (platformConfig.fallback_scan && Array.isArray(platformConfig.fallback_scan)) {
      fallbackConfigs[platformCode] = platformConfig.fallback_scan;
    }
  }

  return fallbackConfigs;
}

/**
 * Identify platforms with fallback scan capability
 * @param {Object} registry - Parsed platform registry
 * @returns {string[]} Array of platform codes with fallback scan
 */
export function identifyPlatformsFallbackScan(registry) {
  const platformsWithFallback = [];

  for (const [platformCode, platformConfig] of Object.entries(registry)) {
    if (platformConfig.fallback_scan && Array.isArray(platformConfig.fallback_scan)) {
      platformsWithFallback.push(platformCode);
    }
  }

  return platformsWithFallback;
}

/**
 * Validate that all expected skills are present
 * @param {string[]} expectedSkills - List of expected skill names
 * @param {string[]} foundSkills - List of found skill names
 * @returns {Object} Validation result with missing skills
 */
export function validateSkillList(expectedSkills, foundSkills) {
  const missing = expectedSkills.filter(skill => !foundSkills.includes(skill));

  return {
    allPresent: missing.length === 0,
    expectedCount: expectedSkills.length,
    foundCount: foundSkills.length,
    missing
  };
}

/**
 * Detect missing skills from expected list
 * @param {string[]} expectedSkills - List of expected skill names
 * @param {string[]} foundSkills - List of found skill names
 * @returns {string[]} Array of missing skill names
 */
export function detectMissingSkills(expectedSkills, foundSkills) {
  return expectedSkills.filter(skill => !foundSkills.includes(skill));
}

/**
 * Verify fallback directories exist in target directories
 * @param {Object} fallbackConfig - Fallback configuration by platform
 * @param {string[]} installedDirs - List of installed directories
 * @returns {Object} Verification result with nested structure by platform and directory
 */
export function verifyFallbackDirectoriesExist(fallbackConfig, installedDirs) {
  const result = {};

  for (const [platformCode, fallbackDirs] of Object.entries(fallbackConfig)) {
    result[platformCode] = {};

    for (const fallbackDir of fallbackDirs) {
      result[platformCode][fallbackDir] = installedDirs.includes(fallbackDir);
    }
  }

  return result;
}

/**
 * Validate skill file content (YAML frontmatter and framework path)
 * @param {string} skillContent - Content of the skill file
 * @returns {Object} Validation result
 */
export function validateSkillContent(skillContent) {
  const result = {
    hasYamlFrontmatter: false,
    hasName: false,
    hasDescription: false,
    hasFrameworkPath: false,
    errors: []
  };

  // Check for YAML frontmatter
  const frontmatterMatch = skillContent.match(/^---\s*\n([\s\S]*?)\n---/);
  if (frontmatterMatch) {
    result.hasYamlFrontmatter = true;

    // Check for required fields
    if (skillContent.match(/name:\s*\w+/)) {
      result.hasName = true;
    }
    if (skillContent.match(/description:/)) {
      result.hasDescription = true;
    }
    if (skillContent.match(/framework_path:/)) {
      result.hasFrameworkPath = true;
    }
  } else {
    result.errors.push('Missing YAML frontmatter');
  }

  if (!result.hasName) {
    result.errors.push('Missing required field: name');
  }
  if (!result.hasDescription) {
    result.errors.push('Missing required field: description');
  }
  if (!result.hasFrameworkPath) {
    result.errors.push('Missing required field: framework_path');
  }

  result.valid = result.errors.length === 0;
  return result;
}

/**
 * Format timestamp for validation report
 * @param {string} timestamp - ISO timestamp
 * @returns {string} Formatted timestamp line
 */
export function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const formattedDate = date.toISOString().split('T')[0];
  return `- Date: ${formattedDate}`;
}

/**
 * Calculate pass/fail statistics from validation results
 * @param {Object} results - Validation results by platform
 * @returns {Object} Statistics object
 */
export function calculateStatistics(results) {
  const total = Object.keys(results).length;
  let passed = 0;
  let failed = 0;

  for (const status of Object.values(results)) {
    if (status === 'PASS') {
      passed++;
    } else if (status === 'FAIL') {
      failed++;
    }
  }

  const passRate = total > 0 ? (passed / total) * 100 : 0;

  return {
    total,
    passed,
    failed,
    passRate: Math.round(passRate * 100) / 100
  };
}

/**
 * Format platform details for validation report
 * @param {Object} platformData - Platform validation data
 * @returns {string} Formatted platform details section
 */
export function formatPlatformDetails(platformData) {
  const lines = [];

  const headerSuffix = platformData.discoveryMethod === 'fallback' && platformData.fallbackScan
    ? ` (via ${platformData.fallbackScan[0]}/ fallback)`
    : '';

  lines.push(`### ${platformData.displayName || platformData.platform} (${platformData.targetDir})${headerSuffix}`);
  lines.push(`- Status: ${platformData.status}`);
  lines.push(`- target_dir: ${platformData.targetDir}`);

  if (platformData.fallbackScan && platformData.fallbackScan.length > 0) {
    lines.push(`- fallback_scan: ${platformData.fallbackScan.join(', ')}`);
  }

  lines.push(`- Skills Discovered: ${platformData.skillsFound}/${platformData.totalSkills || '?'}`);

  if (platformData.notes) {
    lines.push(`- Notes: ${platformData.notes}`);
  }

  if (platformData.missingSkills && platformData.missingSkills.length > 0) {
    lines.push(`- Missing Skills: ${platformData.missingSkills.join(', ')}`);
  }

  return lines.join('\n');
}

/**
 * Format results section for validation report
 * @param {Object} results - Validation results by platform
 * @returns {string} Formatted results section
 */
export function formatResultsSection(results) {
  const lines = [];

  for (const [platformCode, platformData] of Object.entries(results)) {
    lines.push(formatPlatformDetails({
      platform: platformCode,
      displayName: platformData.displayName || platformCode,
      targetDir: platformData.targetDir,
      status: platformData.status,
      skillsFound: platformData.skillsFound,
      totalSkills: platformData.totalSkills,
      discoveryMethod: platformData.discoveryMethod,
      fallbackScan: platformData.fallbackScan,
      notes: platformData.notes,
      missingSkills: platformData.missingSkills
    }));

    lines.push(''); // Empty line between platforms
  }

  return lines.join('\n');
}

/**
 * Generate complete validation report
 * @param {Object} validationData - Complete validation data
 * @returns {string} Formatted validation report
 */
export function generateValidationReport(validationData) {
  const lines = [];

  lines.push('# Platform Validation Report');
  lines.push('');
  lines.push('## Summary');
  lines.push(formatTimestamp(validationData.timestamp));

  const platforms = Object.keys(validationData.platforms);
  lines.push(`- Platforms Tested: ${platforms.length}`);
  lines.push(`- Skills Tested: ${validationData.skillsTested || '?'}`);

  // Calculate statistics
  const results = {};
  for (const [platformCode, platformData] of Object.entries(validationData.platforms)) {
    results[platformCode] = platformData.status;
  }
  const stats = calculateStatistics(results);

  lines.push(`- Passed: ${stats.passed}/${stats.total}`);
  lines.push(`- Failed: ${stats.failed}/${stats.total}`);
  lines.push(`- Pass Rate: ${stats.passRate}%`);
  lines.push('');

  lines.push('## Results by Platform');
  lines.push('');
  lines.push(formatResultsSection(validationData.platforms));

  return lines.join('\n');
}

/**
 * Verify platform skill installations
 * @param {string} projectRoot - Root directory of the project
 * @param {Object} registry - Parsed platform registry
 * @param {string[]} expectedSkills - List of expected skill names
 * @returns {Object} Validation results by platform
 */
export function verifyPlatformSkillInstallations(projectRoot, registry, expectedSkills) {
  const results = {};

  for (const [platformCode, platformConfig] of Object.entries(registry)) {
    const targetDir = `${projectRoot}/${platformConfig.target_dir}`;
    const platformResult = {
      platform: platformCode,
      displayName: platformConfig.display_name,
      targetDir: platformConfig.target_dir,
      status: 'FAIL',
      skillsFound: 0,
      totalSkills: expectedSkills.length,
      fallbackScan: platformConfig.fallback_scan || null,
      missingSkills: []
    };

    // Check if target directory exists
    if (!existsSync(targetDir)) {
      platformResult.notes = `Target directory does not exist: ${targetDir}`;
      results[platformCode] = platformResult;
      continue;
    }

    // Check for skills in target directory
    try {
      const foundSkills = readdirSync(targetDir).filter(
        item => expectedSkills.includes(item)
      );

      platformResult.skillsFound = foundSkills.length;
      platformResult.missingSkills = detectMissingSkills(expectedSkills, foundSkills);

      // Determine status
      if (platformResult.skillsFound === expectedSkills.length) {
        platformResult.status = 'PASS';
        platformResult.discoveryMethod = 'primary';
        platformResult.notes = 'All skills discovered in primary directory';
      } else if (platformResult.skillsFound > 0) {
        platformResult.status = 'PARTIAL';
        platformResult.notes = `${platformResult.skillsFound}/${expectedSkills.length} skills found`;
      } else {
        platformResult.notes = 'No skills found in primary directory';
      }
    } catch (error) {
      platformResult.notes = `Error reading directory: ${error.message}`;
    }

    // Check fallback directories if configured
    if (platformConfig.fallback_scan && platformResult.status !== 'PASS') {
      for (const fallbackDir of platformConfig.fallback_scan) {
        const fallbackPath = `${projectRoot}/${fallbackDir}`;

        if (existsSync(fallbackPath)) {
          try {
            const fallbackSkills = readdirSync(fallbackPath).filter(
              item => expectedSkills.includes(item)
            );

            if (fallbackSkills.length > 0) {
              platformResult.skillsFound = fallbackSkills.length;
              platformResult.missingSkills = detectMissingSkills(expectedSkills, fallbackSkills);

              if (platformResult.skillsFound === expectedSkills.length) {
                platformResult.status = 'PASS';
                platformResult.discoveryMethod = 'fallback';
                platformResult.notes = `All skills discovered via ${fallbackDir} fallback`;
                break;
              }
            }
          } catch (error) {
            // Ignore fallback errors
          }
        }
      }
    }

    results[platformCode] = platformResult;
  }

  return results;
}
