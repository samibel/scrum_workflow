# Reference Data

This directory contains reference data in YAML format.

## Purpose

Data files provide reference information used by workflows, such as estimation guidance, complexity metrics, and other lookup tables.

## Structure

Data files use YAML format for easy parsing and modification:

```yaml
# data-file-name.yaml
key:
  - item1
  - item2
  - item3
```

## Data Files

- **estimation-reference.yaml**: Story point estimation guidance and complexity factors
- **classification-rules.yaml**: Keywords and rules for the `story-classifier` skill (type + risk_level assignment)
- **dispatch-rules.yaml**: Dynamic agent-dispatch rules for `/scrum-refine-ticket`
- **epic-decomposition-rules.yaml**: Size heuristics (min/max/target stories per epic), clustering strategies, ordering rules, and output constraints used by the `epic-decomposer` agent during `/scrum-decompose-epics`

## Usage

Data files are loaded by workflows during execution to provide reference information for decision-making and estimation.
