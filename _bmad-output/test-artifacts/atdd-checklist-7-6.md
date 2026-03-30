# ATDD Checklist - Story 7.6: Local Dev Environment Analysis

**Generated**: 2026-03-30
**Story**: 7-6-local-dev-environment-analysis-and-generation
**Status**: Ready for Dev

## Acceptance Criteria Test Scenarios

### AC1: Template file exists at correct location

| Test Scenario | Validation Criteria | Status |
|--------------|-------------------|--------|
| Template file exists | `scrum_workflow/templates/local-dev-environment.md` file exists | ☐ |
| Required sections present | File contains: Overview, Prerequisites, Services (with ports and URLs), Mock Services, Environment Variables, Seed Data, Common Commands | ☐ |
| Template is valid Markdown | File is readable Markdown with proper syntax | ☐ |
| Template at correct path | File is in `scrum_workflow/templates/` NOT root `templates/` (critical from Story 7-3 bug) | ☐ |

### AC2: Grep patterns for local dev components

| Test Scenario | Validation Criteria | Status |
|--------------|-------------------|--------|
| Docker Compose patterns | architect-doc agent Instructions includes patterns for: `docker-compose.yml`, `docker-compose.override.yml`, `docker-compose.local.yml` | ☐ |
| Mock service patterns | architect-doc agent Instructions includes patterns for: `wiremock`, `__files/`, `mappings/`, `mockserver`, `prism`, `json-server` | ☐ |
| Environment file patterns | architect-doc agent Instructions includes patterns for: `.env`, `.env.local`, `.env.example`, `.env.development`, `.env.test` | ☐ |
| Seed/fixture patterns | architect-doc agent Instructions includes patterns for: `seed.*`, `fixtures/`, `factory.*`, `testdata/`, `__fixtures__/` | ☐ |
| Local tooling patterns | architect-doc agent Instructions includes patterns for: `Makefile`, `justfile`, `Taskfile.yml`, `scripts/` | ☐ |
| Port mapping patterns | architect-doc agent Instructions includes port extraction patterns from docker-compose and .env files | ☐ |

### AC3: Local dev analysis orchestration in workflow

| Test Scenario | Validation Criteria | Status |
|--------------|-------------------|--------|
| Step 4.4 exists | `architecture-documentation.md` workflow has Step 4.4: Local Dev Environment Analysis | ☐ |
| Agent invocation | Step 4.4 instructs to invoke architect-doc agent with local-dev context | ☐ |
| Output file specified | Step 4.4 specifies output as `docs/generated/local-dev-environment.md` | ☐ |
| Skip condition | Step 4.4 includes instruction to skip if no local dev detected | ☐ |

### AC4: Service topology documentation with Mermaid

| Test Scenario | Validation Criteria | Status |
|--------------|-------------------|--------|
| Graph present | Services section includes Mermaid `graph TD` | ☐ |
| Port numbers | Diagram shows services with their port numbers | ☐ |

### AC5: Environment variables documentation

| Test Scenario | Validation Criteria | Status |
|--------------|-------------------|--------|
| Table format | Environment Variables section includes table with: Variable, Source File, Description, Example Value | ☐ |
| Variable coverage | All environment variables from .env files are documented | ☐ |

### AC6: Common commands documentation

| Test Scenario | Validation Criteria | Status |
|--------------|-------------------|--------|
| Commands listed | Common Commands section lists start, stop, reset, seed commands | ☐ |
| Shell commands | Commands include exact shell commands that can be executed | ☐ |

### AC7: Source references

| Test Scenario | Validation Criteria | Status |
|--------------|-------------------|--------|
| File:line references | All documented components include `file:line` references | ☐ |
| References from Grep | References extracted from Grep result file paths and line numbers | ☐ |

### AC8: No local dev handling

| Test Scenario | Validation Criteria | Status |
|--------------|-------------------|--------|
| Skip condition | Workflow skips document generation when no local dev files detected | ☐ |
| Scan state note | Scan state includes note about why document was skipped | ☐ |

---

## Test Execution Summary

| AC ID | Test Count | Passed | Failed | Blocked |
|-------|------------|--------|--------|---------|
| AC1 | 4 | 0 | 0 | 0 |
| AC2 | 6 | 0 | 0 | 0 |
| AC3 | 4 | 0 | 0 | 0 |
| AC4 | 2 | 0 | 0 | 0 |
| AC5 | 2 | 0 | 0 | 0 |
| AC6 | 2 | 0 | 0 | 0 |
| AC7 | 2 | 0 | 0 | 0 |
| AC8 | 2 | 0 | 0 | 0 |
| **TOTAL** | **24** | **0** | **0** | **0** |

**Overall Status**: ☐ PASS / ☐ FAIL

**Notes**:
- ATDD checklist created - all test scenarios defined
- Ready for dev-story implementation
- Tests will be executed during dev-story workflow
- CRITICAL: Template must be created at `scrum_workflow/templates/local-dev-environment.md` (NOT root `templates/`)

---

## TDD Red Phase: Validation Checklists Defined

✅ **ATDD Red Phase Complete for Skeleton Story**

- **Validation Type**: File structure + content validation (not traditional code tests)
- **Total Validation Scenarios**: 24
- **All validations**: Will FAIL until implementation complete
- **Implementation Required**: Template creation + agent verification + workflow verification

## Implementation Guidance (Green Phase)

**Files to Create:**
1. `scrum_workflow/templates/local-dev-environment.md` - Template with 8 required sections
2. Verify `scrum_workflow/agents/architect-doc.md` has local dev grep patterns (should exist from Story 7-1)
3. Verify `scrum_workflow/workflows/architecture-documentation.md` Step 4.4 exists (should exist from Story 7-2)

**Green Phase Trigger:**
After implementation, validations will pass:
- ✅ Template file exists at correct location
- ✅ All required sections present
- ✅ Grep patterns verified in agent
- ✅ Workflow step verified
- ✅ Mermaid syntax valid

**Critical Bug Prevention Pattern (Stories 7-3, 7-4, 7-5):**
- Story 7-3: Bug - template at wrong path `templates/` instead of `scrum_workflow/templates/`
- Story 7-4: Success - template at correct path `scrum_workflow/templates/`
- Story 7-5: Success - template at correct path `scrum_workflow/templates/`
- Story 7-6 MUST continue success pattern: create template directly at `scrum_workflow/templates/local-dev-environment.md`

**Next: Run dev-story to implement feature and achieve GREEN phase**
