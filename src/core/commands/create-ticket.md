---
name: create-ticket
trigger: "/scrum-create-ticket"
requires_status: null
sets_status: draft
spawns_agents: []
---

## Purpose

Create a structured story file from a natural language idea using a spec-first approach. The command takes a ticket number and description, evaluates input quality, loads project context, generates a structured story with acceptance criteria, produces an initial estimation, and writes the complete story file to the sprint folder. This is the entry point to the story lifecycle state machine -- no development begins until a spec exists.

## Workflow Reference

workflows/ticket-creation.md

## Input

Ticket number and natural language description in the format: `/scrum-create-ticket SW-XXX "description of the feature or change" [--depth light|standard|heavy]`

- **Ticket number**: `SW-XXX` format where XXX is a zero-padded 3-digit number (e.g., `SW-001`, `SW-042`, `SW-103`)
- **Description**: Natural language string describing the feature, change, or requirement
- **--depth flag** (optional): Workflow depth override — takes precedence over automatic depth auto-assignment
  - `--depth light`: Lightweight process (1 agent, no cross-talk, no synthesis, single estimate)
  - `--depth standard`: Full process (3 agents, cross-talk, synthesis, Wideband Delphi)
  - `--depth heavy`: Maximum rigor process (3 agents, max cross-talk rounds with no early exit, synthesis, Wideband Delphi, mandatory security note)
  - If no `--depth` flag is provided, depth is auto-selected by the adaptive-depth-selector based on risk classification (default fallback: `standard`)

## Story Classification

After generating the story description and domain tags, invoke the **story-classifier** skill to automatically classify the story by type and risk level.

**Classifier invocation:** Load `scrum_workflow/skills/story-classifier/SKILL.md` and execute the classification algorithm against the generated story description and domain_tags array.

**Classification integration steps:**
1. Pass the story description text and `domain_tags` array to the story-classifier skill
2. The classifier analyzes keywords, domain tags, and content heuristics
3. The classifier returns structured results: `type`, `risk_level`, `classification_confidence`, `classification_note`
4. Populate the story frontmatter fields:
   - `type:` assigned by classifier (one of: feature, bugfix, refactor, infrastructure) — type is inferred from description keywords and classified automatically
   - `risk_level:` assigned by classifier (one of: low, medium, high, critical) — risk_level is assigned based on domain tags and content analysis, classified automatically
   - `classification_confidence:` confidence level from classifier (high, medium, low)
5. When `classification_confidence` is `low`, add a note in the story body below the description: "Classification auto-assigned with low confidence. Please review type and risk_level."

**Reference:** Classification rules are defined in `scrum_workflow/data/classification-rules.yaml`. The classifier skill spec is at `scrum_workflow/skills/story-classifier/SKILL.md`.

## Adaptive Depth Selection

After story classification populates the `risk_level` field, invoke the **adaptive-depth-selector** skill to automatically select the workflow depth based on risk classification.

**Override precedence:** `--depth` flag > adaptive depth selector > default (`standard`).

**Depth selection integration steps:**

1. **If `--depth` flag is provided:** Skip the adaptive-depth-selector entirely. Use the flag value directly. Set `depth_source: adaptive-workflow-override`. The `--depth` flag takes precedence over automatic depth selection.
2. **If no `--depth` flag is provided:** Load `scrum_workflow/skills/adaptive-depth-selector/SKILL.md` and execute the threshold lookup algorithm:
   a. The classifier has already populated `risk_level` in the story frontmatter
   b. The depth selector reads `risk_level` from the frontmatter and loads `workflow_depth_thresholds` from `config.yaml`
   c. The depth selector returns: `depth`, `depth_source: classifier`, and `selection_reason`
3. **Console notification:** Inform the developer of the auto-selected depth with a console message: `"Depth auto-selected: {depth} (risk: {risk_level})"`  
   Example: `"Depth auto-selected: heavy (risk: high)"`
4. Populate the story frontmatter fields:
   - `depth:` the selected depth value (one of: light, standard, heavy)
   - `depth_source:` how depth was determined — `classifier` for automatic selection, `adaptive-workflow-override` for manual `--depth` flag

**Fallback:** If no `--depth` flag is provided and no classifier result is available (e.g., risk_level missing), default to `depth: standard` with `depth_source: default`.

**Reference:** The adaptive-depth-selector skill spec is at `scrum_workflow/skills/adaptive-depth-selector/SKILL.md`. Threshold configuration is in `scrum_workflow/config.yaml` under `workflow_depth_thresholds`.

## Output

- `_scrum-output/sprints/SW-XXX/story.md` -- Structured story file with valid YAML frontmatter (`schema_version: "1.0.0"`, `ticket: SW-XXX`, `title: "<generated title>"`, `status: draft`, `depth: <light|standard|heavy>`, `depth_source: <classifier|adaptive-workflow-override|default>`, `type: <inferred and classified by story-classifier>`, `risk_level: <assigned and classified by story-classifier>`, `classification_confidence: <high|medium|low from classifier>`, `domain_tags: <array>`, `estimation: <calculated>`, `created: <ISO 8601 UTC>`, `updated: <ISO 8601 UTC>`, `status_history: [{from: null, to: draft, timestamp: <ISO 8601 UTC>, trigger: /scrum-create-ticket, actor: human}]`) and a Markdown body containing a generated description, acceptance criteria in Given/When/Then format, and subtasks. The `type` field is inferred by the story-classifier from description keywords. The `risk_level` field is assigned by the story-classifier from domain tags and content analysis. The `classification_confidence` field indicates the classifier's certainty level. The `depth` field is set by the adaptive-depth-selector or the `--depth` flag. The `depth_source` field records whether depth was auto-selected (`classifier`), manually overridden (`adaptive-workflow-override`), or a legacy fallback (`default`).

## Error Handling

### Low Confidence Classification Note

When the story-classifier returns `classification_confidence: low`, the create-ticket command adds a note in the story body:

```
> **Note:** Classification auto-assigned with low confidence. Please review type and risk_level.
```

This is not an error — it is a guidance note to help the developer review and potentially override the automatically assigned classification.

### Invalid Depth Value

If `--depth` is provided with an invalid value (not `light`, `standard`, or `heavy`):

```
❌ Invalid Depth Value: '--depth <value>' is not valid

**Details:** The --depth flag accepts only 'light', 'standard', or 'heavy'. Received: '<value>'.

**Next Step:** Use --depth light, --depth standard, or --depth heavy (or omit --depth to use automatic depth selection based on risk classification).
```

### Status Guard Violation

If story file already exists for the ticket number:

```
❌ Status Guard Violation: Story file '_scrum-output/sprints/SW-XXX/story.md' already exists

**Details:** The /scrum-create-ticket command can only create new stories. A story file for this ticket number already exists and cannot be overwritten.

**Next Step:** Delete the existing story file first, or use a different ticket number. If you want to continue working on SW-XXX, use the appropriate command for its current status.
```

## Write Boundary Rules

This workflow may write:
- `_scrum-output/sprints/SW-XXX/story.md` - New file only (`status: draft`); MUST NOT overwrite an existing story.md — halt with Status Guard Violation if the story file already exists

This workflow may NOT write:
- `_scrum-output/sprints/SW-XXX/refinement.md` - Managed by `/scrum-refine-ticket`
- `_scrum-output/sprints/SW-XXX/plan.md` - Managed by `/scrum-refine-story`
- `_scrum-output/sprints/SW-XXX/review-*.md` - Managed by `/scrum-review-story`
- `_scrum-output/sprints/SW-XXX/approval-N.md` - Managed by `/scrum-approve`
- Source code files in project directory - No code creation during ticket creation
- `scrum_workflow/` - Framework files are read-only during execution

### Anti-Pattern Warning

**Bounded Authority Violation:** This command MUST NOT overwrite an existing story.md. If a story file already exists for the given ticket number, halt immediately and report the violation to the user.

If a write boundary would be violated, halt with:
```
❌ Write Boundary Violation: /scrum-create-ticket attempted to write '{file_path}'

**Details:** The /scrum-create-ticket command may only create new story files. Attempted write target is outside the allowed boundary.

**Next Step:** Halt immediately. Do not write the file. Report this boundary violation to the user.
```
