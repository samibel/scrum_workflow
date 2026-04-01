# ATDD Checklist - Story 7.4: Frontend Architecture Analysis

**Generated**: 2026-03-30
**Story**: 7-4-frontend-architecture-analysis-and-generation
**Status**: Ready for Dev

## Acceptance Criteria Test Scenarios

### AC1: Template file exists at correct location

| Test Scenario | Validation Criteria | Status |
|--------------|-------------------|--------|
| Template file exists | `scrum_workflow/templates/frontend-architecture.md` file exists | ☐ |
| Required sections present | File contains: Overview, Component Hierarchy, State Management, Routing Structure, Build Pipeline, Shared Utilities | ☐ |
| Template is valid Markdown | File is readable Markdown with proper syntax | ☐ |
| Template at correct path | File is in `scrum_workflow/templates/` NOT root `templates/` (critical from Story 7-3 bug) | ☐ |

### AC2: Grep patterns for frontend components

| Test Scenario | Validation Criteria | Status |
|--------------|-------------------|--------|
| Component definition patterns | architect-doc agent Instructions includes patterns for: `.tsx`, `.jsx`, `.vue`, `.svelte`, `Component`, `FC`, `defineComponent` | ☐ |
| State management patterns | architect-doc agent Instructions includes patterns for: `store`, `reducer`, `action`, `selector`, `signal`, `atom`, `createStore`, `createSlice`, `Vuex`, `Pinia`, `Zustand` | ☐ |
| Routing patterns | architect-doc agent Instructions includes patterns for: `Route`, `Router`, `path`, `navigate`, `Link`, `useRouter`, `createBrowserRouter` | ☐ |
| Build pipeline patterns | architect-doc agent Instructions includes patterns for: `webpack.config`, `vite.config`, `next.config`, `tsconfig.json`, `babel.config` | ☐ |
| Shared utilities patterns | architect-doc agent Instructions includes patterns for: `use*`, `utils/`, `helpers/`, `hooks/`, `composables/` | ☐ |

### AC3: Frontend analysis orchestration in workflow

| Test Scenario | Validation Criteria | Status |
|--------------|-------------------|--------|
| Step 4.2 exists | `architecture-documentation.md` workflow has Step 4.2: Frontend Architecture Analysis | ☐ |
| Agent invocation | Step 4.2 instructs to invoke architect-doc agent with frontend context | ☐ |
| Output file specified | Step 4.2 specifies output as `docs/generated/frontend-architecture.md` | ☐ |
| Skip condition | Step 4.2 includes instruction to skip if no frontend detected | ☐ |

### AC4: Component hierarchy documentation with Mermaid

| Test Scenario | Validation Criteria | Status |
|--------------|-------------------|--------|
| Graph diagram present | Component Hierarchy section includes Mermaid `graph TD` | ☐ |
| Parent-child relationships | Diagram shows component parent-child relationships | ☐ |

### AC5: State management documentation with Mermaid

| Test Scenario | Validation Criteria | Status |
|--------------|-------------------|--------|
| Flowchart present | State Management section includes Mermaid `flowchart` | ☐ |
| Store structure | Diagram shows store structure and data flow | ☐ |

### AC6: Routing documentation

| Test Scenario | Validation Criteria | Status |
|--------------|-------------------|--------|
| Routing table format | Routing section includes table with: Route, Component (file:line), Guards/Middleware | ☐ |
| Route coverage | All routes are documented with their associated components | ☐ |

### AC7: Source references

| Test Scenario | Validation Criteria | Status |
|--------------|-------------------|--------|
| File:line references | All documented components include `file:line` references | ☐ |
| References from Grep | References extracted from Grep result file paths and line numbers | ☐ |

### AC8: No frontend handling

| Test Scenario | Validation Criteria | Status |
|--------------|-------------------|--------|
| Skip condition | Workflow skips document generation when no frontend files detected | ☐ |
| Scan state note | Scan state includes note about why document was skipped | ☐ |

---

## Test Execution Summary

| AC ID | Test Count | Passed | Failed | Blocked |
|-------|------------|--------|--------|---------|
| AC1 | 4 | 0 | 0 | 0 |
| AC2 | 5 | 0 | 0 | 0 |
| AC3 | 4 | 0 | 0 | 0 |
| AC4 | 2 | 0 | 0 | 0 |
| AC5 | 2 | 0 | 0 | 0 |
| AC6 | 2 | 0 | 0 | 0 |
| AC7 | 2 | 0 | 0 | 0 |
| AC8 | 2 | 0 | 0 | 0 |
| **TOTAL** | **23** | **0** | **0** | **0** |

**Overall Status**: ☐ PASS / ☐ FAIL

**Notes**:
- ATDD checklist created - all test scenarios defined
- Ready for dev-story implementation
- Tests will be executed during dev-story workflow
- CRITICAL: Template must be created at `scrum_workflow/templates/frontend-architecture.md` (NOT root `templates/`)

---

## TDD Red Phase: Validation Checklists Defined

✅ **ATDD Red Phase Complete for Skeleton Story**

- **Validation Type**: File structure + content validation (not traditional code tests)
- **Total Validation Scenarios**: 23
- **All validations**: Will FAIL until implementation complete
- **Implementation Required**: Template creation + agent verification + workflow verification

## Implementation Guidance (Green Phase)

**Files to Create:**
1. `scrum_workflow/templates/frontend-architecture.md` - Template with 6 required sections
2. Verify `scrum_workflow/agents/architect-doc.md` has frontend grep patterns (should exist from Story 7-1)
3. Verify `scrum_workflow/workflows/architecture-documentation.md` Step 4.2 exists (should exist from Story 7-2)

**Green Phase Trigger:**
After implementation, validations will pass:
- ✅ Template file exists at correct location
- ✅ All required sections present
- ✅ Grep patterns verified in agent
- ✅ Workflow step verified
- ✅ Mermaid syntax valid

**Critical Bug Prevention (from Story 7-3):**
- Story 7-3 had template at wrong path: `templates/backend-architecture.md` instead of `scrum_workflow/templates/backend-architecture.md`
- Story 7-4 MUST create template directly at: `scrum_workflow/templates/frontend-architecture.md`

**Next: Run dev-story to implement feature and achieve GREEN phase**
