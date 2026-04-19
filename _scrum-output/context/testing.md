---
domain: testing
generated: "2026-04-19T00:00:00Z"
---

# Testing Context

## Test Frameworks

- **Unit**: Vitest ^3.0.0 (JavaScript/TypeScript)
- **Integration**: Vitest (same framework, integration tests in `create-scrum-workflow/test/integration/`)
- **E2E**: Not configured

## Coverage Strategy

- **Target**: Not explicitly configured (no coverage thresholds detected)
- **Tool**: Vitest built-in coverage (v8 provider)
- **Report Format**: Console output (default)

## CI Integration

- **Platform**: None detected (no CI/CD configuration files present)
- **Test Stage**: N/A
- **Trigger**: Manual (`npm test` / `vitest run`)

## Conventions

- Test files co-located in `test/` directories (unit/ and integration/ subdirectories)
- Spec files use `.spec.ts` extension in `tests/unit/`
- Test files use `.test.js` extension in `create-scrum-workflow/test/`
- Markdown-based test scenarios in `scrum_workflow/__tests__/` (`.test.md` files for research workflow validation)
- Mock file system via `memfs ^4.0.0` for installer tests
- ES modules (`"type": "module"` in package.json)
