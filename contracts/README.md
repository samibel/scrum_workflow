# @scrum-workflow/contracts

Pattern runtime contract type and manifest JSON-Schema for the Scrum Workflow framework.

## Layering Invariant

**This package is the bottom of the one-way layering:**

```
adapters → modules → patterns → kernel → contracts
```

### Source-Only Package

This is a **source-only package** — TypeScript types are consumed directly from `./src/index.ts`. No compiled JavaScript is emitted; consumers must have TypeScript in their build chain.

### Zero Runtime Code

This package contains **zero runtime code** and **zero I/O**.

- No JavaScript execution code
- No filesystem operations
- No network operations
- No side effects

Only pure TypeScript type declarations and a single JSON Schema file ship from this package.

### Pure Declarations

This package provides:

1. **TypeScript Types**: `Pattern`, `PatternHooks`, `PatternBinds`, and sub-types
2. **JSON Schema**: `pattern.manifest.schema.json` for validating on-disk manifests
3. **Type-Level Tests**: Compile-time assertions for type correctness

### What This Package Does NOT Contain

- No loader implementation
- No validator implementation
- No lifecycle execution
- No bind-collision enforcement
- No semantic validation

These capabilities are provided by upper layers (`kernel`, `patterns`, `modules`, `adapters`).

## Installation

```bash
npm install @scrum-workflow/contracts
```

## Usage

### TypeScript Types

```typescript
import type { Pattern, HookName, SemVerString } from "@scrum-workflow/contracts";

const manifest: Pattern = {
  schemaVersion: "1.0.0",
  name: "my-pattern",
  version: "1.0.0",
  phases: [{ name: "execute" }],
  hooks: {
    beforeExecute: "beforeExecute",
    afterExecute: "afterExecute",
  },
  binds: {
    declares: ["logger", "config"],
  },
};
```

### JSON Schema Validation

```typescript
import Ajv2020 from "ajv/dist/2020";
import addFormats from "ajv-formats";
import schema from "@scrum-workflow/contracts/schemas/pattern.manifest.schema.json";

const ajv = new Ajv2020({
  strict: true,
  strictSchema: false,
  strictRequired: false,
  loadSchema: () => { throw new Error("External $ref resolution denied"); }
});
addFormats(ajv);
const validate = ajv.compile(schema);

const manifest = { /* ... */ };
const isValid = validate(manifest);

if (!isValid) {
  console.error(validate.errors);
}
```

**Note:** Use `ajv/dist/2020` for draft-2020-12 support (required for `unevaluatedProperties`).

## Contract Fields

The Pattern manifest contract defines the following fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `schemaVersion` | `SemVerString` | Yes | Meta-versioning for manifest schema |
| `name` | `string` | Yes | Pattern name (kebab-case) |
| `version` | `SemVerString` | Yes | Pattern version (SemVer 2.0.0) |
| `inputs` | `array` | No | Input parameter declarations |
| `phases` | `PatternPhase[]` | Yes | Execution phases |
| `gates` | `PatternGate[]` | No | Validation gates |
| `artifacts` | `PatternArtifact[]` | No | Output artifacts |
| `hooks` | `PatternHooks` | Yes | Lifecycle hooks |
| `binds` | `PatternBinds` | Yes | Bind declarations |
| `config_schema` | `object` | No | JSON Schema for user config |
| `migrations` | `PatternMigration[]` | No | Migration declarations |
| `tests` | `PatternTest[]` | No | Test declarations |

## Security Invariants

This schema enforces trust boundaries at the validation layer:

### Path Confinement

- Rejects absolute paths (`/etc/passwd`)
- Rejects directory traversal (`../`)
- Rejects Windows backslashes (`\\`)
- Max length: 512 characters

### SemVer Integrity

- `version` and `schemaVersion` match SemVer 2.0.0
- ASCII-only (no homograph attacks)

### Name Integrity

- `name` pattern: `^[a-z0-9][a-z0-9-]{0,63}$`
- Same for bind names in `binds.declares` and `binds.override`

### External $ref Denial

- Only internal `#/...` JSON-Pointer refs allowed
- External refs (`file://`, `http://`, `https://`) rejected by loader

### Size Caps

- Root: max 20 properties
- Arrays: max 100 items
- Strings: max 1024 characters (per-field overrides)

## Hook Names (Closed Union)

The `hooks` field is a fixed-property object with a closed union of 7 hook names:

1. `onLoad` - When pattern is loaded into memory
2. `beforePlan` - Before planning phase execution
3. `afterPlan` - After planning phase execution
4. `beforeExecute` - Before execution phase
5. `afterExecute` - After execution phase
6. `beforePublish` - Before publishing results (hot-swap boundary)
7. `afterPublish` - After publishing results (hot-swap boundary)

**Deterministic ordering:** Hooks are invoked in the order listed above.

**Export name resolution:** Hook values are string export names resolved by the loader. This structurally forecloses imperative composition inside the manifest.

## Nominal Type Distinction

The `Pattern` type uses a unique-symbol brand (`__brand`) to ensure nominal distinctness from the `Module` contract, despite TypeScript's structural typing.

```typescript
// Compile-time error: Cannot assign Module to Pattern
const pattern: Pattern = moduleValue; // ❌ Type error

// Compile-time error: Cannot assign Pattern to Module
const module: Module = patternValue; // ❌ Type error
```

## Development

### Build

```bash
npm run build
```

Runs `tsc --noEmit` for type checking (no JS emit required).

### Test

```bash
npm test
```

Runs runtime schema validation tests via Vitest.

```bash
npm run test:runtime
```

## License

Private package for Scrum Workflow framework internal use.
