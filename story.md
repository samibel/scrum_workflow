---
title: "Restructure project to core/ and cli/ directories"
status: backlog
priority: high
created: 2026-04-14
owner: ""
---

# Restructure Project to Core / CLI Architecture

## Summary
Reorganize the scrum_workflow project to explicitly separate the **core workflow engine** (`/core`) from the **CLI scaffolding tool** (`/cli`). This makes BMAD-independence clear, improves modularity, and enables future consumers (Web UI, integrations).

## Business Value
- **Clarity**: Core logic is isolated and reusable
- **Independence**: scrum_workflow is explicitly decoupled from CLI concerns
- **Scalability**: Other consumers can use `/core` without dragging `/cli` along
- **Maintainability**: Clear separation of concerns reduces cognitive load

## Current Structure
```
project-root/
  scrum_workflow/          ← the workflow engine (core logic)
  create-scrum-workflow/   ← the CLI installer + generator
  __tests__/               ← tests (scattered)
  _bmad/                   ← BMAD dependency (stays)
  _scrum-output/           ← generated artifacts
  docs/, README.md, etc.   ← documentation
```

## Target Structure
```
project-root/
  core/                    ← renamed from scrum_workflow
  cli/                     ← renamed from create-scrum-workflow
  __tests__/               ← remains (or reorganize)
  _bmad/                   ← unchanged (explicit dependency)
  _scrum-output/           ← unchanged
  docs/, README.md, etc.   ← unchanged
```

## Critical Changes (per Amelia's analysis)

### 1. Package.json Dependencies & Exports
**Files:**
- `core/package.json` (from `scrum_workflow/package.json`)
- `cli/package.json` (from `create-scrum-workflow/package.json`)
- Root `package.json` (add workspace config)

**Changes:**
- Define `@scrum-workflow/core` exports in `core/package.json` (currently missing)
- `cli/` depends on `@scrum-workflow/core` as local workspace dependency
- Root `package.json` declares workspaces: `["cli", "core"]`

### 2. Binary Entry Point & Template Paths
**Files:**
- `cli/bin/create-scrum-workflow.js` (from `create-scrum-workflow/bin/`)
- All relative imports in `cli/src/` (update path resolution)
- `cli/package.json` → `"bin"` field points to new path

**Changes:**
- Templates move from `create-scrum-workflow/templates/` → `core/templates/`
- Binary resolves templates from `@scrum-workflow/core` package
- Update `sync-templates.js` script to new paths

### 3. Installation Target & Artifact Resolution
**Files:**
- `cli/src/commands/install.js` (from `create-scrum-workflow/src/commands/install.js`)
- `cli/src/core/config-builder.js` (hardcoded `scrum_workflow` path → `core`)
- `cli/src/core/path-resolver.js` (resolve `@scrum-workflow/core` instead of relative)

**Changes:**
- Installer resolves `@scrum-workflow/core` to find templates
- Hardcoded paths updated: `scrum_workflow` → `core` in config-builder
- Path resolver uses workspace resolution instead of relative paths

## Critical Scope Decision

**Important:** This story must decide on the `frameworkPath` semantics before implementation starts.

- **frameworkPath in installed projects**: When users run the installer, what directory name gets created for the workflow engine?
  - **Option A** (Breaking Change): Change to `core/` — users' projects use `core/` instead of `scrum_workflow/`
  - **Option B** (Backward Compatible): Keep default as `scrum_workflow/` — only repository structure changes, user installations unchanged

**Current assumption in this story**: **Option B (Backward Compatible)** — the repository changes to `/core` and `/cli`, but the `frameworkPath` default in user projects remains `scrum_workflow/`. This preserves existing installations and makes this a non-breaking migration.

If you choose **Option A**, this becomes a major Breaking Change — scope increases significantly (template rewrites, user migration guide, version bump to 2.0).

**Decision required before Phase 1 starts.**

---

## Acceptance Criteria (Refined by Agents)

### Phase 1: Directory Rename (Git History Preserved)

- [ ] **AC1 (Refined)**: Directory structure matches target
  - `/core` exists with `scrum_workflow/` content (min: `config.yaml`, `skills/`, `templates/`, `commands/`, `package.json`)
  - `/cli` exists with `create-scrum-workflow/` content (min: `bin/`, `src/`, `test/`, `package.json`)
  - `scrum_workflow/` and `create-scrum-workflow/` directories no longer exist at root
  - Verified via: `ls -la /core` + `ls -la /cli` + absence check
  - **Git history preserved**: `git log --follow core/` shows commits from `scrum_workflow/`

### Phase 2: Package.json & Workspace Configuration

- [ ] **AC2 (Refined)**: Workspace configuration is valid and resolvable
  - Root `package.json` contains `"workspaces": ["cli", "core"]`
  - `core/package.json` declares `"name": "@scrum-workflow/core"` and `"exports": { ".": "./index.js" }`
  - `core/index.js` exists and exports the core workflow module (or equivalent entry point)
  - `cli/package.json` contains `"@scrum-workflow/core": "workspace:*"` in dependencies
  - `npm install --dry-run` from root succeeds without errors
  - **Verified via**: `npm install` from root, then `node -e "require('@scrum-workflow/core')"`

- [ ] **AC9 (New - Winston)**: Package manager unified
  - Single package manager (npm or pnpm) used consistently across root and all workspaces
  - Root and `core/` and `cli/` use the same lockfile format (either `package-lock.json` or `pnpm-lock.yaml`, not mixed)
  - **Verified via**: `npm config get save-exact` consistent across all package.json files; no `pnpm-lock.yaml` in mixed `npm` workspace

### Phase 3: Hardcoded Path Resolution

- [ ] **AC3 (Refined)**: Installer works end-to-end with new structure
  - `cli/bin/create-scrum-workflow.js` executes successfully
  - `path-resolver.js` correctly resolves `templateSourceDir` to `/core/templates/` (or workspace-relative equivalent)
  - Installer successfully scaffolds a new project with all core workflow files
  - Generated project contains `frameworkPath: "scrum_workflow"` in config (backward compatible default)
  - **Verified via**: `node cli/bin/create-scrum-workflow.js install --yes --dir /tmp/test-install && ls /tmp/test-install/scrum_workflow/`

- [ ] **AC4 (Refined)**: Templates are correctly installed with proper substitution
  - Generated project contains all 31 template files (current count)
  - No `{{framework_path}}` placeholders remain unsubstituted in generated SKILL.md files
  - `_scrum-output/context/`, `_scrum-output/docs/`, `_scrum-output/skills/`, `_scrum-output/sprints/` all exist in generated project
  - **Verified via**: Automated template-placeholder check: `grep -r "{{" /tmp/test-install/ | wc -l` should be 0

- [ ] **AC10 (New - Winston)**: Hardcoded framework-path references updated
  - `cli/src/core/config-builder.js`: All `'scrum_workflow'` string literals remain (they are defaults, not to be changed per scope decision)
  - `cli/src/core/path-resolver.js`: Uses workspace-resolved paths, not relative `../..` strings; `templateSourceDir` correctly points to workspace
  - `cli/src/core/approval/approve.js`: Regex `/^scrum_workflow\//` remains (validates user project paths, not repo structure)
  - `cli/src/estimation/wideband-delphi.js`: Uses `frameworkPath` variable from config, not hardcoded path
  - `cli/scripts/sync-templates.js`: Updated to reference `/core/templates/` as source (if templates are copied; OR documented as deprecated if moved to workspace-only)
  - **Verified via**: Automated check for remaining hardcoded paths: `grep -r "create-scrum-workflow/" cli/src/` should return 0

### Phase 4: Test Coverage & Validation

- [ ] **AC5 (Refined)**: All unit tests pass with path updates
  - All tests in `cli/test/unit/`, `core/tests/`, `__tests__/` run and pass
  - Test fixtures updated for new directory structure (AC1 verified)
  - Path-resolver tests: `cli/test/unit/path-resolver.test.js` includes filesystem verification (not just mocks)
    - Test verifies `resolveInstallPaths().templateSourceDir` actually exists on disk
    - Test verifies `resolveInstallPaths().skillTemplateDir` contains expected files
  - Config-builder tests updated to reflect any renamed directories
  - **Verified via**: `npm test --workspaces` exits 0 with all suites passing

- [ ] **AC6 (Refined)**: Integration tests pass with end-to-end installer flow
  - ATDD suite in `cli/test/atdd/` runs end-to-end install scenarios
  - New ATDD test scenario: "Installer scaffolds with new `/core` structure" (or equivalent per scope decision)
  - Integration test verifies workspace-installed `@scrum-workflow/core` is correctly resolved at runtime
  - **Test coverage for Murat's identified gaps:**
    - Workspace resolution cold-start: `npm install` → `require('@scrum-workflow/core')` succeeds
    - E2E smoke test: Fresh install in temp directory produces valid project structure
  - **Verified via**: `npm run test:integration` passes

- [ ] **AC7 (Refined - Murat)**: Lock.json hashes reflect new structure
  - Generated `.scrum-workflow-lock.json` contains `"framework_path": "scrum_workflow"` (per scope decision)
  - All hash keys in `.scrum-workflow-lock.json` begin with `scrum_workflow/` (matches framework_path, not `core/`)
  - No hash keys contain repository-level paths (e.g., no `cli/` or `core/` in user project lock files)
  - Lock file passes JSON schema validation (if schema exists) or manual integrity check
  - **Verified via**: Automated JSON check: `jq '.files | keys[] | select(startswith("scrum_workflow"))' .scrum-workflow-lock.json | wc -l` > 0

- [ ] **AC8 (Refined)**: Documentation updated and consistent
  - README.md clarifies:
    - Repository structure: `/core` = workflow engine, `/cli` = scaffolder, `_bmad/` = dependency
    - User installations: Generated projects still use `scrum_workflow/` directory (per scope decision)
    - If migrating existing projects: Guide provided (if AC7 scope allows)
  - Architecture documentation updated with new workspace structure
  - No remaining references to old paths in user-facing docs
  - **Verified via**: Manual review of README, ARCHITECTURE.md, and generated context files

## Implementation Notes (TDD Sequence - per Amelia)

**Phase execution order is critical:**

1. **Phase 1: Git Directory Renames** (History preserved)
   - `git mv scrum_workflow/ core/`
   - `git mv create-scrum-workflow/ cli/`
   - Verify with `git log --follow core/` (should show old commits)

2. **Phase 2a: Tests Go Red (TDD-First)**
   - Write/rewrite test expectations for new structure
   - Example: `expect(config.frameworkPath).toBe('scrum_workflow')` (unchanged for backward compat)
   - Example: `expect(paths.templateSourceDir).toContain('core/templates')`
   - Run tests — they will fail; this is expected

3. **Phase 2b: Package.json + Workspace**
   - Update Root `package.json` with `"workspaces": ["cli", "core"]`
   - Update `core/package.json`: add `"name"` and `"exports"` fields
   - Update `cli/package.json`: add `@scrum-workflow/core` dependency
   - Run `npm install` from root — symlinks are created
   - Tests may still fail (AC5, AC6)

4. **Phase 3: Source Code Fixes Until Tests Go Green**
   - Fix `cli/src/core/path-resolver.js` — correct `templateSourceDir` calculation
   - Fix `cli/src/core/config-builder.js` — ensure `frameworkPath` defaults to `'scrum_workflow'`
   - Fix `cli/scripts/sync-templates.js` — or document as deprecated
   - Fix `cli/src/estimation/wideband-delphi.js` — use config variable, not hardcode
   - Fix `cli/src/core/approval/approve.js` — regex remains `/^scrum_workflow\//` (user project paths)
   - Run `npm test --workspaces` until green

5. **Phase 4: Documentation & Verification**
   - Update README.md with new structure explanation
   - Verify backward compatibility: generated projects still use `scrum_workflow/` directory
   - Verify lock.json generation with correct `framework_path` value
   - Final AC spot-checks

**Key Safeguards:**
- **Never** change `frameworkPath` default without explicit scope decision (documented in Critical Scope Decision section)
- **Always** run tests after each phase — never skip to next phase if tests are red
- **Template-sync question**: Determine if `sync-templates.js` should be updated or deprecated (architectural decision)

## Risks & Mitigations (from Agent Analysis)

| Risk | Severity | Mitigation |
|------|----------|-----------|
| `path-resolver.js` has zero filesystem tests | CRITICAL | AC5 requires actual filesystem verification, not mocks |
| Workspace-resolution not tested | HIGH | AC6 must verify `@scrum-workflow/core` module resolution at runtime |
| `templateSourceDir` calculation incorrect after rename | HIGH | AC3 verifies installer finds templates; AC5 tests path resolution |
| Test fixtures hardcoded with `'scrum_workflow'` strings | MEDIUM | Tests will fail until updated (good TDD signal) |
| Package manager mismatch (npm + pnpm) | HIGH | AC9 enforces single PM across root + workspaces |
| 30+ markdown files in `core/context/` reference old paths | MEDIUM | Document in README if breaking change OR update all instances |
| Lock.json hash keys use old paths | MEDIUM | AC7 validates hash keys match `framework_path` value |

## Out of Scope

- **Template-duplification solution** (duplicate removal postponed to follow-up story)
- **Breaking change to user-installed projects** — frameworkPath remains `scrum_workflow/` per scope decision
- Refactoring `_bmad/` (stays as-is, explicit dependency)
- Changes to generated artifacts in user projects beyond `frameworkPath` consistency
- Performance optimization (migration task, not enhancement)
- Web UI or integration consumers (architectural goal, not this story)

---

## Story Status: Refined ✅

This story has been refined by:
- 🏗️ **Winston (Architect)** — architectural soundness, workspace design, new ACs
- 💻 **Amelia (Developer)** — implementation sequence, TDD order, edge cases
- 🧪 **Murat (QA)** — test coverage gaps, AC clarity, validation strategy

**Key Changes from Agent Feedback:**
1. **Critical Scope Decision** added — `frameworkPath` semantics must be decided before Phase 1
2. **ACs refined** (AC1, AC2, AC3, AC4, AC7, AC8) — now testable and specific
3. **New ACs added** (AC9, AC10) — package manager unification, hardcoded path cleanup
4. **TDD Sequence** provided — 5-phase execution order with safeguards
5. **Risks & Mitigations** table — from Murat's test analysis
6. **Backward compatibility** locked in — users' projects remain `scrum_workflow/` (non-breaking change)

---

## Ready for Implementation

**Before Phase 1 Starts:**
1. ✅ Confirm scope decision: Keep user projects as `scrum_workflow/` (Option B — recommended) or break to `core/` (Option A)?
2. ✅ Review TDD sequence — agree on test-first approach (tests go red, then sources fixed)?
3. ✅ Allocate time for Phase 4 documentation update (30+ markdown references to verify)

**Next Step:** Ready to implement. Use `/scrum-dev-story story.md` to begin Phase 1 with Amelia's TDD sequence.
