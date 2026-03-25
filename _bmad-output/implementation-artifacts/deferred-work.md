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
