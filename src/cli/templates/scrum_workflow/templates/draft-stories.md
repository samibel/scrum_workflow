---
schema_version: "1.0.0"
parent_epic: "{{parent_epic_id}}"
parent_brief: "{{parent_brief_id}}"
draft_count: {{draft_count}}
created: "{{created_date}}"
updated: "{{updated_date}}"
drafts:
  - index: 1
    title: "{{draft_title_1}}"
    sw_id_suggestion: "{{sw_id_suggestion_1}}"
    type: "{{story_type_1}}"
    risk_level: "{{risk_level_1}}"
    domain_tags: {{domain_tags_1}}
    status: drafted
---

# Draft Stories for {{parent_epic_id}}

Candidate stories generated in parallel for epic **{{parent_epic_id}}**.
Each draft is a candidate — promote selected ones to tickets via:

```bash
/scrum-create-ticket <SW-XXX> --from-epic {{parent_epic_id}} --from-draft <index>
```

## Drafts

### Draft 1: {{draft_title_1}}

**Suggested Ticket ID:** `{{sw_id_suggestion_1}}`
**Type:** {{story_type_1}}
**Risk Level:** {{risk_level_1}}
**Domain Tags:** {{domain_tags_1}}

**Description:**

{{draft_description_1}}

**Candidate Acceptance Criteria:**

{{draft_acceptance_criteria_1}}

---

<!-- Additional drafts appended during Orchestrator-Worker synthesis. -->
