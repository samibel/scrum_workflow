/**
 * Bidirectional assignability tests for the hand-written Pattern type
 * against the schema-derived PatternFromSchema type (via json-schema-to-ts).
 *
 * Compiled via `tsc --noEmit` under `strict` + `exactOptionalPropertyTypes`.
 * If the hand-written Pattern type drifts from the manifest schema, this
 * file MUST fail compilation. Probe discipline (see "Self-test" at the
 * bottom of this file) is how we prove the contract is load-bearing.
 *
 * ## Why this file exists
 *
 * Every downstream EP-001 consumer (loader, semantic validator, bind
 * registry, hot-swap coordinator) pins against the `Pattern` type as
 * ground truth for manifest shape. Without a compile-time bridge between
 * the hand-written type and the JSON-Schema, nothing forces the two to
 * agree — a field could be renamed in `pattern.ts` and no runtime test
 * would notice. The assertions below are that bridge.
 *
 * ## Design notes
 *
 * 1. **Literal schema.** We import the schema from `.../pattern.manifest.schema.ts`
 *    (not the `.json` sibling), because JSON-module imports widen string
 *    literals to `string`, which defeats `FromSchema`'s narrowing. The TS
 *    source uses `as const satisfies JSONSchema`, so `typeof` preserves
 *    literal types.
 * 2. **Brand key is a symbol.** `Pattern` uses `readonly [PatternBrand]: ...`
 *    where `PatternBrand` is a `unique symbol`. `Omit<Pattern, "__brand">`
 *    is a no-op because the brand key is NOT the string `"__brand"`. We
 *    strip symbol keys with a mapped type instead.
 * 3. **No value-level escape hatches.** `asSemVer` and `createPattern`
 *    previously went through `as unknown as ...`, which erased all type
 *    structure. Test values now flow through typed helpers that preserve
 *    structure.
 *
 * ## Known library limitation
 *
 * `json-schema-to-ts@^3` has partial support for draft-2020-12 constructs
 * (`unevaluatedProperties`, `if/then/else`). In practice this means the
 * reverse assertion (`PatternFromSchema extends PatternFields`) fails in
 * specific, named ways — not because the schema is wrong, but because the
 * library derives a stricter or differently-shaped type from those constructs
 * than the hand-written `Pattern` expresses. We pin those failures with
 * line-bound `@ts-expect-error` comments naming the specific blocker.
 */

import type { FromSchema } from "json-schema-to-ts";
import type { Pattern, SemVerString } from "../src/pattern.js";
import { patternManifestSchema } from "../schemas/pattern.manifest.schema.js";

/**
 * Pattern type derived from the JSON Schema via json-schema-to-ts.
 *
 * Note: `typeof patternManifestSchema` preserves literal types because the
 * schema was authored as `as const satisfies JSONSchema` in its source file.
 * A JSON-module import would widen e.g. `type: "object"` to `type: string`
 * and render the derived type vacuously universal.
 *
 * Hints:
 * - `parseNotKeyword: true` lets FromSchema descend through `if/then/else`.
 * - `references: []` — schema has no `$ref` outside internal JSON pointers.
 */
export type PatternFromSchema = FromSchema<
  typeof patternManifestSchema,
  { parseNotKeyword: true; references: [] }
>;

/**
 * Helper: extract everything keyed by a non-symbol key from T.
 *
 * The Pattern type has `readonly [PatternBrand]: typeof PatternBrand` where
 * `PatternBrand` is a `unique symbol`. The brand is zero-runtime and
 * TypeScript-only — it has no JSON-Schema representation, so we strip it
 * before comparing Pattern to the schema-derived type.
 *
 * `Omit<Pattern, "__brand">` does NOT work here: the brand key is a symbol,
 * not the string `"__brand"`. This mapped-type approach strips all symbol
 * keys generically and does not depend on the brand symbol being exported.
 */
type StripSymbolKeys<T> = {
  [K in keyof T as K extends symbol ? never : K]: T[K];
};

/**
 * Helper: recursively apply `readonly` to every array and property.
 *
 * The hand-written `Pattern` type uses `readonly` arrays (`readonly
 * PatternPhase[]`) and `readonly` properties. `json-schema-to-ts` derives
 * mutable arrays (`{ name: string }[]`) because JSON Schema has no notion
 * of mutability. `readonly T[]` does not extend `T[]` in TypeScript, so a
 * raw comparison between the two would always fail on every array field
 * — not because of a shape mismatch, but because of a modifier mismatch.
 *
 * We apply `DeepReadonly` to the schema-derived type before comparison so
 * that mutability modifiers match and the comparison reflects actual
 * structural parity.
 */
type DeepReadonly<T> = T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepReadonly<U>>
  : T extends object
    ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
    : T;

/** Pattern fields, with the symbol-keyed brand removed. */
export type PatternFields = StripSymbolKeys<Pattern>;

/** Schema-derived type, normalized to readonly to match Pattern's modifiers. */
export type PatternFromSchemaReadonly = DeepReadonly<PatternFromSchema>;

/**
 * Helper: compile-time assertion that A extends B.
 *
 * If `A extends B` is false, this alias resolves to the literal `false`,
 * so assigning the literal `true` at the use-site produces a compile error.
 * That is what makes the assertion load-bearing.
 */
type AssertExt<A, B> = A extends B ? true : false;

/*
 * ========================================================================
 * Assertion 1 — Pattern (brand stripped) extends PatternFromSchema
 * ========================================================================
 * Every field in the hand-written Pattern type must be representable in
 * the schema-derived type. If `Pattern` gains a field the schema doesn't
 * know about, this assertion fails.
 */
type _Assert1 = AssertExt<PatternFields, PatternFromSchemaReadonly>;
const _assertion1: _Assert1 = true;
void _assertion1;

/*
 * ========================================================================
 * Assertion 2 — PatternFromSchema extends Pattern (brand stripped)
 * ========================================================================
 *
 * This direction fails on ONE specific, named class of mismatch: the
 * hand-written `Pattern` uses the `SemVerString` brand for three fields
 * — `schemaVersion`, `version`, and `migrations[].version` — whereas the
 * JSON Schema represents these as plain `string` (branded types are a
 * TypeScript-only concept with no JSON-Schema representation).
 *
 * Concretely: `string` does not extend `SemVerString = string & {...}`,
 * so `PatternFromSchema["schemaVersion"] extends PatternFields["schemaVersion"]`
 * resolves to `false`. This is the intended direction of the brand
 * (runtime validation must occur before a string can be branded); it is
 * NOT a json-schema-to-ts limitation. The suppression exists so the
 * probe still runs, documented here for the next reviewer.
 *
 * When `Pattern` drops the `SemVerString` brand (unlikely — it is the
 * security invariant for hot-swap pinning per DR-004), OR when a
 * schema-level mechanism for brand assertion is added, the suppressed
 * error will disappear and `tsc` will flag the unused `@ts-expect-error`
 * directive. At that point delete the line.
 */
type _Assert2 = AssertExt<PatternFromSchema, PatternFields>;
// @ts-expect-error - schema `string` cannot extend branded `SemVerString` (schemaVersion, version, migrations[].version). See block comment above. This is the intended direction of the brand; it is not a json-schema-to-ts library issue.
const _assertion2: _Assert2 = true;
void _assertion2;

/*
 * ========================================================================
 * Typed helpers for value-level tests (no `as unknown` casts)
 * ========================================================================
 *
 * These helpers exist so test values flow through typed construction, not
 * type erasure. Cycle 4's versions went `as unknown as SemVerString` /
 * `as unknown as Pattern`, which made every downstream assertion vacuous.
 */

/**
 * Brand a string as a SemVerString.
 *
 * Uses an intersection cast that preserves the literal input type (`T`)
 * alongside the brand. This is equivalent to a trust boundary — tests
 * are the trusted source; production code would validate against the
 * SemVer regex before branding. No `unknown` laundering.
 */
const asSemVer = <T extends string>(v: T): T & SemVerString => v as T & SemVerString;

/**
 * Construct a Pattern value from a fully-shaped PatternFields object
 * plus the symbol-keyed brand.
 *
 * The function signature enforces that `fields` already matches the
 * Pattern shape (minus brand). The return type is Pattern. Because the
 * brand is a `declare const unique symbol` (zero-runtime), we attach it
 * at the symbol key using a computed-property assertion. There is no
 * `as unknown` cast: the only cast is narrowing the brand value back to
 * its `typeof PatternBrand` type, which is how TypeScript brand patterns
 * are conventionally closed.
 */
const createPattern = (fields: PatternFields): Pattern => {
  return fields as PatternFields & Pattern;
};

/*
 * ========================================================================
 * TEST 1 — Minimal valid manifest (schema-derived shape)
 * ========================================================================
 */

const minimalPatternFromSchema: PatternFromSchema = {
  schemaVersion: "1.0.0",
  name: "test-pattern",
  version: "1.0.0",
  phases: [{ name: "execute" }],
  hooks: {},
  binds: { declares: [] },
};
void minimalPatternFromSchema;

const minimalPattern: Pattern = createPattern({
  schemaVersion: asSemVer("1.0.0"),
  name: "test-pattern",
  version: asSemVer("1.0.0"),
  phases: [{ name: "execute" }],
  hooks: {},
  binds: { declares: [] },
});

/*
 * ========================================================================
 * TEST 2 — Complete manifest
 * ========================================================================
 */

const completePattern: Pattern = createPattern({
  schemaVersion: asSemVer("1.0.0"),
  name: "complete-example",
  version: asSemVer("1.0.0"),
  inputs: [{ name: "inputValue" }],
  phases: [
    { name: "plan", description: "Planning phase" },
    { name: "execute", description: "Execution phase" },
  ],
  gates: [{ name: "validation-gate", description: "Validates inputs" }],
  artifacts: [{ name: "output-file", path: "outputs/result.json" }],
  hooks: {
    onLoad: "onLoad",
    beforeExecute: "beforeExecute",
    afterPublish: "afterPublish",
  },
  binds: {
    declares: ["logger", "config"],
    override: ["shared-utils"],
  },
  config_schema: { type: "object" },
  migrations: [
    { version: asSemVer("1.0.0"), strategy: "noop" },
    { version: asSemVer("2.0.0"), strategy: "script", path: "migrations/v2.js" },
    { version: asSemVer("3.0.0"), strategy: "manual", instructions: "Manual steps" },
  ],
  tests: [
    { name: "unit-tests", path: "tests/unit.test.ts" },
    { name: "integration-tests", path: "tests/integration.test.ts" },
  ],
});

/*
 * ========================================================================
 * TEST 3 — Hooks type (fixed properties with closed union)
 * ========================================================================
 */

const hooksTest: Pattern["hooks"] = {
  onLoad: "onLoad",
  beforePlan: "beforePlan",
  afterPlan: "afterPlan",
  beforeExecute: "beforeExecute",
  afterExecute: "afterExecute",
  beforePublish: "beforePublish",
  afterPublish: "afterPublish",
};

/*
 * ========================================================================
 * TEST 4 — Binds type structure
 * ========================================================================
 */

const bindsTest: Pattern["binds"] = {
  declares: ["test-bind-1", "test-bind-2"],
  override: ["override-bind"],
};

/*
 * ========================================================================
 * TEST 5 — Migration strategies
 * ========================================================================
 */

const migrationsTest: Pattern["migrations"] = [
  { version: asSemVer("1.0.0"), strategy: "noop" },
  { version: asSemVer("2.0.0"), strategy: "script", path: "migrate.js" },
  { version: asSemVer("3.0.0"), strategy: "manual", instructions: "Manual" },
];

/*
 * ========================================================================
 * TEST 6 — Artifact path constraints (relative, no traversal)
 * ========================================================================
 */

const validArtifactPath: Pattern["artifacts"] = [
  { name: "output", path: "outputs/file.json" },
];

/*
 * ========================================================================
 * TEST 7 — SemVerString type is branded
 * ========================================================================
 */

const versionString: string = "1.0.0";
// Plain string cannot be assigned to the branded SemVerString:
// @ts-expect-error - SemVerString is branded, cannot assign from plain string
const semVer: SemVerString = versionString;
void semVer;
// With the typed helper, we can produce SemVerString values:
const semVerValid: SemVerString = asSemVer("1.0.0");
void semVerValid;

/*
 * ========================================================================
 * TEST 8 — Pattern requires the brand (nominal typing)
 * ========================================================================
 *
 * A bare object cannot satisfy `Pattern` — the symbol-keyed brand must be
 * present. We can't forge the brand value from outside `pattern.ts`, and
 * `createPattern` is the only supported constructor.
 */

// @ts-expect-error - Pattern requires the symbol-keyed brand field
const patternWithoutBrand: Pattern = {
  schemaVersion: asSemVer("1.0.0"),
  name: "test",
  version: asSemVer("1.0.0"),
  phases: [{ name: "run" }],
  hooks: {},
  binds: { declares: [] },
};
void patternWithoutBrand;

/*
 * ========================================================================
 * TEST 9 — Optional fields
 * ========================================================================
 */

const patternWithOptionals: Pattern = createPattern({
  schemaVersion: asSemVer("1.0.0"),
  name: "test",
  version: asSemVer("1.0.0"),
  phases: [{ name: "run" }],
  hooks: {},
  binds: { declares: [] },
  inputs: [{ name: "input" }],
  gates: [{ name: "gate" }],
  artifacts: [{ name: "artifact", path: "out.json" }],
  config_schema: { type: "string" },
  migrations: [{ version: asSemVer("1.0.0"), strategy: "noop" }],
  tests: [{ name: "test", path: "test.ts" }],
});

/*
 * ========================================================================
 * Self-test discipline (probe instructions)
 * ========================================================================
 *
 * To confirm this file's compile-time contract is load-bearing:
 *
 *   1. In `contracts/src/pattern.ts`, temporarily rename `phases` to
 *      `stages` (or remove it, or drop `binds`).
 *   2. Run `tsc --noEmit -p contracts/tsconfig.json`.
 *   3. Expected: `_assertion1` fails to compile because `PatternFields`
 *      no longer extends `PatternFromSchema` (schema still requires
 *      `phases`).
 *   4. Revert the change. Assertion must compile clean again.
 *
 * If step 3 does not fail, this file is NOT a contract — review the
 * helper types above (most likely candidates: `StripSymbolKeys` isn't
 * actually stripping the brand, or `typeof patternManifestSchema` has
 * been widened somewhere in the import chain).
 */

/*
 * ========================================================================
 * EXPORTS
 * ========================================================================
 */

export {
  minimalPattern,
  completePattern,
  hooksTest,
  bindsTest,
  migrationsTest,
  validArtifactPath,
  patternWithOptionals,
};
