# Deferred Work

## Deferred from: code review of story 3-3 (2026-03-25)

- **User provides suggest-changes instead of accept/reject** [refinement.md:Step-10] - Deferred reason: Out of scope for current story, requires workflow enhancement to handle iterative feedback
- **Story 3.2 PARTIAL - No format preservation validation** [refinement.md:Step-10.3] - Deferred reason: Enhancement not blocker, can be added as validation step in future story
- **Missing concurrency protection** [refinement.md:Step-10] - Deferred reason: Out of scope for single-user workflow, multi-user concurrency not required by current architecture

## Deferred from: code review of story 2-1 (2026-03-25)

- Write boundary table in `standards.md` extends beyond architecture spec -- new table adds `approval.md` to "May NOT Write" columns for `/create-ticket`, `/refine-ticket`, and readiness check, but the source architecture document does not include `approval.md` in those rows. The addition is defensively correct but should be reconciled with architecture.
- No handling for ticket numbers exceeding SW-999 -- the `SW-XXX` format with 3-digit zero-padding has a ceiling at 999 tickets. No documented behavior or migration path exists for overflow.
- No concurrent status transition protection documented -- if two commands target the same story simultaneously, no locking or conflict resolution mechanism prevents race conditions on the `status` field.

## Deferred from: code review of 3-2-agent-perspectives-with-distinct-output (2026-03-25)

- [ ] **Fehlende Validierung für Agent-Output-Format** [scrum_workflow/workflows/refinement.md] - Pre-existing issue: Keine automatische Validierung des Agent-Output-Formats im Workflow. Empfehlung: Validierungs-Schritt im refinement-Workflow hinzufügen (zukünftige Story für automatische Qualitätsprüfung)

- [ ] **Token-Limit Validierung fehlt** [scrum_workflow/workflows/refinement.md] - Pre-existing issue: Keine Laufzeit-Validierung für Token-Limits (NFR11). Empfehlung: Token-Zähler nach Agent-Ausführung hinzufügen (zukünftige Story für NFR11 Compliance-Verbesserung)

## Deferred from: code review of story 6-1 (2026-03-30)

- ATDD Checklist execution commands use wrong working directory -- the `cd _bmad-output/test-artifacts && npx jest ...` commands in ATDD checklists break `process.cwd()`-based path resolution. Tests must be run from project root instead. Pre-existing pattern across all test suites (Stories 1-1 through 1-4 have the same issue). Recommendation: update ATDD checklist template to document correct invocation from project root.

## Deferred from: code review of story 5-4 (2026-03-28)

- Invalid platform code silently ignored in path-resolver.js -- if `config.platforms` contains a code not in the registry, no warning is emitted. Low risk since config comes from constrained multiselect, but a CLI override could bypass this.
- templateSourceDir not validated for existence before copySync -- if the npm package is published without `templates/scrum_workflow/`, copySync throws an unhandled error. Relevant to Story 5.9 npm distribution.
- Overwrite is additive, not clean-slate -- `copySync` does not remove stale files from a previous install. By design for Story 5.7 update flow, but the overwrite prompt may mislead users expecting a clean replacement.

## Deferred from: code review of story 7-1 (2026-03-30)

- **Token budget may be insufficient** [architect-doc.md:8] - Pre-existing: same pattern used in documentarian.md (Epic 6), max_tokens: 4000 is standard for documentation agents
- **Grep patterns are framework-specific** [architect-doc.md:22-27] - Pre-existing: patterns from technical research document (technical-agentic-project-documentation-patterns-research-2026-03-30.md), language-agnostic claim refers to no AST parsing not framework-agnostic patterns
- **No handling for circular dependencies in service diagrams** - Future enhancement for Mermaid generation, not blocking for initial implementation

## Deferred from: code review of story 7-3 (2026-03-30)

- IDE workspace file tracked [.idea/workspace.xml] — Pre-existing issue: IDE files should not be in version control. Recommendation: Add `.idea/` to `.gitignore`
- Research artifacts in settings [.claude/settings.local.json:10-17] — Pre-existing from research phase: WebFetch domain restrictions are research sandbox rules. Recommendation: Clean up local settings after research
- Epic planning file bloat [_bmad-output/planning-artifacts/epics.md] — Pre-existing file structure: 457 lines added for Epic 6 and 7 definitions. Recommendation: Consider modular structure for future epics

## Deferred from: code review of story 6-3 (2026-03-30)

- **Workflow adds `abort` guard pattern not in agent definition** [scrum_workflow/workflows/project-documentation.md:163] — Pre-existing spec inconsistency: Story 6.3 AC#1 lists `abort` as a guard clause pattern, but the documentarian agent definition (Story 6.1) only lists `throw`, `reject`, `deny`, `forbidden`, `unauthorized`. Recommendation: Reconcile agent definition and story spec in a future cleanup pass.
- **Template has 5 sections vs agent's 3 Required Sections** [scrum_workflow/templates/business-logic.md] — Pre-existing spec inconsistency: Agent Output Format lists 3 Required Sections (Business Rules, Validation Rules, Guard Clauses). Story 6.3 AC#2 adds Overview and Business Constants & Configuration. Story Dev Notes say "MUST match agent Output Format exactly" but ACs explicitly require the additional sections. Recommendation: Update agent Output Format to include all 5 sections for consistency.
- **Template section name mismatch: "Guard Clauses & Access Control" vs agent's "Guard Clauses"** [scrum_workflow/templates/business-logic.md] — Pre-existing spec divergence: Agent uses "Guard Clauses", template and story AC use "Guard Clauses & Access Control". Recommendation: Align naming in agent definition during next agent update.
- **`LIMIT_` constant pattern in workflow not in story AC** [scrum_workflow/workflows/project-documentation.md:165] — Minor addition: Workflow includes `LIMIT_` in business constants patterns beyond what story AC#1 explicitly lists (`MAX_`, `MIN_`, `ALLOWED_`, `STATUS_`). Not harmful but undocumented. Recommendation: Note in story AC or remove for strict compliance.

## Deferred from: code review of story 6-7-yolo (2026-03-30)

- **Fehlende Synchronisation bei Parallelisierung** [scrum_workflow/workflows/project-documentation.md] — Pre-existing architectural issue: Workflow does not specify whether scanning is parallel or sequential. Parallel scanning would introduce race conditions in incremental state update logic. Recommendation: Document execution model or add synchronization for future parallelization.
- **Keine Max-Size-Begrenzung für scan-state.json** [scrum_workflow/workflows/project-documentation.md] — Pre-existing scalability issue: For very large codebases (tens of thousands of files), the `files_scanned` array could become extremely large. No fallback or warning mechanism exists. Recommendation: Add file count check and warning threshold.
- **Fehlende Backward-Compatibility** [scrum_workflow/workflows/project-documentation.md] — Pre-existing architectural limitation: No version ID or schema version in `.scan-state.json`. Future format changes will break compatibility with old state files. Recommendation: Add `schema_version` field for future-proofing.
- **Keine Dokumentation von Race-Conditions** [scrum_workflow/workflows/project-documentation.md] — Pre-existing documentation gap: No explanation of behavior when two terminal windows scan simultaneously. State file could become corrupted. Recommendation: Add file locking or concurrent execution documentation.

## Deferred from: code review of story 8-3-yolo (2026-03-30)

- **IDE Workspace Datei im Version Control** [.idea/workspace.xml] — Pre-existing: IDE files should not be tracked in version control. Recommendation: Add `.idea/` to `.gitignore`
- **WebFetch Domain-Beschränkungen** [.claude/settings.local.json:11-17] — Pre-existing from research phase: WebFetch domain restrictions are research sandbox rules. Recommendation: Clean up local settings after research
- **Große Epics-Datei** [_bmad-output/planning-artifacts/epics.md] — Pre-existing file structure: Large file with Epic 6 & 7 definitions. Recommendation: Consider modular structure for future epics

## Deferred from: code review of 9-1-researcher-agent-definition (2026-03-30)

- **Installer template missing docs/research/ directory** [create-scrum-workflow/templates/scrum_workflow/] — Pre-existing gap: The researcher agent references `docs/research/technical-research-agent-patterns-2026-03-30.md` but the installer templates do not include a `docs/research/` directory. Will be addressed by Story 9.9 (installer integration).

## Deferred from: code review of 11-3-review-story-review-agent-ai-assisted-code-review (2026-04-01)

- **Inconsistent prerequisite status vs existing review.md** [scrum_workflow/workflows/review-story.md:17] — Pre-existing state machine inconsistency: New review-story workflow uses `status: review` as prerequisite, but existing review.md uses `status: in-dev` or `status: in-review`. Story 11.4 will address state machine documentation and reconciliation.

- **Missing deprecation note for existing review.md** [scrum_workflow/workflows/review.md] — Pre-existing relationship ambiguity: The new review-story.md workflow does not explicitly deprecate or reference the relationship to the existing review.md workflow. Requires broader discussion about Epic 11 migration path.
