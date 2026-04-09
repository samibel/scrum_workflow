---
name: adaptive-depth-selector
role: "workflow-depth-selector"
description: "Reads story risk_level from frontmatter and workflow_depth_thresholds from config.yaml to automatically select workflow depth (light, standard, heavy) for adaptive process rigor"
---

# Identity

The adaptive-depth-selector skill is a read-only skill that reads `risk_level` from the story YAML frontmatter and `workflow_depth_thresholds` from `config.yaml`, then returns the selected workflow depth. It is invoked internally by the `/scrum-create-ticket` command after the story-classifier has populated the `risk_level` field. The depth selector never writes files directly. The calling workflow (create-ticket) is responsible for writing the depth selection results into the story's YAML frontmatter.

This skill implements FR-33 (automatic workflow depth selection based on risk classification) and FR-36 (configurable risk thresholds in config.yaml).

**Valid depth values:** `light`, `standard`, `heavy`
**Valid depth_source values:** `classifier` (auto-selected), `adaptive-workflow-override` (developer used --depth flag), `default` (legacy fallback)

# Instructions

## Threshold Lookup Algorithm

The depth selector uses a simple threshold lookup to map the story's `risk_level` to a workflow `depth` value.

### Step 1: Read risk_level from Story Frontmatter

Read the `risk_level` field from the story's YAML frontmatter. The risk_level is populated by the story-classifier skill (Story 9.1) and is one of: `low`, `medium`, `high`, `critical`.

### Step 2: Load Thresholds from config.yaml

Load the `workflow_depth_thresholds` section from `scrum_workflow/config.yaml`. This section contains the configurable risk-to-depth mapping:

```yaml
workflow_depth_thresholds:
  low: light
  medium: standard
  high: heavy
  critical: heavy
```

Developers can customize these thresholds to remap any risk_level to any valid depth value. For example, a team preferring faster cycles could remap `medium: light` to use lightweight process for medium-risk stories.

### Step 3: Map risk_level to depth

Look up the story's `risk_level` in the `workflow_depth_thresholds` mapping and return the corresponding depth value.

**Default risk-to-depth mapping:**
- `low` -> `light` (lightweight process for low-risk stories)
- `medium` -> `standard` (full standard process for medium-risk stories)
- `high` -> `heavy` (maximum rigor for high-risk stories)
- `critical` -> `heavy` (maximum rigor for critical-risk stories)

## Fallback Behavior

### When risk_level is Missing or Invalid

If the story's `risk_level` field is missing, empty, or contains an invalid value (not one of low/medium/high/critical), the depth selector defaults to `standard` depth. This is a safe default that provides balanced process rigor without over- or under-treating the story.

### When Threshold Config is Missing

If the `workflow_depth_thresholds` section is missing from `config.yaml`, the depth selector uses hardcoded default mappings: `low: light`, `medium: standard`, `high: heavy`, `critical: heavy`. This ensures the depth selector works even without explicit configuration.

# Output Format

Return a structured YAML result to the calling workflow:

```yaml
depth: standard              # One of: light, standard, heavy
depth_source: classifier     # One of: classifier, adaptive-workflow-override, default
selection_reason: "risk_level 'medium' mapped to 'standard' via workflow_depth_thresholds"
```

**Field descriptions:**
- `depth:` The selected workflow depth value based on the threshold lookup
- `depth_source:` How the depth was determined — `classifier` for automatic selection, `adaptive-workflow-override` for manual --depth flag, `default` for legacy fallback
- `selection_reason:` A human-readable explanation of why this depth was selected, useful for audit trails and developer transparency

# Context Rules

## Reads

- Story `risk_level` field from the story YAML frontmatter (provided by the calling workflow, populated by story-classifier)
- `workflow_depth_thresholds` section from `scrum_workflow/config.yaml`
- This skill is a read-only depth selector. It does not write files. It returns structured results to the calling workflow.

## Writes

This skill never writes files. It is a read-only selection capability that returns structured results to the orchestrating workflow (`/scrum-create-ticket`). The calling workflow is responsible for writing the `depth`, `depth_source`, and any selection metadata into the story file's YAML frontmatter.
