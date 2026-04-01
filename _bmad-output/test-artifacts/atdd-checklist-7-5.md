# ATDD Checklist - Story 7.5: DevOps Architecture Analysis

**Generated**: 2026-03-30
**Story**: 7-5-devops-architecture-analysis-and-generation
**Status**: Ready for Dev

## Acceptance Criteria Test Scenarios

### AC1: Template file exists at correct location

| Test Scenario | Validation Criteria | Status |
|--------------|-------------------|--------|
| Template file exists | `scrum_workflow/templates/devops-architecture.md` file exists | ☐ |
| Required sections present | File contains: Overview, CI/CD Pipelines, Container Configuration, Orchestration (K8s), Infrastructure as Code, Monitoring & Observability | ☐ |
| Template is valid Markdown | File is readable Markdown with proper syntax | ☐ |
| Template at correct path | File is in `scrum_workflow/templates/` NOT root `templates/` (critical from Story 7-3 bug) | ☐ |

### AC2: Grep patterns for DevOps components

| Test Scenario | Validation Criteria | Status |
|--------------|-------------------|--------|
| CI/CD pipeline patterns | architect-doc agent Instructions includes patterns for: `.github/workflows/*.yml`, `.gitlab-ci.yml`, `Jenkinsfile`, `.circleci/config.yml`, `azure-pipelines.yml` | ☐ |
| Container configuration patterns | architect-doc agent Instructions includes patterns for: `Dockerfile`, `docker-compose.yml`, `.dockerignore` | ☐ |
| Kubernetes patterns | architect-doc agent Instructions includes patterns for: `deployment.yaml`, `service.yaml`, `ingress.yaml`, `configmap.yaml`, `helm/` | ☐ |
| Infrastructure as Code patterns | architect-doc agent Instructions includes patterns for: `.tf`, `Pulumi.yaml`, `cloudformation.yaml`, `cdk.json` | ☐ |
| Monitoring and observability patterns | architect-doc agent Instructions includes patterns for: `prometheus.yml`, `grafana/`, `datadog.yaml`, `sentry.properties` | ☐ |

### AC3: DevOps analysis orchestration in workflow

| Test Scenario | Validation Criteria | Status |
|--------------|-------------------|--------|
| Step 4.3 exists | `architecture-documentation.md` workflow has Step 4.3: DevOps Architecture Analysis | ☐ |
| Agent invocation | Step 4.3 instructs to invoke architect-doc agent with DevOps context | ☐ |
| Output file specified | Step 4.3 specifies output as `docs/generated/devops-architecture.md` | ☐ |
| Skip condition | Step 4.3 includes instruction to skip if no DevOps detected | ☐ |

### AC4: CI/CD pipeline documentation with Mermaid

| Test Scenario | Validation Criteria | Status |
|--------------|-------------------|--------|
| Flowchart present | CI/CD Pipelines section includes Mermaid `flowchart LR` | ☐ |
| Pipeline stages | Diagram shows build → test → deploy stages | ☐ |

### AC5: Container setup documentation with Mermaid

| Test Scenario | Validation Criteria | Status |
|--------------|-------------------|--------|
| Graph present | Container Configuration section includes Mermaid `graph TD` | ☐ |
| Service dependencies | Diagram shows service dependencies from docker-compose | ☐ |

### AC6: Source references

| Test Scenario | Validation Criteria | Status |
|--------------|-------------------|--------|
| File:line references | All documented components include `file:line` references | ☐ |
| References from Grep | References extracted from Grep result file paths and line numbers | ☐ |

### AC7: No DevOps handling

| Test Scenario | Validation Criteria | Status |
|--------------|-------------------|--------|
| Skip condition | Workflow skips document generation when no DevOps files detected | ☐ |
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
| **TOTAL** | **21** | **0** | **0** | **0** |

**Overall Status**: ☐ PASS / ☐ FAIL

**Notes**:
- ATDD checklist created - all test scenarios defined
- Ready for dev-story implementation
- Tests will be executed during dev-story workflow
- CRITICAL: Template must be created at `scrum_workflow/templates/devops-architecture.md` (NOT root `templates/`)

---

## TDD Red Phase: Validation Checklists Defined

✅ **ATDD Red Phase Complete for Skeleton Story**

- **Validation Type**: File structure + content validation (not traditional code tests)
- **Total Validation Scenarios**: 21
- **All validations**: Will FAIL until implementation complete
- **Implementation Required**: Template creation + agent verification + workflow verification

## Implementation Guidance (Green Phase)

**Files to Create:**
1. `scrum_workflow/templates/devops-architecture.md` - Template with 6 required sections
2. Verify `scrum_workflow/agents/architect-doc.md` has DevOps grep patterns (should exist from Story 7-1)
3. Verify `scrum_workflow/workflows/architecture-documentation.md` Step 4.3 exists (should exist from Story 7-2)

**Green Phase Trigger:**
After implementation, validations will pass:
- ✅ Template file exists at correct location
- ✅ All required sections present
- ✅ Grep patterns verified in agent
- ✅ Workflow step verified
- ✅ Mermaid syntax valid

**Critical Bug Prevention (from Story 7-3):**
- Story 7-3 had template at wrong path: `templates/backend-architecture.md` instead of `scrum_workflow/templates/backend-architecture.md`
- Story 7-4 successfully created template at correct location: `scrum_workflow/templates/frontend-architecture.md`
- Story 7-5 MUST create template directly at: `scrum_workflow/templates/devops-architecture.md`

**Next: Run dev-story to implement feature and achieve GREEN phase**
