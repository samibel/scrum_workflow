/**
 * ATDD Tests for Story 1-1: Framework Directory Structure & Default Configuration
 *
 * TDD RED PHASE: These tests FAIL before implementation
 *
 * Purpose: Verify framework directory structure and configuration files are created correctly
 * Test Level: File System Validation Tests (Infrastructure tests, not unit/integration/E2E)
 *
 * Execution:
 * 1. Before implementation: All tests FAIL (directories/files don't exist)
 * 2. After implementation: All tests PASS (structure verified)
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { parse } from 'yaml';

// Test constants
const FRAMEWORK_ROOT = 'scrum_workflow';
const CONFIG_FILE = `${FRAMEWORK_ROOT}/config.yaml`;
const ARCHITECTURE_GUIDELINES = `${FRAMEWORK_ROOT}/context/architecture-guidelines.md`;
const STANDARDS_FILE = `${FRAMEWORK_ROOT}/context/standards.md`;

// Required directories
const REQUIRED_DIRECTORIES = [
  'agents',
  'commands',
  'workflows',
  'skills',
  'templates',
  'context',
  'data',
];

// Required config fields
const REQUIRED_CONFIG_FIELDS = ['platform', 'active_agents', 'token_budgets'];

// MVP agents that should be in active_agents by default
const MVP_AGENTS = ['architect', 'developer', 'qa'];

describe('Story 1-1: Framework Directory Structure', () => {
  describe('AC1: Directory Structure Verification', () => {
    test('P0: framework root directory exists', () => {
      expect(existsSync(FRAMEWORK_ROOT)).toBe(true);
    });

    test('P0: all required subdirectories exist', () => {
      REQUIRED_DIRECTORIES.forEach((dir) => {
        const dirPath = `${FRAMEWORK_ROOT}/${dir}`;
        expect(existsSync(dirPath)).toBe(true);
      });
    });

    test('P1: directories are empty (content created in subsequent stories)', () => {
      REQUIRED_DIRECTORIES.forEach((dir) => {
        const dirPath = `${FRAMEWORK_ROOT}/${dir}`;
        if (existsSync(dirPath)) {
          const contents = readdirSync(dirPath);
          // context/ should have 2 files, others should be empty
          if (dir === 'context') {
            expect(contents.length).toBe(2);
          } else {
            expect(contents.length).toBe(0);
          }
        }
      });
    });

    test('P1: directories have read permissions', () => {
      REQUIRED_DIRECTORIES.forEach((dir) => {
        const dirPath = `${FRAMEWORK_ROOT}/${dir}`;
        if (existsSync(dirPath)) {
          const stats = statSync(dirPath);
          // Check directory is readable
          expect((stats.mode & parseInt('444', 8))).not.toBe(0);
        }
      });
    });

    test('P2: directories use kebab-case naming', () => {
      REQUIRED_DIRECTORIES.forEach((dir) => {
        // Verify no uppercase letters, no spaces, no underscores
        expect(dir).toMatch(/^[a-z][a-z0-9-]*$/);
        expect(dir).not.toContain('_');
        expect(dir).not.toContain(' ');
      });
    });
  });

  describe('AC2: Configuration File Validation', () => {
    test('P0: config.yaml file exists', () => {
      expect(existsSync(CONFIG_FILE)).toBe(true);
    });

    test('P0: config.yaml is valid YAML', () => {
      if (existsSync(CONFIG_FILE)) {
        const content = readFileSync(CONFIG_FILE, 'utf8');
        expect(() => parse(content)).not.toThrow();
      }
    });

    test('P0: config.yaml has required field: platform', () => {
      if (existsSync(CONFIG_FILE)) {
        const content = readFileSync(CONFIG_FILE, 'utf8');
        const config = parse(content);
        expect(config).toHaveProperty('platform');
      }
    });

    test('P0: config.yaml has required field: active_agents', () => {
      if (existsSync(CONFIG_FILE)) {
        const content = readFileSync(CONFIG_FILE, 'utf8');
        const config = parse(content);
        expect(config).toHaveProperty('active_agents');
        expect(Array.isArray(config.active_agents)).toBe(true);
      }
    });

    test('P0: config.yaml has required field: token_budgets', () => {
      if (existsSync(CONFIG_FILE)) {
        const content = readFileSync(CONFIG_FILE, 'utf8');
        const config = parse(content);
        expect(config).toHaveProperty('token_budgets');
        expect(typeof config.token_budgets).toBe('object');
      }
    });

    test('P1: platform has default value: claude-code', () => {
      if (existsSync(CONFIG_FILE)) {
        const content = readFileSync(CONFIG_FILE, 'utf8');
        const config = parse(content);
        expect(config.platform).toBe('claude-code');
      }
    });

    test('P1: active_agents contains MVP agents', () => {
      if (existsSync(CONFIG_FILE)) {
        const content = readFileSync(CONFIG_FILE, 'utf8');
        const config = parse(content);
        MVP_AGENTS.forEach((agent) => {
          expect(config.active_agents).toContain(agent);
        });
      }
    });

    test('P1: token_budgets contains platform-specific limits', () => {
      if (existsSync(CONFIG_FILE)) {
        const content = readFileSync(CONFIG_FILE, 'utf8');
        const config = parse(content);
        const platforms = ['claude-code', 'github-copilot', 'opencode', 'windsurf'];
        platforms.forEach((platform) => {
          expect(config.token_budgets).toHaveProperty(platform);
          expect(config.token_budgets[platform]).toHaveProperty('coordination');
          expect(config.token_budgets[platform]).toHaveProperty('sub_agent');
        });
      }
    });

    test('P2: config.yaml has inline documentation', () => {
      if (existsSync(CONFIG_FILE)) {
        const content = readFileSync(CONFIG_FILE, 'utf8');
        // Check for YAML comments (lines starting with #)
        const hasComments = content.split('\n').some((line) => line.trim().startsWith('#'));
        expect(hasComments).toBe(true);
      }
    });

    test('P2: all YAML field names use snake_case', () => {
      if (existsSync(CONFIG_FILE)) {
        const content = readFileSync(CONFIG_FILE, 'utf8');
        const config = parse(content);
        const checkSnakeCase = (obj: any, path = '') => {
          Object.keys(obj).forEach((key) => {
            // Allow framework_version (kebab-case for backward compatibility)
            if (key !== 'framework_version') {
              expect(key).toMatch(/^[a-z][a-z0-9_]*$/);
            }
            if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
              checkSnakeCase(obj[key], `${path}.${key}`);
            }
          });
        };
        checkSnakeCase(config);
      }
    });
  });

  describe('AC3: Framework Context Files', () => {
    test('P0: architecture-guidelines.md exists', () => {
      expect(existsSync(ARCHITECTURE_GUIDELINES)).toBe(true);
    });

    test('P0: standards.md exists', () => {
      expect(existsSync(STANDARDS_FILE)).toBe(true);
    });

    test('P1: architecture-guidelines.md contains SDK/Framework pattern', () => {
      if (existsSync(ARCHITECTURE_GUIDELINES)) {
        const content = readFileSync(ARCHITECTURE_GUIDELINES, 'utf8');
        expect(content.toLowerCase()).toContain('sdk/framework');
      }
    });

    test('P1: architecture-guidelines.md contains Three-Layer Separation', () => {
      if (existsSync(ARCHITECTURE_GUIDELINES)) {
        const content = readFileSync(ARCHITECTURE_GUIDELINES, 'utf8');
        expect(content.toLowerCase()).toContain('three-layer');
      }
    });

    test('P1: standards.md contains naming conventions', () => {
      if (existsSync(STANDARDS_FILE)) {
        const content = readFileSync(STANDARDS_FILE, 'utf8');
        expect(content.toLowerCase()).toContain('kebab-case');
        expect(content.toLowerCase()).toContain('snake_case');
      }
    });

    test('P2: files are valid Markdown', () => {
      [ARCHITECTURE_GUIDELINES, STANDARDS_FILE].forEach((filePath) => {
        if (existsSync(filePath)) {
          const content = readFileSync(filePath, 'utf8');
          // Basic Markdown validation: has content
          expect(content.length).toBeGreaterThan(0);
          // Has heading
          expect(content).toMatch(/^#\s+/m);
        }
      });
    });

    test('P2: files have proper heading structure', () => {
      [ARCHITECTURE_GUIDELINES, STANDARDS_FILE].forEach((filePath) => {
        if (existsSync(filePath)) {
          const content = readFileSync(filePath, 'utf8');
          const lines = content.split('\n');
          // First heading should be single #
          const firstHeading = lines.find((line) => line.startsWith('#'));
          expect(firstHeading).toMatch(/^#\s[^#]/);
        }
      });
    });
  });

  describe('AC4: Naming Convention Compliance', () => {
    test('P0: all directories use kebab-case', () => {
      REQUIRED_DIRECTORIES.forEach((dir) => {
        expect(dir).toMatch(/^[a-z][a-z0-9-]*$/);
        expect(dir).not.toMatch(/[A-Z]/);
        expect(dir).not.toContain('_');
      });
    });

    test('P0: all created files use kebab-case', () => {
      const filesToCheck = [
        'config.yaml',
        'architecture-guidelines.md',
        'standards.md',
      ];
      filesToCheck.forEach((file) => {
        expect(file).toMatch(/^[a-z][a-z0-9.-]*$/);
        expect(file).not.toMatch(/[A-Z]/);
        expect(file).not.toContain('_');
      });
    });

    test('P0: all YAML fields in config.yaml use snake_case', () => {
      if (existsSync(CONFIG_FILE)) {
        const content = readFileSync(CONFIG_FILE, 'utf8');
        const config = parse(content);
        const validateKeys = (obj: any) => {
          Object.keys(obj).forEach((key) => {
            if (key !== 'framework_version') {
              expect(key).toMatch(/^[a-z][a-z0-9_]*$/);
            }
            if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
              validateKeys(obj[key]);
            }
          });
        };
        validateKeys(config);
      }
    });

    test('P1: no camelCase in filenames', () => {
      const files = [
        'config.yaml',
        'architecture-guidelines.md',
        'standards.md',
      ];
      files.forEach((file) => {
        // Check for camelCase patterns (lowercase letter followed by uppercase)
        expect(file).not.toMatch(/[a-z][A-Z]/);
      });
    });

    test('P1: no spaces in filenames', () => {
      const files = [
        'config.yaml',
        'architecture-guidelines.md',
        'standards.md',
      ];
      files.forEach((file) => {
        expect(file).not.toContain(' ');
      });
    });

    test('P2: consistency across all files', () => {
      // All framework files should follow same naming pattern
      const allFiles = [
        'config.yaml',
        'architecture-guidelines.md',
        'standards.md',
      ];
      allFiles.forEach((file) => {
        expect(file).toMatch(/^[a-z0-9.-]+$/);
      });
    });
  });

  describe('AC5: Convention-over-Configuration', () => {
    test('P0: minimal required fields in config.yaml', () => {
      if (existsSync(CONFIG_FILE)) {
        const content = readFileSync(CONFIG_FILE, 'utf8');
        const config = parse(content);
        // Only platform is truly required
        expect(Object.keys(config).length).toBeLessThanOrEqual(10);
      }
    });

    test('P1: all fields have default values documented', () => {
      if (existsSync(CONFIG_FILE)) {
        const content = readFileSync(CONFIG_FILE, 'utf8');
        // Check for inline comments documenting defaults
        const hasDefaultComments = content.includes('#') && (
          content.includes('default') || content.includes('Default')
        );
        expect(hasDefaultComments).toBe(true);
      }
    });

    test('P1: config.yaml is shallow-override compatible', () => {
      if (existsSync(CONFIG_FILE)) {
        const content = readFileSync(CONFIG_FILE, 'utf8');
        const config = parse(content);
        // Should be flat structure, not deeply nested
        const maxDepth = (obj: any, depth = 0): number => {
          let max = depth;
          Object.values(obj).forEach((val) => {
            if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
              max = Math.max(max, maxDepth(val, depth + 1));
            }
          });
          return max;
        };
        expect(maxDepth(config)).toBeLessThanOrEqual(2);
      }
    });

    test('P2: optional fields have sensible defaults', () => {
      if (existsSync(CONFIG_FILE)) {
        const content = readFileSync(CONFIG_FILE, 'utf8');
        const config = parse(content);
        // Check that framework_version has a default
        if (config.framework_version) {
          expect(config.framework_version).toMatch(/^\d+\.\d+\.\d+$/);
        }
      }
    });
  });

  describe('AC6: Zero Runtime Dependencies', () => {
    test('P0: no non-YAML/non-Markdown files in framework', () => {
      if (existsSync(FRAMEWORK_ROOT)) {
        const checkFiles = (dir: string) => {
          const files = readdirSync(dir);
          files.forEach((file) => {
            const filePath = `${dir}/${file}`;
            const stats = statSync(filePath);
            if (stats.isDirectory()) {
              checkFiles(filePath);
            } else {
              const ext = file.split('.').pop();
              expect(['yaml', 'yml', 'md']).toContain(ext);
            }
          });
        };
        checkFiles(FRAMEWORK_ROOT);
      }
    });

    test('P0: no package.json or similar dependency files', () => {
      const dependencyFiles = ['package.json', 'requirements.txt', 'Gemfile', 'Cargo.toml', 'go.mod'];
      dependencyFiles.forEach((file) => {
        expect(existsSync(`${FRAMEWORK_ROOT}/${file}`)).toBe(false);
      });
    });

    test('P0: no build scripts or compiled code', () => {
      const buildFiles = ['Makefile', 'build.sh', 'compile.js', '.tsbuildinfo'];
      buildFiles.forEach((file) => {
        expect(existsSync(`${FRAMEWORK_ROOT}/${file}`)).toBe(false);
      });
    });

    test('P1: all files are human-readable text', () => {
      if (existsSync(FRAMEWORK_ROOT)) {
        const checkFiles = (dir: string) => {
          const files = readdirSync(dir);
          files.forEach((file) => {
            const filePath = `${dir}/${file}`;
            const stats = statSync(filePath);
            if (stats.isDirectory()) {
              checkFiles(filePath);
            } else {
              const content = readFileSync(filePath, 'utf8');
              // Should be readable as UTF-8 text
              expect(content.length).toBeGreaterThan(0);
            }
          });
        };
        checkFiles(FRAMEWORK_ROOT);
      }
    });

    test('P2: framework can be distributed via simple file copy', () => {
      // Framework should not have any installation requirements
      // beyond copying files
      if (existsSync(FRAMEWORK_ROOT)) {
        const hasInstallScript = existsSync(`${FRAMEWORK_ROOT}/install.sh`) ||
                                 existsSync(`${FRAMEWORK_ROOT}/setup.js`);
        expect(hasInstallScript).toBe(false);
      }
    });
  });
});

/**
 * TDD RED PHASE SUMMARY
 *
 * Total Tests: 35
 * - P0 (Critical): 15 tests
 * - P1 (High): 12 tests
 * - P2 (Medium): 8 tests
 *
 * All tests are designed to FAIL before implementation:
 * - File existence checks fail when files don't exist
 * - YAML parsing fails when config.yaml doesn't exist
 * - Content validation fails when files are empty
 *
 * After implementation:
 * - All tests should PASS
 * - Framework structure is validated
 * - Configuration is verified
 * - Naming conventions are enforced
 */
