# Runtime Extension Model - Acceptance Tests

**Test Type**: ATDD Failing Acceptance Tests (TDD Red Phase)
**Story**: 1.7 Verify & Align Runtime Extension Model
**Date**: 2026-04-07
**Status**: FAILING (TDD Red Phase - Expected)

---

## Test Objective

Validate that the framework's runtime extension model matches the PRD (FR-44) and Architecture specifications, ensuring:
1. File-based extension works without registration, build steps, or restarts
2. Directory structure matches the Architecture specification
3. All four extension types (skills, workflows, agents, commands) follow the correct conventions

## Acceptance Criteria Under Test

From Story 1.7:

1. **AC1**: Delta analysis documents what matches, what diverges, and what is missing when comparing implementation against PRD FR-44
2. **AC2**: New `.md` files in `scrum_workflow/skills/`, `scrum_workflow/agents/`, or `scrum_workflow/workflows/` are discovered at runtime without configuration change, build step, or restart
3. **AC3**: Directory structure matches: `scrum_workflow/{commands,workflows,skills,agents}/{name}/`
4. **AC4**: Runtime extension model fully matches current PRD and Architecture specifications after delta resolution

---

## PRD Requirements (FR-44)

> **FR-44**: Framework extends through files: a new `SKILL.md` in the skills directory is a new capability, a new agent definition is a new agent, a new workflow definition is a new workflow. No configuration change, build step, or service restart required. The framework discovers new specifications at runtime — no registration, no build, no restart.

---

## Architecture Specification

```
scrum_workflow/
├── commands/
│   └── {command-name}/
│       └── command.md
├── workflows/
│   └── {workflow-name}/
│       └── workflow.md
├── skills/
│   └── {skill-name}/
│       └── SKILL.md
└── agents/
    └── {agent-name}/
        └── agent.md
```

---

## Test Cases

### TC-01: Required Directories Exist

**Description**: Verify that all four required extension directories exist.

**Preconditions**:
- Framework installed at `scrum_workflow/`

**Steps**:
1. Check for existence of `scrum_workflow/commands/`
2. Check for existence of `scrum_workflow/workflows/`
3. Check for existence of `scrum_workflow/skills/`
4. Check for existence of `scrum_workflow/agents/`

**Expected Result**:
All four directories exist.

**Assertion**:
```javascript
// FAILING TEST - Feature not yet implemented
test.skip('TC-01: Required directories exist', async () => {
  const dirs = ['commands', 'workflows', 'skills', 'agents'];

  for (const dir of dirs) {
    const dirPath = `scrum_workflow/${dir}`;
    await expect(fs.exists(dirPath)).resolves.toBe(true);
    const stat = await fs.stat(dirPath);
    expect(stat.isDirectory()).toBe(true);
  }
});
```

**Status**: FAILING (TDD Red Phase)

---

### TC-02: Skills Follow SKILL.md Convention

**Description**: Verify that skills follow the `{skill-name}/SKILL.md` naming convention.

**Preconditions**:
- `scrum_workflow/skills/` directory exists
- At least one skill exists

**Steps**:
1. List all files in `scrum_workflow/skills/`
2. Verify each subdirectory contains a `SKILL.md` file
3. Verify no flat `.md` files exist at root level (except README.md)

**Expected Result**:
- Each skill has its own subdirectory
- Each subdirectory contains `SKILL.md` (uppercase)
- No flat skill files at root level

**Assertion**:
```javascript
// FAILING TEST - Feature not yet implemented
test.skip('TC-02: Skills follow SKILL.md convention', async () => {
  const skillsDir = 'scrum_workflow/skills';
  const entries = await fs.readdir(skillsDir);

  // Get all directories (skills)
  const skillDirs = entries.filter(async (e) => {
    const stat = await fs.stat(path.join(skillsDir, e));
    return stat.isDirectory() && !e.startsWith('.');
  });

  for (const skillDir of await Promise.all(skillDirs)) {
    const skillPath = path.join(skillsDir, skillDir, 'SKILL.md');
    await expect(fs.exists(skillPath)).resolves.toBe(true);
  }

  // Verify no flat .md files except README.md
  const mdFiles = entries.filter(e => e.endsWith('.md') && e !== 'README.md');
  expect(mdFiles.length).toBe(0);
});
```

**Status**: FAILING (TDD Red Phase)

---

### TC-03: Workflows Follow workflow.md Convention

**Description**: Verify that workflows follow the `{workflow-name}/workflow.md` naming convention.

**Preconditions**:
- `scrum_workflow/workflows/` directory exists

**Steps**:
1. List all files in `scrum_workflow/workflows/`
2. Verify each subdirectory contains a `workflow.md` file
3. Document any flat `.md` files as delta

**Expected Result**:
- Each workflow has its own subdirectory
- Each subdirectory contains `workflow.md` (lowercase)
- No flat workflow files at root level (except README.md, .gitkeep)

**Assertion**:
```javascript
// FAILING TEST - Feature not yet implemented
test.skip('TC-03: Workflows follow workflow.md convention', async () => {
  const workflowsDir = 'scrum_workflow/workflows';
  const entries = await fs.readdir(workflowsDir);

  // Get all directories (workflows)
  const workflowDirs = [];
  for (const e of entries) {
    const stat = await fs.stat(path.join(workflowsDir, e));
    if (stat.isDirectory() && !e.startsWith('.')) {
      workflowDirs.push(e);
    }
  }

  // Architecture spec requires {workflow-name}/workflow.md structure
  // DELTA: Current implementation uses flat files
  // This test documents the expected structure

  for (const workflowDir of workflowDirs) {
    const workflowPath = path.join(workflowsDir, workflowDir, 'workflow.md');
    await expect(fs.exists(workflowPath)).resolves.toBe(true);
  }
});
```

**Status**: FAILING (TDD Red Phase)

---

### TC-04: Agents Follow agent.md Convention

**Description**: Verify that agents follow the `{agent-name}/agent.md` naming convention.

**Preconditions**:
- `scrum_workflow/agents/` directory exists

**Steps**:
1. List all files in `scrum_workflow/agents/`
2. Verify each subdirectory contains an `agent.md` file
3. Document any flat `.md` files as delta

**Expected Result**:
- Each agent has its own subdirectory
- Each subdirectory contains `agent.md` (lowercase)
- No flat agent files at root level (except README.md)

**Assertion**:
```javascript
// FAILING TEST - Feature not yet implemented
test.skip('TC-04: Agents follow agent.md convention', async () => {
  const agentsDir = 'scrum_workflow/agents';
  const entries = await fs.readdir(agentsDir);

  // Get all directories (agents)
  const agentDirs = [];
  for (const e of entries) {
    const stat = await fs.stat(path.join(agentsDir, e));
    if (stat.isDirectory() && !e.startsWith('.')) {
      agentDirs.push(e);
    }
  }

  // Architecture spec requires {agent-name}/agent.md structure
  // DELTA: Current implementation uses flat files

  for (const agentDir of agentDirs) {
    const agentPath = path.join(agentsDir, agentDir, 'agent.md');
    await expect(fs.exists(agentPath)).resolves.toBe(true);
  }
});
```

**Status**: FAILING (TDD Red Phase)

---

### TC-05: Commands Follow command.md Convention

**Description**: Verify that commands follow the `{command-name}/command.md` naming convention.

**Preconditions**:
- `scrum_workflow/commands/` directory exists

**Steps**:
1. List all files in `scrum_workflow/commands/`
2. Verify each subdirectory contains a `command.md` file
3. Document any flat `.md` files as delta

**Expected Result**:
- Each command has its own subdirectory
- Each subdirectory contains `command.md` (lowercase)
- No flat command files at root level (except README.md)

**Assertion**:
```javascript
// FAILING TEST - Feature not yet implemented
test.skip('TC-05: Commands follow command.md convention', async () => {
  const commandsDir = 'scrum_workflow/commands';
  const entries = await fs.readdir(commandsDir);

  // Get all directories (commands)
  const commandDirs = [];
  for (const e of entries) {
    const stat = await fs.stat(path.join(commandsDir, e));
    if (stat.isDirectory() && !e.startsWith('.')) {
      commandDirs.push(e);
    }
  }

  // Architecture spec requires {command-name}/command.md structure
  // DELTA: Current implementation uses flat files

  for (const commandDir of commandDirs) {
    const commandPath = path.join(commandsDir, commandDir, 'command.md');
    await expect(fs.exists(commandPath)).resolves.toBe(true);
  }
});
```

**Status**: FAILING (TDD Red Phase)

---

### TC-06: No Centralized Registry Exists

**Description**: Verify that no centralized registry (skills.json, workflows.json, agents.json) exists.

**Preconditions**:
- Framework installed

**Steps**:
1. Search for `skills.json` or similar registry files
2. Search for `workflows.json` or similar registry files
3. Search for `agents.json` or similar registry files
4. Verify no registration configuration exists

**Expected Result**:
No centralized registry files exist.

**Assertion**:
```javascript
// FAILING TEST - Feature not yet implemented
test.skip('TC-06: No centralized registry exists', async () => {
  const registryPatterns = [
    'scrum_workflow/skills.json',
    'scrum_workflow/workflows.json',
    'scrum_workflow/agents.json',
    'scrum_workflow/commands.json',
    'scrum_workflow/config/registry.json',
    'scrum_workflow/registry.json'
  ];

  for (const pattern of registryPatterns) {
    await expect(fs.exists(pattern)).resolves.toBe(false);
  }
});
```

**Status**: FAILING (TDD Red Phase)

---

### TC-07: No Build Step Required

**Description**: Verify that no build step, compilation, or bundling is required for framework extension.

**Preconditions**:
- Framework installed

**Steps**:
1. Check for `package.json` build scripts related to extension
2. Check for webpack/rollup/vite configs that bundle framework files
3. Check for any compilation scripts

**Expected Result**:
No build step required for framework extension.

**Assertion**:
```javascript
// FAILING TEST - Feature not yet implemented
test.skip('TC-07: No build step required for extension', async () => {
  // Check package.json for extension-related build scripts
  const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8'));

  const extensionBuildScripts = ['build-skills', 'compile-workflows', 'bundle-agents'];
  const scripts = Object.keys(packageJson.scripts || {});

  for (const buildScript of extensionBuildScripts) {
    expect(scripts).not.toContain(buildScript);
  }

  // Check for bundler configs that might process framework files
  const bundlerConfigs = ['webpack.config.js', 'rollup.config.js'];
  for (const config of bundlerConfigs) {
    if (await fs.exists(config)) {
      const content = await fs.readFile(config, 'utf8');
      // Should not reference scrum_workflow/ framework files
      expect(content).not.toContain('scrum_workflow/skills');
      expect(content).not.toContain('scrum_workflow/workflows');
      expect(content).not.toContain('scrum_workflow/agents');
    }
  }
});
```

**Status**: FAILING (TDD Red Phase)

---

### TC-08: Framework Files Are Pure Markdown/YAML

**Description**: Verify that framework specification files are pure Markdown/YAML that can be read at runtime.

**Preconditions**:
- Framework installed

**Steps**:
1. Read sample skill file and verify it's Markdown
2. Read sample workflow file and verify it's Markdown
3. Read sample agent file and verify it's Markdown
4. Verify no compiled/binary files in extension directories

**Expected Result**:
All framework files are pure Markdown/YAML.

**Assertion**:
```javascript
// FAILING TEST - Feature not yet implemented
test.skip('TC-08: Framework files are pure Markdown/YAML', async () => {
  // Check skill file
  const skillContent = await fs.readFile('scrum_workflow/skills/readiness-check/SKILL.md', 'utf8');
  expect(skillContent).toMatch(/^---\n/); // Should start with YAML frontmatter
  expect(skillContent).toContain('name:');
  expect(skillContent).toContain('#'); // Should contain Markdown headers

  // Check workflow file
  const workflowContent = await fs.readFile('scrum_workflow/workflows/refinement.md', 'utf8');
  expect(workflowContent).toMatch(/^---\n/);
  expect(workflowContent).toContain('#');

  // Check agent file
  const agentContent = await fs.readFile('scrum_workflow/agents/developer.md', 'utf8');
  expect(agentContent).toMatch(/^---\n/);
  expect(agentContent).toContain('#');

  // Verify no compiled files
  const extensionDirs = ['skills', 'workflows', 'agents', 'commands'];
  for (const dir of extensionDirs) {
    const entries = await fs.readdir(`scrum_workflow/${dir}`, { recursive: true });
    const compiledFiles = entries.filter(e =>
      e.endsWith('.js') || e.endsWith('.ts') || e.endsWith('.json') ||
      e.endsWith('.compiled') || e.endsWith('.bundle')
    );
    // Allow .gitkeep and README files
    const invalidFiles = compiledFiles.filter(f =>
      !f.includes('.gitkeep') && !f.includes('README')
    );
    expect(invalidFiles.length).toBe(0);
  }
});
```

**Status**: FAILING (TDD Red Phase)

---

### TC-09: Runtime Discovery Works Without Configuration

**Description**: Verify that adding a new specification file is immediately usable without config changes.

**Preconditions**:
- Framework installed
- Test can write to framework directories

**Steps**:
1. Create a new test skill file at `scrum_workflow/skills/test-skill/SKILL.md`
2. Verify file exists and is readable
3. Verify no config update was required
4. Clean up test file

**Expected Result**:
New file is discoverable without any configuration change.

**Assertion**:
```javascript
// FAILING TEST - Feature not yet implemented
test.skip('TC-09: Runtime discovery works without configuration', async () => {
  const testSkillPath = 'scrum_workflow/skills/test-discovery-skill/SKILL.md';
  const testSkillContent = `---
name: test-discovery-skill
description: Test skill for runtime discovery verification
---

# Test Discovery Skill

This is a test skill to verify runtime discovery.
`;

  // Record config hash before
  const configBefore = await fs.readFile('scrum_workflow/config.yaml', 'utf8');

  // Create new skill file
  await fs.mkdir(path.dirname(testSkillPath), { recursive: true });
  await fs.writeFile(testSkillPath, testSkillContent, 'utf8');

  // Verify file exists and is readable
  await expect(fs.exists(testSkillPath)).resolves.toBe(true);
  const content = await fs.readFile(testSkillPath, 'utf8');
  expect(content).toContain('test-discovery-skill');

  // Verify config was not changed
  const configAfter = await fs.readFile('scrum_workflow/config.yaml', 'utf8');
  expect(configAfter).toBe(configBefore);

  // Clean up
  await fs.rm(path.dirname(testSkillPath), { recursive: true });
});
```

**Status**: FAILING (TDD Red Phase)

---

### TC-10: Delta Analysis Documents All Variances

**Description**: Verify that the delta analysis is complete and documents all variances from Architecture spec.

**Preconditions**:
- Framework structure analyzed
- PRD FR-44 requirements understood

**Steps**:
1. Document expected structure from Architecture
2. Document actual structure in implementation
3. Compare and identify all deltas
4. Verify delta document exists and is complete

**Expected Result**:
Complete delta analysis document with:
- What matches
- What diverges
- What is missing

**Assertion**:
```javascript
// FAILING TEST - Feature not yet implemented
test.skip('TC-10: Delta analysis documents all variances', async () => {
  // This test verifies the delta analysis document exists and is complete
  const deltaDocPath = '_scrum-output/implementation-artifacts/1-7-verify-align-runtime-extension-model.md';

  await expect(fs.exists(deltaDocPath)).resolves.toBe(true);

  const content = await fs.readFile(deltaDocPath, 'utf8');

  // Must document expected structure
  expect(content.toLowerCase()).toContain('architecture');
  expect(content).toContain('commands');
  expect(content).toContain('workflows');
  expect(content).toContain('skills');
  expect(content).toContain('agents');

  // Must document FR-44 requirements
  expect(content).toContain('FR-44');

  // Must have Dev Notes section for delta documentation
  expect(content).toContain('Dev Notes');
});
```

**Status**: FAILING (TDD Red Phase)

---

## Delta Summary (Current State)

Based on initial analysis:

| Component | Architecture Spec | Current Implementation | Delta |
|-----------|-------------------|------------------------|-------|
| `skills/` | `{name}/SKILL.md` | `{name}/SKILL.md` | MATCH |
| `workflows/` | `{name}/workflow.md` | `{name}.md` (flat) | DIVERGENCE |
| `agents/` | `{name}/agent.md` | `{name}.md` (flat) | DIVERGENCE |
| `commands/` | `{name}/command.md` | `{name}.md` (flat) | DIVERGENCE |

**Note**: The flat file structure may be an acceptable variance if FR-44's core requirements (no registration, no build, no restart) are met. The key question is: does the current structure support runtime discovery without configuration changes?

---

## ATDD Checklist

| AC # | Description | Test Case | Status |
|------|-------------|-----------|--------|
| AC1 | Delta analysis documents all variances | TC-10 | FAILING (Red) |
| AC2 | Runtime discovery without config/build/restart | TC-06, TC-07, TC-08, TC-09 | FAILING (Red) |
| AC3 | Directory structure matches Architecture | TC-01, TC-02, TC-03, TC-04, TC-05 | FAILING (Red) |
| AC4 | Full alignment after delta resolution | All TCs | FAILING (Red) |

---

## Implementation Notes

### Key Questions to Resolve

1. **Structure Delta**: Should we migrate to the Architecture-specified `{name}/spec-file.md` structure, or is the current flat file structure an acceptable variance?

2. **Discovery Mechanism**: How does the AI assistant currently discover new specifications? By file path reference? By directory scanning?

3. **Acceptable Variance Criteria**: What makes a variance "acceptable" vs. requiring resolution?
   - If FR-44's "no registration, no build, no restart" is met, structure variance may be acceptable
   - If the variance causes confusion or inconsistency, it should be resolved

### Resolution Options

**Option A: Migrate to Architecture Spec**
- Create subdirectories for workflows, agents, commands
- Move files into subdirectories with proper naming
- Update all references
- Pro: Full spec compliance
- Con: Breaking change for existing projects

**Option B: Accept Current Structure as Variance**
- Document the variance in Architecture
- Update Architecture to match implementation
- Pro: No breaking changes
- Con: Inconsistency between spec and implementation

**Option C: Hybrid Approach**
- Keep flat files as legacy support
- Support both structures for new additions
- Pro: Backward compatible
- Con: Complexity

---

## TDD Red Phase Summary

All tests in this file are marked with `test.skip()` indicating they are failing tests in the TDD red phase. These tests define the expected behavior for the Runtime Extension Model verification (Story 1.7).

**Next Steps (TDD Green Phase)**:
1. Run delta analysis to document all variances
2. Decide on resolution approach (migrate, accept variance, or hybrid)
3. Apply fixes if required
4. Verify all tests pass

**Run Tests**: `npm test -- scrum_workflow/__tests__/runtime-extension/runtime-extension-model.test.md`
