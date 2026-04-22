/**
 * Pattern manifest JSON-Schema — TypeScript source.
 *
 * This is the authoritative literal-typed source for the schema. The sibling
 * `pattern.manifest.schema.json` is a data artifact shipped for runtime
 * consumers; its contents must mirror this const exactly (drift is guarded
 * by a structural-equality test in `__tests__/pattern.schema.test.ts`).
 *
 * Written as a single `as const satisfies JSONSchema` expression so that
 * `json-schema-to-ts`'s `FromSchema<typeof patternManifestSchema, ...>` can
 * derive a narrow, load-bearing type — a JSON-module import widens string
 * literals (`"object"`, `"array"`, pattern strings) to `string`, which
 * causes `FromSchema` to emit a permissive shape that cannot enforce
 * Pattern↔Schema parity.
 *
 * **Zero runtime behavior beyond object construction.** This module exports
 * a single `const` object and no functions.
 *
 * @module contracts/schemas/pattern.manifest.schema
 */

import type { JSONSchema } from "json-schema-to-ts";

const SEMVER_PATTERN =
  "^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$";
const KEBAB_NAME_PATTERN = "^[a-z0-9][a-z0-9-]{0,63}$";
const REL_PATH_PATTERN =
  "^(?!\\/)(?!.*\\.\\.\\/)(?!.*\\/\\.\\.)(?!.*\\/\\.\\.$)(?!.*\\/\\.\\.[^/])(?![^/]*\\.\\.\\.)(?![^/]*\\.\\.$)[^\\\\]+$";

export const patternManifestSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://scrum-workflow.dev/schemas/pattern.manifest.schema.json",
  title: "Pattern Manifest",
  description:
    "Kernel Pattern runtime manifest contract (not the generic design-pattern concept). This schema validates on-disk pattern manifests, establishing the type foundation for the pattern runtime. Zero runtime code, zero I/O, pure declarations.\n\n## Glossary (Project-Native Terminology)\n\n- **Pattern**: A reusable workflow template with typed inputs, phases, gates, artifacts, hooks, and binds.\n- **Phase**: A discrete execution step within a pattern's lifecycle.\n- **Gate**: A validation checkpoint that must pass before phase execution.\n- **Artifact**: A tangible output produced by pattern execution.\n- **Hook**: A lifecycle callback invoked by the runtime at deterministic points.\n- **Bind**: A named dependency injection point, enabling composition between patterns.\n- **Manifest**: The declarative specification file that defines a pattern's contract.\n- **Schema Version**: Meta-versioning field tracking the manifest schema shape itself.\n- **Migration**: A declarative data migration strategy for evolving pattern state.\n\n## Security Invariants\n\nThis schema enforces trust boundaries through the following constraints:\n\n### Path Confinement\nEvery path-bearing field (`migrations[].path`, `tests[].path`, `artifacts[].path`) rejects:\n- Absolute paths (starting with `/`)\n- Directory traversal sequences (`../`)\n- Windows backslashes (`\\`)\n- Length > 512 characters\n\n### SemVer Integrity\n- `version` and `schemaVersion` match canonical SemVer 2.0.0 regex\n- ASCII-only characters (forecloses homograph attacks on hot-swap pinning)\n\n### Name Integrity\n- `name` pattern: `^[a-z0-9][a-z0-9-]{0,63}$`\n- Same pattern applies to bind names in `binds.declares` and `binds.override`\n\n### External $ref Resolution Policy\n- Only `#/...` internal JSON-Pointer refs are resolved\n- External refs (`file://`, `http://`, `https://`) are rejected by the loader's Ajv instance via `loadSchema: deny-all`\n\n### Size Caps\n- Root: `maxProperties: 20`\n- Arrays: `maxItems: 100`\n- Strings: `maxLength: 1024` (per-field overrides where tighter)\n\n### Ajv Configuration (Loader-Side Contract)\n- `strict: true`\n- `$data: false`\n- `loadSchema: deny-all`\n- Ajv pinned to ^8.17.1 to avoid earlier strict-mode bypass advisories\n\n### JSON Parser Strictness\n- Duplicate top-level keys must fail at parse time, before schema validation\n",
  type: "object",
  maxProperties: 20,
  required: ["schemaVersion", "name", "version", "phases", "hooks", "binds"],
  properties: {
    schemaVersion: {
      type: "string",
      description:
        "Meta-versioning field for the manifest schema shape itself. Bumped per semantic versioning: Major = breaking changes, Minor = additive changes, Patch = clarifications only. Initial value: '1.0.0'",
      pattern: SEMVER_PATTERN,
      maxLength: 64,
    },
    name: {
      type: "string",
      description: "Pattern name. Must be kebab-case: lowercase alphanumeric with hyphens, 1-64 characters.",
      pattern: KEBAB_NAME_PATTERN,
      minLength: 1,
      maxLength: 64,
    },
    version: {
      type: "string",
      description: "Pattern version. Must be valid SemVer 2.0.0 (ASCII-only).",
      pattern: SEMVER_PATTERN,
      maxLength: 64,
    },
    inputs: {
      type: "array",
      description:
        "Input parameter declarations. Each entry is a documentation-only descriptor; runtime validation is not enforced at the schema layer.",
      maxItems: 100,
      items: {
        type: "object",
        additionalProperties: true,
      },
    },
    phases: {
      type: "array",
      description: "Execution phases. Required for executable patterns.",
      minItems: 1,
      maxItems: 100,
      items: {
        type: "object",
        required: ["name"],
        additionalProperties: false,
        properties: {
          name: {
            type: "string",
            description: "Phase name (kebab-case).",
            pattern: KEBAB_NAME_PATTERN,
            minLength: 1,
            maxLength: 64,
          },
          description: {
            type: "string",
            description: "Optional phase description.",
            maxLength: 1024,
          },
        },
        unevaluatedProperties: false,
      },
    },
    gates: {
      type: "array",
      description: "Validation gates. Optional.",
      maxItems: 100,
      items: {
        type: "object",
        required: ["name"],
        additionalProperties: false,
        properties: {
          name: {
            type: "string",
            description: "Gate name (kebab-case).",
            pattern: KEBAB_NAME_PATTERN,
            minLength: 1,
            maxLength: 64,
          },
          description: {
            type: "string",
            description: "Optional gate description.",
            maxLength: 1024,
          },
        },
        unevaluatedProperties: false,
      },
    },
    artifacts: {
      type: "array",
      description: "Output artifacts. Optional.",
      maxItems: 100,
      items: {
        type: "object",
        required: ["name", "path"],
        additionalProperties: false,
        properties: {
          name: {
            type: "string",
            description: "Artifact name (kebab-case).",
            pattern: KEBAB_NAME_PATTERN,
            minLength: 1,
            maxLength: 64,
          },
          path: {
            type: "string",
            description:
              "Artifact path (relative, no traversal). Rejects .. as any segment, absolute paths, and backslashes.",
            pattern: REL_PATH_PATTERN,
            minLength: 1,
            maxLength: 512,
          },
          description: {
            type: "string",
            description: "Optional artifact description.",
            maxLength: 1024,
          },
        },
        unevaluatedProperties: false,
      },
    },
    hooks: {
      type: "object",
      description:
        "Lifecycle hooks. Fixed-property object with closed HookName union. String values are resolved by loader; imperative composition structurally foreclosed.",
      additionalProperties: false,
      properties: {
        onLoad: { type: "string", description: "Invoked when pattern is loaded into memory." },
        beforePlan: { type: "string", description: "Invoked before planning phase execution." },
        afterPlan: { type: "string", description: "Invoked after planning phase execution." },
        beforeExecute: { type: "string", description: "Invoked before execution phase." },
        afterExecute: { type: "string", description: "Invoked after execution phase." },
        beforePublish: {
          type: "string",
          description: "Invoked before publishing results (hot-swap boundary).",
        },
        afterPublish: {
          type: "string",
          description: "Invoked after publishing results (hot-swap boundary).",
        },
      },
    },
    binds: {
      type: "object",
      description: "Bind declarations. Satisfies EP-001's bind-collision contract.",
      required: ["declares"],
      additionalProperties: false,
      properties: {
        declares: {
          type: "array",
          description: "Bind names declared by this pattern. Must be kebab-case.",
          minItems: 0,
          maxItems: 100,
          items: {
            type: "string",
            pattern: KEBAB_NAME_PATTERN,
            minLength: 1,
            maxLength: 64,
          },
        },
        override: {
          type: "array",
          description: "Optional: Bind names to override from dependencies. Must be kebab-case.",
          minItems: 0,
          maxItems: 100,
          items: {
            type: "string",
            pattern: KEBAB_NAME_PATTERN,
            minLength: 1,
            maxLength: 64,
          },
        },
      },
    },
    config_schema: {
      description: "JSON Schema for user configuration. Optional.",
      type: "object",
      additionalProperties: true,
    },
    migrations: {
      type: "array",
      description: "Migration declarations. Optional.",
      maxItems: 100,
      items: {
        type: "object",
        required: ["version", "strategy"],
        additionalProperties: false,
        properties: {
          version: {
            type: "string",
            description: "Migration version (SemVer).",
            pattern: SEMVER_PATTERN,
            maxLength: 64,
          },
          strategy: {
            type: "string",
            description: "Migration strategy.",
            enum: ["noop", "script", "manual"],
          },
          path: {
            type: "string",
            description:
              "Path to migration script (required for 'script' strategy). Rejects .. as any segment, absolute paths, and backslashes.",
            pattern: REL_PATH_PATTERN,
            minLength: 1,
            maxLength: 512,
          },
          instructions: {
            type: "string",
            description: "Human-readable instructions (required for 'manual' strategy).",
            maxLength: 1024,
          },
          description: {
            type: "string",
            description: "Optional migration description.",
            maxLength: 1024,
          },
        },
        unevaluatedProperties: false,
        if: {
          properties: {
            strategy: { const: "script" },
          },
          required: ["strategy"],
        },
        then: {
          required: ["path"],
        },
        else: {
          if: {
            properties: {
              strategy: { const: "manual" },
            },
            required: ["strategy"],
          },
          then: {
            required: ["instructions"],
          },
        },
      },
    },
    tests: {
      type: "array",
      description: "Test declarations. Optional.",
      maxItems: 100,
      items: {
        type: "object",
        required: ["name", "path"],
        additionalProperties: false,
        properties: {
          name: {
            type: "string",
            description: "Test name (kebab-case).",
            pattern: KEBAB_NAME_PATTERN,
            minLength: 1,
            maxLength: 64,
          },
          path: {
            type: "string",
            description:
              "Path to test file (relative, no traversal). Rejects .. as any segment, absolute paths, and backslashes.",
            pattern: REL_PATH_PATTERN,
            minLength: 1,
            maxLength: 512,
          },
          description: {
            type: "string",
            description: "Optional test description.",
            maxLength: 1024,
          },
        },
        unevaluatedProperties: false,
      },
    },
  },
  additionalProperties: false,
} as const satisfies JSONSchema;

export type PatternManifestSchema = typeof patternManifestSchema;
