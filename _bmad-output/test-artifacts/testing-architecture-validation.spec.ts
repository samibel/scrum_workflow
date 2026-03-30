/**
 * ATDD Failing Tests for Story 7.7: Testing Architecture Analysis
 *
 * These tests are intentionally written to FAIL (TDD Red Phase)
 * They will pass only after Story 7.7 implementation is complete
 *
 * Run with: npm test -- testing-architecture-validation.spec.ts
 */

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

describe('Story 7.7: Testing Architecture Analysis', () => {

  const PROJECT_ROOT = '/Users/SBELAKH/Desktop/dev/mars/scrum_workflow';
  const TEMPLATE_PATH = join(PROJECT_ROOT, 'scrum_workflow/templates/testing-architecture.md');
  const WRONG_TEMPLATE_PATH = join(PROJECT_ROOT, 'templates/testing-architecture.md');
  const AGENT_PATH = join(PROJECT_ROOT, 'scrum_workflow/agents/architect-doc.md');
  const WORKFLOW_PATH = join(PROJECT_ROOT, 'scrum_workflow/workflows/architecture-documentation.md');

  // Helper function to check if file exists
  const fileExists = (path: string): boolean => existsSync(path);

  // Helper function to read file content
  const readFile = (path: string): string => {
    if (!fileExists(path)) return '';
    return readFileSync(path, 'utf-8');
  };

  describe('AC1: Template file exists at correct location', () => {
    test('1.1 Template exists at correct framework path', () => {
      expect(fileExists(TEMPLATE_PATH)).toBe(true);
    });

    test('1.2 Template does NOT exist at root templates path (Story 7-3 bug)', () => {
      expect(fileExists(WRONG_TEMPLATE_PATH)).toBe(false);
    });

    test('1.3 Template contains Overview section', () => {
      const content = readFile(TEMPLATE_PATH);
      expect(content).toContain('## Overview');
      expect(content.length).toBeGreaterThan(0);
    });

    test('1.4 Template contains Test Pyramid section with graph TD placeholder', () => {
      const content = readFile(TEMPLATE_PATH);
      expect(content).toContain('## Test Pyramid');
      expect(content).toMatch(/graph TD|```mermaid/);
    });

    test('1.5 Template contains Frameworks & Configuration section with table structure', () => {
      const content = readFile(TEMPLATE_PATH);
      expect(content).toContain('## Frameworks & Configuration');
      expect(content).toMatch(/\|.*Framework.*\|/);
    });

    test('1.6 Template contains Test Directory Structure section', () => {
      const content = readFile(TEMPLATE_PATH);
      expect(content).toContain('## Test Directory Structure');
    });

    test('1.7 Template contains Coverage Requirements section with table structure', () => {
      const content = readFile(TEMPLATE_PATH);
      expect(content).toContain('## Coverage Requirements');
      expect(content).toMatch(/\|.*Coverage.*\|/);
    });

    test('1.8 Template contains E2E Setup section with table structure', () => {
      const content = readFile(TEMPLATE_PATH);
      expect(content).toContain('## E2E Setup');
      expect(content).toMatch(/\|.*E2E.*\|/);
    });

    test('1.9 Template contains Test Utilities & Fixtures section with table structure', () => {
      const content = readFile(TEMPLATE_PATH);
      expect(content).toContain('## Test Utilities & Fixtures');
      expect(content).toMatch(/\|.*Utility.*\|/);
    });
  });

  describe('AC2: Grep patterns for testing components', () => {
    test('2.1 Architect-doc agent has test framework config patterns', () => {
      const agentContent = readFile(AGENT_PATH);
      const requiredPatterns = [
        'jest.config.*',
        'vitest.config.*',
        'pytest.ini',
        'pyproject.toml',
        'playwright.config.*',
        'cypress.config.*',
        '.mocharc.*'
      ];

      requiredPatterns.forEach(pattern => {
        expect(agentContent).toContain(pattern);
      });
    });

    test('2.2 Agent has test directory patterns', () => {
      const agentContent = readFile(AGENT_PATH);
      const requiredPatterns = [
        '__tests__',
        'test/',
        'spec/',
        'tests/',
        '*.test.*',
        '*.spec.*',
        'test_*'
      ];

      requiredPatterns.forEach(pattern => {
        expect(agentContent).toContain(pattern);
      });
    });

    test('2.3 Agent has coverage configuration patterns', () => {
      const agentContent = readFile(AGENT_PATH);
      const requiredPatterns = [
        'coverageThreshold',
        '--cov',
        'coverage/',
        '.nycrc',
        'istanbul'
      ];

      requiredPatterns.forEach(pattern => {
        expect(agentContent).toContain(pattern);
      });
    });

    test('2.4 Agent has E2E test setup patterns', () => {
      const agentContent = readFile(AGENT_PATH);
      const requiredPatterns = [
        'playwright',
        'cypress',
        'selenium',
        'puppeteer',
        'testcontainers'
      ];

      requiredPatterns.forEach(pattern => {
        expect(agentContent).toContain(pattern);
      });
    });

    test('2.5 Agent has test utility patterns', () => {
      const agentContent = readFile(AGENT_PATH);
      const requiredPatterns = [
        'fixtures/',
        'helpers/',
        'factories/',
        'mocks/',
        'stubs/',
        '__mocks__'
      ];

      requiredPatterns.forEach(pattern => {
        expect(agentContent).toContain(pattern);
      });
    });

    test('2.6 Agent has contract test patterns', () => {
      const agentContent = readFile(AGENT_PATH);
      const requiredPatterns = [
        'pact',
        'consumer',
        'provider',
        'contract'
      ];

      requiredPatterns.forEach(pattern => {
        expect(agentContent).toContain(pattern);
      });
    });
  });

  describe('AC3: Testing architecture analysis orchestration in workflow', () => {
    test('3.1 Workflow contains Step 4.5: Testing Architecture Analysis', () => {
      const workflowContent = readFile(WORKFLOW_PATH);
      expect(workflowContent).toContain('Step 4.5');
      expect(workflowContent).toContain('Testing Architecture');
    });

    test('3.2 Step instructs to invoke architect-doc agent with testing context', () => {
      const workflowContent = readFile(WORKFLOW_PATH);
      expect(workflowContent).toContain('architect-doc');
      expect(workflowContent).toContain('testing');
    });

    test('3.3 Step specifies output path: docs/generated/testing-architecture.md', () => {
      const workflowContent = readFile(WORKFLOW_PATH);
      expect(workflowContent).toContain('docs/generated/testing-architecture.md');
    });

    test('3.4 Step includes instruction to extract file:line references', () => {
      const workflowContent = readFile(WORKFLOW_PATH);
      expect(workflowContent).toMatch(/file:line|line.*reference/);
    });

    test('3.5 Step includes instruction to skip if no testing detected', () => {
      const workflowContent = readFile(WORKFLOW_PATH);
      expect(workflowContent).toMatch(/skip.*testing|no.*test.*detected/);
    });
  });

  describe('AC4: Test pyramid documentation with Mermaid', () => {
    test('4.1 Architect-doc agent Output Format specifies test pyramid visualization', () => {
      const agentContent = readFile(AGENT_PATH);
      expect(agentContent).toMatch(/test.*pyramid|pyramid.*graph/);
    });

    test('4.2 Agent uses graph TD Mermaid syntax for test pyramid', () => {
      const agentContent = readFile(AGENT_PATH);
      expect(agentContent).toContain('graph TD');
    });

    test('4.3 Template contains placeholder or example of test pyramid diagram', () => {
      const templateContent = readFile(TEMPLATE_PATH);
      expect(templateContent).toMatch(/graph TD|```mermaid|pyramid/);
    });

    test('4.4 Diagram shows three levels: unit, integration, E2E', () => {
      const templateContent = readFile(TEMPLATE_PATH);
      expect(templateContent).toMatch(/unit.*integration.*e2e|unit.*e2e.*integration/i);
    });
  });

  describe('AC5: Test frameworks documentation', () => {
    test('5.1 Template Frameworks & Configuration section has required table columns', () => {
      const templateContent = readFile(TEMPLATE_PATH);
      const requiredColumns = [
        'Framework',
        'Config File',
        'Test Directory Patterns',
        'Run Commands'
      ];

      requiredColumns.forEach(column => {
        expect(templateContent).toContain(column);
      });
    });

    test('5.2 Agent instructions specify framework name extraction', () => {
      const agentContent = readFile(AGENT_PATH);
      expect(agentContent).toMatch(/framework.*name|extract.*framework/);
    });

    test('5.3 Agent instructions specify config file location with file:line', () => {
      const agentContent = readFile(AGENT_PATH);
      expect(agentContent).toMatch(/config.*file.*location|file:line.*config/);
    });

    test('5.4 Agent instructions specify test directory pattern identification', () => {
      const agentContent = readFile(AGENT_PATH);
      expect(agentContent).toMatch(/test.*directory.*pattern|directory.*test/);
    });

    test('5.5 Agent instructions specify run command determination', () => {
      const agentContent = readFile(AGENT_PATH);
      expect(agentContent).toMatch(/run.*command|command.*run|test.*command/);
    });
  });

  describe('AC6: Coverage thresholds documentation', () => {
    test('6.1 Template Coverage Requirements section has required table columns', () => {
      const templateContent = readFile(TEMPLATE_PATH);
      const requiredColumns = [
        'Coverage Type',
        'Threshold',
        'Config Location'
      ];

      requiredColumns.forEach(column => {
        expect(templateContent).toContain(column);
      });
    });

    test('6.2 Agent instructions specify coverage threshold extraction', () => {
      const agentContent = readFile(AGENT_PATH);
      expect(agentContent).toMatch(/coverage.*threshold|extract.*coverage/);
    });

    test('6.3 Agent instructions specify handling missing coverage configuration', () => {
      const agentContent = readFile(AGENT_PATH);
      expect(agentContent).toMatch(/no.*coverage|missing.*coverage|coverage.*not.*configured/);
    });

    test('6.4 Agent instructions specify coverage types to document', () => {
      const agentContent = readFile(AGENT_PATH);
      const coverageTypes = ['statements', 'branches', 'functions', 'lines'];

      const hasCoverageType = coverageTypes.some(type =>
        agentContent.toLowerCase().includes(type.toLowerCase())
      );
      expect(hasCoverageType).toBe(true);
    });
  });

  describe('AC7: Source references', () => {
    test('7.1 Architect-doc agent Context Rules specify file:line reference requirement', () => {
      const agentContent = readFile(AGENT_PATH);
      expect(agentContent).toMatch(/file:line|line.*reference/);
    });

    test('7.2 Agent instructions specify line number extraction from Grep', () => {
      const agentContent = readFile(AGENT_PATH);
      expect(agentContent).toMatch(/grep.*line|extract.*line|line.*number/);
    });

    test('7.3 Template examples show file:line format in all tables', () => {
      const templateContent = readFile(TEMPLATE_PATH);
      expect(templateContent).toMatch(/file:line/);
    });

    test('7.4 Agent instructions handle edge cases (generated code, minified files)', () => {
      const agentContent = readFile(AGENT_PATH);
      expect(agentContent).toMatch(/generated|minified|edge.*case/);
    });
  });

  describe('AC8: No testing handling', () => {
    test('8.1 Workflow Step 4.5 includes skip condition check', () => {
      const workflowContent = readFile(WORKFLOW_PATH);
      expect(workflowContent).toMatch(/skip.*condition|if.*no.*test/);
    });

    test('8.2 Agent instructions specify how to detect absence of testing', () => {
      const agentContent = readFile(AGENT_PATH);
      expect(agentContent).toMatch(/no.*test.*detected|absence.*test.*config/);
    });

    test('8.3 Agent instructions specify what to note in scan state when skipped', () => {
      const agentContent = readFile(AGENT_PATH);
      expect(agentContent).toMatch(/scan.*state|skip.*note|documents_skipped/);
    });

    test('8.4 Scan state structure includes documents_skipped array', () => {
      const workflowContent = readFile(WORKFLOW_PATH);
      expect(workflowContent).toContain('documents_skipped');
    });
  });
});
