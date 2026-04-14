# Platform Validation Procedure

## Overview

This document describes the validation procedure for verifying that the create-scrum-workflow installer correctly creates skill shims for all supported platforms and all skills.

## Purpose

The platform validation ensures that:
1. All 6 platforms in the registry receive skill installations
2. All 6 skills (4 original + 2 new from Epic 6/7) are installed correctly
3. Fallback scan behavior works as expected for platforms that support it
4. Platform-specific quirks and limitations are documented

## Validation Approaches

### Option 1: Automated Validation Tests (Recommended)

Run the automated validation test suite:

```bash
cd create-scrum-workflow
npm test
```

The test suite validates:
- Platform registry parsing
- Target directory verification
- Skill format consistency
- Fallback scan behavior
- Validation report generation

**Test Files:**
- `test/integration/platform-validation.test.js` - Integration tests for platform validation
- `test/unit/platform-config.test.js` - Unit tests for platform configuration parsing
- `test/unit/validation-report.test.js` - Unit tests for validation report generation

### Option 2: Manual Validation Procedure

Follow these steps to manually validate platform installations:

#### Prerequisites

1. **Install create-scrum-workflow:**
   ```bash
   cd create-scrum-workflow
   npm install
   npm link
   ```

2. **Create a test project:**
   ```bash
   mkdir /tmp/test-scrum-project
   cd /tmp/test-scrum-project
   ```

#### Step-by-Step Validation

**Step 1: Install for All Platforms**

```bash
create-scrum-workflow install -d /tmp/test-scrum-project -p claude-code cursor windsurf github-copilot cline agents-universal -y
```

**Step 2: Verify Skill Directories Exist**

For each platform, verify the skill directory exists:

```bash
# Claude Code
ls -la /tmp/test-scrum-project/.claude/skills/

# Cursor
ls -la /tmp/test-scrum-project/.cursor/skills/

# Windsurf
ls -la /tmp/test-scrum-project/.windsurf/skills/

# GitHub Copilot
ls -la /tmp/test-scrum-project/.github/skills/

# Cline
ls -la /tmp/test-scrum-project/.cline/skills/

# Universal
ls -la /tmp/test-scrum-project/.agents/skills/
```

**Expected Result:** Each directory should contain 6 skill subdirectories:
- scrum-create-project-context
- scrum-create-ticket
- scrum-refine-ticket
- scrum-dev-story
- scrum-create-project-docs
- scrum-create-architecture-docs

**Step 3: Verify Skill File Content**

Check that each skill directory contains a SKILL.md file with valid YAML frontmatter:

```bash
# Example: Check Claude Code skills
for skill in scrum-create-project-context scrum-create-ticket scrum-refine-ticket scrum-dev-story scrum-create-project-docs scrum-create-architecture-docs; do
  echo "Checking $skill..."
  cat /tmp/test-scrum-project/.claude/skills/$skill/SKILL.md | head -10
done
```

**Expected Result:** Each SKILL.md should have:
- YAML frontmatter delimited by `---`
- Required fields: `name`, `description`, `framework_path`
- Markdown body after frontmatter

**Step 4: Verify Fallback Scan Behavior**

For platforms with fallback_scan (Cursor, Windsurf, Cline), verify they can discover skills via fallback:

```bash
# Remove primary directory to test fallback
rm -rf /tmp/test-scrum-project/.cursor/skills/

# Verify Cursor can still discover skills via .claude/skills/ fallback
ls -la /tmp/test-scrum-project/.claude/skills/

# Expected: All 6 skills should be present
```

**Step 5: Generate Validation Report**

Use the validation utilities to generate a report:

```bash
cd create-scrum-workflow
node -e "
const { verifyPlatformSkillInstallations, parsePlatformRegistry, generateValidationReport } = require('./src/validation/validation-utils.js');

const registry = parsePlatformRegistry('./src/platform/platform-registry.yaml');
const expectedSkills = [
  'scrum-create-project-context',
  'scrum-create-ticket',
  'scrum-refine-ticket',
  'scrum-dev-story',
  'scrum-create-project-docs',
  'scrum-create-architecture-docs'
];

const results = verifyPlatformSkillInstallations('/tmp/test-scrum-project', registry, expectedSkills);
const report = generateValidationReport({
  timestamp: new Date().toISOString(),
  platforms: results,
  skillsTested: expectedSkills.length
});

console.log(report);
"
```

**Step 6: Document Results**

Record your findings in a validation report:
- Platforms validated: 6/6
- Skills validated: 6/6
- Pass rate: 100%
- Any platform-specific quirks or limitations

### Option 3: Hybrid Approach

Combine automated tests with manual verification:
1. Run automated test suite for quick validation
2. Perform manual spot-checks on critical platforms
3. Document any platform-specific quirks discovered

## Pass/Fail Criteria

### Pass Criteria

- **All 6 platforms** have skill directories created
- **All 6 skills** are present in each platform's directory
- **Skill files** contain valid YAML frontmatter with required fields
- **Fallback scan** works for platforms that support it (Cursor, Windsurf, Cline)
- **Target directories** match platform-registry.yaml configuration

### Fail Criteria

- Any platform missing skill directory
- Any skill missing from platform directory
- Skill files missing required YAML frontmatter fields
- Fallback scan not working for supported platforms
- Target directory mismatch with registry configuration

## Reproducibility

To reproduce this validation:

1. Use the same test project setup
2. Install with the same command and flags
3. Follow the same verification steps
4. Compare results with expected outcomes

## Platform-Specific Quirks

### GitHub Copilot
- **Quirk**: Stricter directory conventions
- **Impact**: Skills must be in `.github/skills/` with exact naming
- **Workaround**: None - installer handles this correctly

### Cline
- **Quirk**: May require restart after skill installation
- **Impact**: Skills may not be discovered immediately after installation
- **Workaround**: Restart Cline or use "Reload Skills" command

### Cursor & Windsurf
- **Quirk**: Primary directories may not exist by default
- **Impact**: Skills are discovered via `.claude/skills/` fallback
- **Workaround**: None - fallback scan works correctly

## Troubleshooting

### Skill Directories Not Created

**Problem**: Skill directories are missing after installation

**Solution**:
1. Check installer logs for errors
2. Verify platform-registry.yaml configuration
3. Ensure write permissions for target directories
4. Re-run installation with verbose output

### YAML Frontmatter Validation Fails

**Problem**: Skill files don't contain valid YAML frontmatter

**Solution**:
1. Check skill templates in `templates/skill-registrations/`
2. Verify template substitution is working correctly
3. Ensure `framework_path` substitution is valid
4. Re-run installation after fixing templates

### Fallback Scan Not Working

**Problem**: Platforms can't discover skills via fallback directories

**Solution**:
1. Verify fallback_scan configuration in platform-registry.yaml
2. Check that fallback directories exist and contain skills
3. Ensure platform supports fallback scan feature
4. Consult platform documentation for fallback scan behavior

## Reporting Results

After completing validation, report results with:

1. **Summary**: Platforms tested, skills tested, pass rate
2. **Detailed Results**: Pass/fail status for each platform
3. **Quirks Discovered**: Any platform-specific limitations or issues
4. **Recommendations**: Suggestions for improvements or workarounds

## References

- **Platform Registry**: `src/platform/platform-registry.yaml`
- **Skill Templates**: `templates/skill-registrations/`
- **Validation Tests**: `test/integration/platform-validation.test.js`
- **Validation Utilities**: `src/validation/validation-utils.js`
- **Story 8-4**: `_bmad-output/implementation-artifacts/8-4-yolo.md`

---

**Last Updated**: 2026-03-30
**Story**: 8-4 (Platform Registry Validation for New Skills)
**Epic**: 8 (Installer Integration — Epic 6 & 7 Documentation Skills)
