# Adaptive Depth Selector BDD Scenarios

## Story Reference

Story 9.2: Implement Adaptive Workflow Depth Selection

## Feature: Automatic Workflow Depth Selection Based on Risk Classification

### Scenario 1: Low-risk story gets light depth (AC1)

**Given** a story has been classified with `risk_level: low` by the story-classifier
**And** `workflow_depth_thresholds` in config.yaml maps `low: light`
**When** the adaptive-depth-selector skill is invoked
**Then** the selected depth is `light`
**And** `depth_source` is set to `classifier`
**And** a console message informs: "Depth auto-selected: light (risk: low)"

### Scenario 2: Medium-risk story gets standard depth (AC1)

**Given** a story has been classified with `risk_level: medium` by the story-classifier
**And** `workflow_depth_thresholds` in config.yaml maps `medium: standard`
**When** the adaptive-depth-selector skill is invoked
**Then** the selected depth is `standard`
**And** `depth_source` is set to `classifier`

### Scenario 3: High-risk story gets heavy depth (AC1)

**Given** a story has been classified with `risk_level: high` by the story-classifier
**And** `workflow_depth_thresholds` in config.yaml maps `high: heavy`
**When** the adaptive-depth-selector skill is invoked
**Then** the selected depth is `heavy`
**And** `depth_source` is set to `classifier`
**And** a console message informs: "Depth auto-selected: heavy (risk: high)"

### Scenario 4: Critical-risk story gets heavy depth (AC1)

**Given** a story has been classified with `risk_level: critical` by the story-classifier
**And** `workflow_depth_thresholds` in config.yaml maps `critical: heavy`
**When** the adaptive-depth-selector skill is invoked
**Then** the selected depth is `heavy`
**And** `depth_source` is set to `classifier`

### Scenario 5: Configurable thresholds allow custom mappings (AC2)

**Given** a developer has customized `workflow_depth_thresholds` in config.yaml to map `medium: light`
**And** a story has been classified with `risk_level: medium`
**When** the adaptive-depth-selector skill is invoked
**Then** the selected depth is `light` (per custom threshold)
**And** the developer can adjust process rigor per risk level

### Scenario 6: Missing threshold config uses hardcoded defaults (AC2)

**Given** `workflow_depth_thresholds` section is missing from config.yaml
**And** a story has been classified with `risk_level: high`
**When** the adaptive-depth-selector skill is invoked
**Then** the selected depth is `heavy` (hardcoded default: high -> heavy)

### Scenario 7: Developer override via --depth flag takes precedence (AC3, AC4)

**Given** a story has been classified with `risk_level: high` (auto-depth would be `heavy`)
**And** the developer provides `--depth light` flag
**When** the create-ticket command processes depth selection
**Then** the selected depth is `light` (override wins)
**And** `depth_source` is set to `adaptive-workflow-override`
**And** the adaptive-depth-selector is NOT invoked

### Scenario 8: Missing risk_level defaults to standard (AC1)

**Given** a story has no `risk_level` field (classifier did not run or field is empty)
**When** the adaptive-depth-selector skill is invoked
**Then** the selected depth is `standard` (safe default)
**And** `depth_source` is set to `default`

### Scenario 9: Heavy depth in refinement enables max rounds (AC1)

**Given** a story has `depth: heavy` in its frontmatter
**When** the refine-ticket command processes the story
**Then** 3 agents are spawned (Architect, Developer, QA)
**And** cross-talk runs for all `refinement_max_rounds` with NO early exit on consensus
**And** synthesis is enabled
**And** Wideband Delphi estimation is used
**And** a mandatory security consideration note is added to the refinement artifact

### Scenario 10: Console notification for auto-selected depth (AC3)

**Given** no `--depth` flag is provided
**And** the story has been classified with `risk_level: medium`
**When** depth is automatically selected as `standard`
**Then** a console message is displayed: "Depth auto-selected: standard (risk: medium)"
**And** `depth_source` is set to `classifier` in the story frontmatter
