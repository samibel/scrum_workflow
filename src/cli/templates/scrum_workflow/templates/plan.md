---
schema_version: 1
ticket: "{{ticket_id}}"
title: "{{story_title}}"
status: "ready"
plan_date: "{{plan_date}}"
---

# Execution Plan: {{story_title}}

**Ticket:** {{ticket_id}}
**Status:** Ready for Implementation
**Created:** {{plan_date}}

## Overview

{{story_description_summary}}

## Implementation Summary

This plan guides the implementation of {{ticket_id}} based on the refined story specification. Subtasks are ordered by dependency, with prerequisites listed first.

## Subtasks

| # | Task | Subtask | Description | Dependencies | Source |
|---|------|---------|-------------|--------------|--------|
{{subtasks_table_rows}}

## Acceptance Criteria

{{acceptance_criteria_list}}

## Estimation

**Estimate:** {{estimation}}
**Confidence:** {{confidence_level}}

## Notes

- Follow the subtask order for implementation
- Resolve dependencies before proceeding to dependent tasks
- Reference the source agent/user for clarification on task origin
- Validate each acceptance criterion before marking story complete
- OX/UX board input is optional; include related tasks only when an OX/UX board link is provided in refinement
- Excalidraw draft links are optional supporting context; do not block planning if absent

## Readiness Check

**Passed:** {{readiness_check_date}}
**Validated By:** Readiness Check Skill
**All Checks Passed:**
- [x] Description present and meaningful
- [x] Acceptance criteria defined and testable
- [x] Estimation set and positive
- [x] Subtasks listed and actionable
