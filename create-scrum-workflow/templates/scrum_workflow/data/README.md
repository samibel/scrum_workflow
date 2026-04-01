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

## Planned Data Files

- **estimation-reference.yaml**: Story point estimation guidance and complexity factors

## Usage

Data files are loaded by workflows during execution to provide reference information for decision-making and estimation.
