import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { Installer } from '../../src/core/installer.js';
import { install } from '../../src/commands/install.js';
import { readFileSync, readdirSync, statSync, existsSync, rmSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import fse from 'fs-extra';
import { execSync } from 'node:child_process';

// Mock fs modules
vi.mock('node:fs');
vi.mock('fs-extra');
vi.mock('@clack/prompts', () => ({
  log: {
    success: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  },
  outro: vi.fn(),
  spinner: vi.fn(() => ({
    start: vi.fn(),
    stop: vi.fn()
  })),
  confirm: vi.fn(),
  isCancel: vi.fn(),
  cancel: vi.fn()
}));

/**
 * Story 1.6: Verify & Align Installation & Onboarding
 *
 * ATDD RED PHASE: All tests use test.skip() and will FAIL until implementation meets PRD specs.
 *
 * Acceptance Criteria:
 * - AC1: Delta analysis documents matches, divergences, and missing features vs PRD
 * - AC2: FR-41 compliance - installation completes in under 5 minutes
 * - AC2: FR-41 compliance - CLI auto-detects AI platform
 * - AC2: FR-41 compliance - all framework files copied correctly
 * - AC3: FR-42 compliance - success message includes actionable next-step command
 * - AC3: FR-42 compliance - developer can run /scrum-create-ticket without documentation
 * - SC-9: First ticket possible within 30 minutes of installation
 * - SC-10: Zero-knowledge onboarding works end-to-end
 */

describe('Story 1.6: Installation & Onboarding ATDD Tests', () => {
  const mockTargetDir = '/mock/target';
  const mockConfig = {
    platforms: ['claude-code'],
    frameworkPath: 'scrum_workflow',
    directory: mockTargetDir,
    yes: true
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * AC2: FR-41 - Installation Timing (under 5 minutes)
   *
   * Given FR-41 specifies installation via npx in under 5 minutes
   * When a developer runs `npx cli@latest` in a fresh project
   * Then installation completes successfully in under 5 minutes
   */
  describe('AC2: FR-41 Installation Timing', () => {
    test.skip('[P0] should complete installation in under 5 minutes', async () => {
      // ATDD RED PHASE - Test will fail until timing validation is implemented
      const startTime = Date.now();

      // Mock installer setup
      const installer = new Installer(mockConfig);
      vi.spyOn(installer, 'copyFramework').mockImplementation(() => {});
      vi.spyOn(installer, 'registerSkills').mockReturnValue({ skillCount: 10, platformCount: 1 });
      vi.spyOn(installer, 'createOutputDirs').mockImplementation(() => {});
      vi.spyOn(installer, 'generateLockFile').mockImplementation(() => {});
      vi.spyOn(installer, 'verifyInstallation').mockImplementation(() => {});

      await installer.run();

      const endTime = Date.now();
      const durationMs = endTime - startTime;
      const fiveMinutesMs = 5 * 60 * 1000;

      // FR-41: Installation must complete in under 5 minutes
      expect(durationMs).toBeLessThan(fiveMinutesMs);
    });

    test.skip('[P1] should track installation timing metrics', async () => {
      // ATDD RED PHASE - Test will fail until timing metrics are tracked
      const installer = new Installer(mockConfig);

      vi.spyOn(installer, 'copyFramework').mockImplementation(() => {});
      vi.spyOn(installer, 'registerSkills').mockReturnValue({ skillCount: 10, platformCount: 1 });
      vi.spyOn(installer, 'createOutputDirs').mockImplementation(() => {});
      vi.spyOn(installer, 'generateLockFile').mockImplementation(() => {});
      vi.spyOn(installer, 'verifyInstallation').mockImplementation(() => {});

      await installer.run();

      // Installation should expose timing metrics
      expect(installer.timingMetrics).toBeDefined();
      expect(installer.timingMetrics.totalDurationMs).toBeLessThan(5 * 60 * 1000);
      expect(installer.timingMetrics.copyFrameworkMs).toBeDefined();
      expect(installer.timingMetrics.registerSkillsMs).toBeDefined();
    });
  });

  /**
   * AC2: FR-41 - Platform Auto-Detection
   *
   * Given FR-41 specifies CLI auto-detects AI platform
   * When installation runs
   * Then the platform is automatically detected without user input
   */
  describe('AC2: FR-41 Platform Auto-Detection', () => {
    test.skip('[P0] should auto-detect Claude Code platform', async () => {
      // ATDD RED PHASE - Test will fail until auto-detection is verified
      // Mock Claude Code environment detection
      process.env.CLAUDE_CODE = 'true';

      const { buildConfig } = await import('../../src/core/config-builder.js');
      const config = await buildConfig({});

      // Should auto-detect Claude Code without explicit flag
      expect(config.platforms).toContain('claude-code');

      delete process.env.CLAUDE_CODE;
    });

    test.skip('[P1] should auto-detect Cursor platform', async () => {
      // ATDD RED PHASE - Test will fail until Cursor detection is implemented
      // Mock Cursor environment detection
      process.env.CURSOR_TRACE_ID = 'test-trace';

      const { buildConfig } = await import('../../src/core/config-builder.js');
      const config = await buildConfig({});

      // Should auto-detect Cursor without explicit flag
      expect(config.platforms).toContain('cursor');

      delete process.env.CURSOR_TRACE_ID;
    });

    test.skip('[P1] should auto-detect Windsurf platform', async () => {
      // ATDD RED PHASE - Test will fail until Windsurf detection is implemented
      // Mock Windsurf environment detection
      process.env.WINDSURF_SESSION = 'test-session';

      const { buildConfig } = await import('../../src/core/config-builder.js');
      const config = await buildConfig({});

      // Should auto-detect Windsurf without explicit flag
      expect(config.platforms).toContain('windsurf');

      delete process.env.WINDSURF_SESSION;
    });

    test.skip('[P2] should provide clear feedback when platform detected', async () => {
      // ATDD RED PHASE - Test will fail until detection feedback is implemented
      const mockLog = vi.fn();
      vi.mocked(console).log = mockLog;

      process.env.CLAUDE_CODE = 'true';

      const { buildConfig } = await import('../../src/core/config-builder.js');
      await buildConfig({});

      // Should provide clear detection feedback
      expect(mockLog).toHaveBeenCalledWith(
        expect.stringContaining('Detected platform')
      );

      delete process.env.CLAUDE_CODE;
    });

    test.skip('[P2] should handle unknown platform gracefully', async () => {
      // ATDD RED PHASE - Test will fail until fallback behavior is verified
      // Clear all platform indicators
      delete process.env.CLAUDE_CODE;
      delete process.env.CURSOR_TRACE_ID;
      delete process.env.WINDSURF_SESSION;

      const { buildConfig } = await import('../../src/core/config-builder.js');
      const config = await buildConfig({});

      // Should default to claude-code when no platform detected
      expect(config.platforms).toContain('claude-code');
    });
  });

  /**
   * AC2: FR-41 - Framework File Installation
   *
   * Given FR-41 specifies all framework files are copied to correct locations
   * When installation completes
   * Then all framework directories are created correctly
   * And all framework files are copied to correct locations
   */
  describe('AC2: FR-41 Framework File Installation', () => {
    test.skip('[P0] should copy all framework directories to target', async () => {
      // ATDD RED PHASE - Test will fail until directory verification is implemented
      const expectedDirs = [
        'scrum_workflow/agents',
        'scrum_workflow/commands',
        'scrum_workflow/context',
        'scrum_workflow/docs',
        'scrum_workflow/skills',
        'scrum_workflow/templates',
        'scrum_workflow/workflows'
      ];

      readdirSync.mockReturnValue(['scrum_workflow']);
      statSync.mockImplementation((path) => ({
        isDirectory: () => path.includes('scrum_workflow') && !path.includes('.md')
      }));
      fse.copySync.mockImplementation(() => {});

      const installer = new Installer(mockConfig);
      await installer.run();

      // Verify all expected directories were created
      expectedDirs.forEach(dir => {
        expect(fse.ensureDirSync).toHaveBeenCalledWith(
          expect.stringContaining(dir)
        );
      });
    });

    test.skip('[P0] should copy all required framework files', async () => {
      // ATDD RED PHASE - Test will fail until file verification is implemented
      const requiredFiles = [
        'scrum_workflow/config.yaml',
        'scrum_workflow/agents/architect.md',
        'scrum_workflow/agents/developer.md',
        'scrum_workflow/agents/qa.md',
        'scrum_workflow/commands/create-project-context.md',
        'scrum_workflow/commands/create-ticket.md',
        'scrum_workflow/commands/refine-ticket.md'
      ];

      existsSync.mockReturnValue(true);
      fse.copySync.mockImplementation(() => {});

      const installer = new Installer(mockConfig);
      await installer.run();

      // Verify all required files were copied
      const copyCalls = fse.copySync.mock.calls;
      requiredFiles.forEach(file => {
        const wasCopied = copyCalls.some(call =>
          call[0].includes(file) || call[1].includes(file)
        );
        expect(wasCopied).toBe(true);
      });
    });

    test.skip('[P1] should verify file permissions are correct', async () => {
      // ATDD RED PHASE - Test will fail until permission verification is implemented
      fse.copySync.mockImplementation(() => {});

      const installer = new Installer(mockConfig);
      await installer.run();

      // Files should be readable and writable (not executable for md files)
      expect(installer.verificationResults).toBeDefined();
      expect(installer.verificationResults.permissionsCorrect).toBe(true);
    });

    test.skip('[P2] should handle existing files gracefully', async () => {
      // ATDD RED PHASE - Test will fail until conflict handling is verified
      existsSync.mockReturnValue(true); // Simulate existing files

      const installer = new Installer(mockConfig);
      await installer.run();

      // Should not throw errors when files exist
      expect(installer.verificationResults).toBeDefined();
      expect(installer.verificationResults.conflictErrors).toEqual([]);
    });
  });

  /**
   * AC3: FR-42 - Success Message with Actionable Next-Step Command
   *
   * Given FR-42 specifies success message includes actionable next-step command
   * When installation is complete
   * Then the success message includes an actionable next-step command
   * And the next-step command is copy-pasteable
   */
  describe('AC3: FR-42 Success Message & Next-Step Guidance', () => {
    test.skip('[P0] should include actionable next-step command in success message', async () => {
      // ATDD RED PHASE - Test will fail until success message includes guidance
      const mockOutro = vi.fn();
      vi.doMock('@clack/prompts', () => ({
        outro: mockOutro,
        log: { success: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
        spinner: vi.fn(() => ({ start: vi.fn(), stop: vi.fn() }))
      }));

      const installer = new Installer(mockConfig);
      vi.spyOn(installer, 'copyFramework').mockImplementation(() => {});
      vi.spyOn(installer, 'registerSkills').mockReturnValue({ skillCount: 10, platformCount: 1 });
      vi.spyOn(installer, 'createOutputDirs').mockImplementation(() => {});
      vi.spyOn(installer, 'generateLockFile').mockImplementation(() => {});
      vi.spyOn(installer, 'verifyInstallation').mockImplementation(() => {});

      await installer.run();

      // FR-42: Success message must include actionable next-step command
      expect(mockOutro).toHaveBeenCalledWith(
        expect.stringMatching(/\/scrum-create-ticket|try.*create.*ticket/i)
      );
    });

    test.skip('[P0] should provide copy-pasteable next-step command', async () => {
      // ATDD RED PHASE - Test will fail until copy-pasteable command is provided
      const mockLogInfo = vi.fn();

      const installer = new Installer(mockConfig);
      vi.spyOn(installer, 'copyFramework').mockImplementation(() => {});
      vi.spyOn(installer, 'registerSkills').mockReturnValue({ skillCount: 10, platformCount: 1 });
      vi.spyOn(installer, 'createOutputDirs').mockImplementation(() => {});
      vi.spyOn(installer, 'generateLockFile').mockImplementation(() => {});
      vi.spyOn(installer, 'verifyInstallation').mockImplementation(() => {});

      await installer.run();
      installer.printSummary();

      // Should include exact command user can copy-paste
      const summaryCall = mockLogInfo.mock.calls.find(call =>
        call[0].includes('/scrum-create-ticket')
      );
      expect(summaryCall).toBeDefined();
      // Command should be on its own line for easy copying
      expect(summaryCall[0]).toMatch(/.*\/scrum-create-ticket.*/);
    });

    test.skip('[P1] should follow UX-DR2 one-line success with command hint', async () => {
      // ATDD RED PHASE - Test will fail until UX-DR2 compliance is verified
      const mockOutro = vi.fn();

      const installer = new Installer(mockConfig);
      vi.spyOn(installer, 'copyFramework').mockImplementation(() => {});
      vi.spyOn(installer, 'registerSkills').mockReturnValue({ skillCount: 10, platformCount: 1 });
      vi.spyOn(installer, 'createOutputDirs').mockImplementation(() => {});
      vi.spyOn(installer, 'generateLockFile').mockImplementation(() => {});
      vi.spyOn(installer, 'verifyInstallation').mockImplementation(() => {});

      await installer.run();

      // UX-DR2: One-line success message with first command hint
      const outroCall = mockOutro.mock.calls[0][0];
      expect(outroCall.length).toBeLessThan(200); // Concise
      expect(outroCall).toMatch(/complete|success/i);
      expect(outroCall).toMatch(/scrum-create-ticket|try/i);
    });

    test.skip('[P1] should suggest next-step command works immediately', async () => {
      // ATDD RED PHASE - Test will fail until command guidance is verified
      const installer = new Installer(mockConfig);
      vi.spyOn(installer, 'copyFramework').mockImplementation(() => {});
      vi.spyOn(installer, 'registerSkills').mockReturnValue({ skillCount: 10, platformCount: 1 });
      vi.spyOn(installer, 'createOutputDirs').mockImplementation(() => {});
      vi.spyOn(installer, 'generateLockFile').mockImplementation(() => {});
      vi.spyOn(installer, 'verifyInstallation').mockImplementation(() => {});

      await installer.run();

      // Verify suggested command matches an installed skill
      const suggestedCommand = installer.suggestedNextCommand;
      expect(suggestedCommand).toMatch(/\/scrum-create-ticket/);
    });
  });

  /**
   * SC-9 & SC-10: Zero-Knowledge Onboarding
   *
   * Given SC-9 specifies first ticket within 30 minutes
   * And SC-10 specifies zero-knowledge onboarding works end-to-end
   * When installation is complete
   * Then developer can run /scrum-create-ticket and /scrum-refine-ticket without reading documentation
   */
  describe('SC-9 & SC-10: Zero-Knowledge Onboarding', () => {
    test.skip('[P0] should enable first ticket creation without documentation', async () => {
      // ATDD RED PHASE - Test will fail until zero-knowledge flow is verified
      const installer = new Installer(mockConfig);
      vi.spyOn(installer, 'copyFramework').mockImplementation(() => {});
      vi.spyOn(installer, 'registerSkills').mockReturnValue({ skillCount: 10, platformCount: 1 });
      vi.spyOn(installer, 'createOutputDirs').mockImplementation(() => {});
      vi.spyOn(installer, 'generateLockFile').mockImplementation(() => {});
      vi.spyOn(installer, 'verifyInstallation').mockImplementation(() => {});

      await installer.run();

      // Verify scrum-create-ticket skill is installed
      expect(installer.skillResult.installedSkills).toContain('scrum-create-ticket');

      // Verify skill file exists with correct command reference
      const skillPath = join(mockTargetDir, '.claude/skills/scrum-create-ticket/SKILL.md');
      expect(existsSync(skillPath)).toBe(true);
    });

    test.skip('[P0] should enable first ticket refinement without documentation', async () => {
      // ATDD RED PHASE - Test will fail until zero-knowledge flow is verified
      const installer = new Installer(mockConfig);
      vi.spyOn(installer, 'copyFramework').mockImplementation(() => {});
      vi.spyOn(installer, 'registerSkills').mockReturnValue({ skillCount: 10, platformCount: 1 });
      vi.spyOn(installer, 'createOutputDirs').mockImplementation(() => {});
      vi.spyOn(installer, 'generateLockFile').mockImplementation(() => {});
      vi.spyOn(installer, 'verifyInstallation').mockImplementation(() => {});

      await installer.run();

      // Verify scrum-refine-ticket skill is installed
      expect(installer.skillResult.installedSkills).toContain('scrum-refine-ticket');
    });

    test.skip('[P1] should provide guidance that eliminates need for documentation', async () => {
      // ATDD RED PHASE - Test will fail until documentation-free guidance is verified
      const mockLogInfo = vi.fn();

      const installer = new Installer(mockConfig);
      vi.spyOn(installer, 'copyFramework').mockImplementation(() => {});
      vi.spyOn(installer, 'registerSkills').mockReturnValue({ skillCount: 10, platformCount: 1 });
      vi.spyOn(installer, 'createOutputDirs').mockImplementation(() => {});
      vi.spyOn(installer, 'generateLockFile').mockImplementation(() => {});
      vi.spyOn(installer, 'verifyInstallation').mockImplementation(() => {});

      await installer.run();
      installer.printSummary();

      // Success message should provide enough guidance to start without docs
      const allMessages = mockLogInfo.mock.calls.map(c => c[0]).join(' ');
      expect(allMessages).toMatch(/scrum-create-ticket/);
      expect(allMessages).not.toMatch(/documentation|docs|readme/i);
    });

    test.skip('[P2] should measure time-to-first-value capability', async () => {
      // ATDD RED PHASE - Test will fail until SC-9 measurement is implemented
      const installer = new Installer(mockConfig);
      vi.spyOn(installer, 'copyFramework').mockImplementation(() => {});
      vi.spyOn(installer, 'registerSkills').mockReturnValue({ skillCount: 10, platformCount: 1 });
      vi.spyOn(installer, 'createOutputDirs').mockImplementation(() => {});
      vi.spyOn(installer, 'generateLockFile').mockImplementation(() => {});
      vi.spyOn(installer, 'verifyInstallation').mockImplementation(() => {});

      await installer.run();

      // SC-9: Should track capability for 30-minute time-to-first-value
      expect(installer.onboardingMetrics).toBeDefined();
      expect(installer.onboardingMetrics.canCreateFirstTicketWithin30Min).toBe(true);
    });
  });

  /**
   * Error Handling - Actionable Error Messages
   *
   * When installation fails
   * Then error messages provide actionable guidance, not documentation references
   */
  describe('Error Handling - Actionable Guidance', () => {
    test.skip('[P1] should provide actionable error for permission issues', async () => {
      // ATDD RED PHASE - Test will fail until actionable errors are implemented
      fse.copySync.mockImplementation(() => {
        throw new Error('EACCES: permission denied');
      });

      const mockLogError = vi.fn();
      const mockLogWarn = vi.fn();

      const installer = new Installer(mockConfig);

      try {
        await installer.run();
      } catch (e) {
        // Error should provide actionable guidance
        expect(mockLogError).toHaveBeenCalledWith(
          expect.stringMatching(/permission|chmod|sudo/i)
        );
        // Should NOT reference documentation
        expect(mockLogError).not.toHaveBeenCalledWith(
          expect.stringMatching(/documentation|docs|readme/i)
        );
      }
    });

    test.skip('[P1] should provide actionable error for disk space issues', async () => {
      // ATDD RED PHASE - Test will fail until actionable errors are implemented
      fse.copySync.mockImplementation(() => {
        throw new Error('ENOSPC: no space left on device');
      });

      const mockLogError = vi.fn();

      const installer = new Installer(mockConfig);

      try {
        await installer.run();
      } catch (e) {
        // Error should provide actionable guidance
        expect(mockLogError).toHaveBeenCalledWith(
          expect.stringMatching(/space|disk|free/i)
        );
      }
    });

    test.skip('[P2] should provide recovery steps for common failures', async () => {
      // ATDD RED PHASE - Test will fail until recovery guidance is implemented
      fse.copySync.mockImplementation(() => {
        throw new Error('Installation failed');
      });

      const mockLogWarn = vi.fn();

      const installer = new Installer(mockConfig);

      try {
        await installer.run();
      } catch (e) {
        // Should provide numbered recovery steps
        const warnCalls = mockLogWarn.mock.calls.map(c => c[0]).join(' ');
        expect(warnCalls).toMatch(/1\.|2\./); // Numbered steps
        expect(warnCalls).toMatch(/retry|clean|status/i); // Actionable verbs
      }
    });
  });

  /**
   * Integration: Full Installation Flow
   *
   * Complete flow verification for FR-41 and FR-42
   */
  describe('Integration: Full Installation Flow', () => {
    test.skip('[P0] should complete full installation flow successfully', async () => {
      // ATDD RED PHASE - Test will fail until full flow is verified
      readdirSync.mockReturnValue(['scrum_workflow', '.claude']);
      statSync.mockReturnValue({ isDirectory: () => true });
      existsSync.mockReturnValue(true);
      fse.copySync.mockImplementation(() => {});
      fse.ensureDirSync.mockImplementation(() => {});

      const installer = new Installer(mockConfig);
      await installer.run();

      // Verify all pipeline steps completed
      expect(installer.pipelineResults).toEqual({
        checkExisting: 'completed',
        copyFramework: 'completed',
        registerSkills: 'completed',
        createOutputDirs: 'completed',
        generateLockFile: 'completed',
        verifyInstallation: 'completed',
        printSummary: 'completed'
      });
    });

    test.skip('[P0] should pass post-install verification', async () => {
      // ATDD RED PHASE - Test will fail until verification is implemented
      readdirSync.mockReturnValue(['scrum-create-ticket', 'scrum-refine-ticket']);
      statSync.mockReturnValue({ isDirectory: () => true });
      existsSync.mockReturnValue(true);
      readFileSync.mockReturnValue('name: scrum_workflow/commands/test\ndescription: Test');
      fse.copySync.mockImplementation(() => {});
      fse.ensureDirSync.mockImplementation(() => {});

      const installer = new Installer(mockConfig);
      await installer.run();

      // Post-install verification should pass
      expect(installer.verificationResults).toBeDefined();
      expect(installer.verificationResults.configExists).toBe(true);
      expect(installer.verificationResults.noUnresolvedPlaceholders).toBe(true);
    });
  });
});
