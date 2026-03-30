# ATDD Checklist - Story 7.3: Backend Architecture Analysis

**Generated**: 2026-03-30
**Story**: 7-3-backend-architecture-analysis-and-generation
**Status**: Ready for Dev

## Acceptance Criteria Test Scenarios

### AC1: Template file exists at correct location

| Test Scenario | Validation Criteria | Status |
|--------------|-------------------|--------|
| Template file exists | `scrum_workflow/templates/backend-architecture.md` file exists | ☐ |
| Required sections present | File contains: Overview, API Endpoints, Event System, Scheduled Tasks, Middleware Pipeline, Service Layer, Database Access Layer | ☐ |
| Template is valid Markdown | File is readable Markdown with proper syntax | ☐ |

### AC2: Grep patterns for backend components

| Test Scenario | Validation Criteria | Status |
|--------------|-------------------|--------|
| API endpoint patterns | architect-doc agent Instructions includes patterns for: `@Get`, `@Post`, `@Put`, `@Delete`, `router.get`, `router.post`, `app.use`, `@RequestMapping`, `@Controller` | ☐ |
| Event system patterns | architect-doc agent Instructions includes patterns for: `EventEmitter`, `@EventHandler`, `emit`, `on`, `subscribe`, `publish`, `queue`, `topic`, `exchange`, `channel` | ☐ |
| Scheduler patterns | architect-doc agent Instructions includes patterns for: `@Scheduled`, `cron`, `setInterval`, `agenda`, `bull`, `schedule` | ☐ |
| Middleware patterns | architect-doc agent Instructions includes patterns for: `middleware`, `interceptor`, `guard`, `filter`, `pipe`, `@UseGuards`, `@UseInterceptors` | ☐ |
| Service layer patterns | architect-doc agent Instructions includes patterns for: `@Service`, `@Injectable`, `@Component`, `Provider`, `Repository` | ☐ |
| Database access patterns | architect-doc agent Instructions includes patterns for: `@Entity`, `@Table`, `Schema`, `migration`, `sequelize`, `prisma`, `typeorm` | ☐ |

### AC3: Backend analysis orchestration in workflow

| Test Scenario | Validation Criteria | Status |
|--------------|-------------------|--------|
| Step 4.1 exists | `architecture-documentation.md` workflow has Step 4.1: Backend Architecture Analysis | ☐ |
| Agent invocation | Step 4.1 instructs to invoke architect-doc agent with backend context | ☐ |
| Output file specified | Step 4.1 specifies output as `docs/generated/backend-architecture.md` | ☐ |

### AC4: API endpoint documentation

| Test Scenario | Validation Criteria | Status |
|--------------|-------------------|--------|
| API endpoint format | Generated doc includes: HTTP Method, Path, Controller (file:line), Description | ☐ |
| Request/response types | If discoverable from code, includes request/response type information | ☐ |
| Grouping by domain | API endpoints are grouped by resource/domain (e.g., "Authentication", "Users") | ☐ |

### AC5: Event system documentation with Mermaid

| Test Scenario | Validation Criteria | Status |
|--------------|-------------------|--------|
| Sequence diagram present | Event System section includes Mermaid `sequenceDiagram` | ☐ |
| Participants shown | Diagram shows publishers and subscribers | ☐ |
| Message flow | Diagram shows event/message flow between components | ☐ |

### AC6: Middleware pipeline documentation with Mermaid

| Test Scenario | Validation Criteria | Status |
|--------------|-------------------|--------|
| Flowchart present | Middleware Pipeline section includes Mermaid `flowchart LR` | ☐ |
| Request processing chain | Diagram shows the request processing flow through middleware | ☐ |

### AC7: Service layer documentation with Mermaid

| Test Scenario | Validation Criteria | Status |
|--------------|-------------------|--------|
| Graph present | Service Layer section includes Mermaid `graph TD` | ☐ |
| Service dependencies | Diagram shows service dependencies and relationships | ☐ |

### AC8: Source references

| Test Scenario | Validation Criteria | Status |
|--------------|-------------------|--------|
| File:line references | All documented components include `file:line` references | ☐ |
| References from Grep | References extracted from Grep result file paths and line numbers | ☐ |

### AC9: Grouping by domain

| Test Scenario | Validation Criteria | Status |
|--------------|-------------------|--------|
| API endpoint grouping | API endpoints grouped by resource/domain based on file paths | ☐ |
| Logical organization | Groups follow logical domain boundaries (e.g., "Authentication", "Users", "Billing") | ☐ |

### AC10: Language-agnostic analysis

| Test Scenario | Validation Criteria | Status |
|--------------|-------------------|--------|
| Multiple frameworks supported | Grep patterns work across Express, NestJS, Spring Boot, Django, FastAPI, Rails | ☐ |
| No AST parsing | Implementation uses Glob+Grep only, not language-specific parsing | ☐ |

---

## Test Execution Summary

| AC ID | Test Count | Passed | Failed | Blocked |
|-------|------------|--------|--------|---------|
| AC1 | 3 | 0 | 0 | 0 |
| AC2 | 6 | 0 | 0 | 0 |
| AC3 | 3 | 0 | 0 | 0 |
| AC4 | 3 | 0 | 0 | 0 |
| AC5 | 3 | 0 | 0 | 0 |
| AC6 | 2 | 0 | 0 | 0 |
| AC7 | 2 | 0 | 0 | 0 |
| AC8 | 2 | 0 | 0 | 0 |
| AC9 | 2 | 0 | 0 | 0 |
| AC10 | 2 | 0 | 0 | 0 |
| **TOTAL** | **28** | **0** | **0** | **0** |

**Overall Status**: ☐ PASS / ☐ FAIL

**Notes**:
- ATDD checklist created - all test scenarios defined
- Ready for dev-story implementation
- Tests will be executed during dev-story workflow

---

## TDD Red Phase: Validation Checklists Defined

✅ **ATDD Red Phase Complete for Skeleton Story**

- **Validation Type**: File structure + content validation (not traditional code tests)
- **Total Validation Scenarios**: 28
- **All validations**: Will FAIL until implementation complete
- **Implementation Required**: Template creation + agent updates + workflow implementation

## Implementation Guidance (Green Phase)

**Files to Create:**
1. `scrum_workflow/templates/backend-architecture.md` - Template with 7 required sections
2. Update `scrum_workflow/agents/architect-doc.md` - Add backend grep patterns
3. Update `scrum_workflow/workflows/architecture-documentation.md` - Implement Step 4.1

**Green Phase Trigger:**
After implementation, validations will pass:
- ✅ Template file exists
- ✅ All required sections present
- ✅ Grep patterns added to agent
- ✅ Workflow step implemented
- ✅ Mermaid syntax valid

**Next: Run dev-story to implement feature and achieve GREEN phase**
