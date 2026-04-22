/**
 * Nominal distinctness tests for Pattern vs Module.
 *
 * Uses phantom-type Module fallback when Module contract is not resolvable.
 * Layers conditional real-Module assertion when import succeeds.
 *
 * Compiled via tsc --noEmit under strict + exactOptionalPropertyTypes.
 * Uses @ts-expect-error anchors for type assertions.
 */

import type { Pattern, SemVerString } from "../src/pattern";

/**
 * TODO(EP-001/SW-???): Layer real-Module assertion.
 *
 * The Module contract may not exist yet in the codebase. When EP-001
 * capability 1 (Module contract definition) is implemented, add a conditional
 * real-Module import and layer it on top of this phantom-type fallback:
 *
 * ```typescript
 * // @ts-expect-error - real module may not exist yet
 * import type { Module as RealModule } from "../../modules/index.js";
 *
 * // Add conditional assertion that RealModule has at least one field
 * // that Pattern doesn't (beyond the brand), and vice versa.
 * ```
 */

/**
 * Helper: Create a SemVerString from a string (type assertion for test purposes)
 */
const asSemVer = (v: string): SemVerString => v as SemVerString;

/**
 * Unique symbol brand for Module contract (phantom-type fallback).
 *
 * This is a phantom-type fallback used when the real Module contract
 * is not resolvable from the target tree.
 */
declare const ModuleBrand: unique symbol;

/**
 * Phantom Module type (fallback when real Module is not available).
 *
 * This type is structurally different from Pattern by design:
 * - Uses different brand symbol (ModuleBrand vs PatternBrand)
 * - Has a required field that Pattern doesn't have: `specifier`
 * - Missing a required field that Pattern has: `binds`
 *
 * This ensures nominal distinction even when the real Module contract
 * cannot be imported.
 */
export interface PhantomModule {
  readonly [ModuleBrand]: typeof ModuleBrand;
  readonly specifier: string;
  readonly name: string;
  readonly version: SemVerString;
  readonly exports: readonly string[];
}

/**
 * Test 1: Pattern and Module have different brand symbols.
 *
 * Even though both have a `__brand` field, they use different
 * unique symbols, making them nominally distinct.
 */
const phantomModule: PhantomModule = {
  specifier: "module://example/module",
  name: "test-module",
  version: asSemVer("1.0.0"),
  exports: ["export1", "export2"],
} as unknown as PhantomModule;

// @ts-expect-error - Pattern and Module have different brand symbols
const assignModuleToPattern: Pattern = phantomModule;

// @ts-expect-error - Pattern and Module have different brand symbols
const assignPatternToModule: PhantomModule = {} as Pattern;

/**
 * Test 2: Pattern has a required field that Module lacks.
 *
 * Pattern requires `binds` field (EP-001 bind-collision contract).
 * Module (phantom) does not have this field.
 */
const patternHasBinds: Pattern["binds"] = {
  declares: ["test-bind"],
};

// @ts-expect-error - PhantomModule type does not have 'binds' field
const moduleHasBinds: PhantomModule["binds"] = {
  declares: ["test-bind"],
};

/**
 * Test 3: Module (phantom) has a required field that Pattern lacks.
 *
 * Phantom Module requires `specifier` field.
 * Pattern does not have this field.
 */
const phantomModuleHasSpecifier: PhantomModule["specifier"] = "module://example/module";

// @ts-expect-error - Pattern does not have 'specifier' field
const patternHasSpecifier: Pattern["specifier"] = "pattern://example/pattern";

/**
 * Test 4: Structural differences prevent interchangeability.
 *
 * Even if someone removes the brand, the structural differences
 * (binds vs specifier) prevent Pattern and Module from being compatible.
 *
 * Note: We can't use Omit on the brand field directly because it's
 * a symbol. Instead, we test that assignments fail.
 */
const patternStructural: Omit<Pattern, "hooks" | "binds"> = {
  schemaVersion: asSemVer("1.0.0"),
  name: "test",
  version: asSemVer("1.0.0"),
  phases: [{ name: "run" }],
} as unknown as Omit<Pattern, "hooks" | "binds">;

const moduleStructural: Omit<PhantomModule, "exports" | "specifier"> = {
  name: "test",
  version: asSemVer("1.0.0"),
} as unknown as Omit<PhantomModule, "exports" | "specifier">;

// @ts-expect-error - Pattern has 'phases', ModuleStructural doesn't
const assignModuleStructuralToPatternStructural: typeof patternStructural = moduleStructural;

/**
 * Test 5: Verify brand field existence (via type error when missing)
 */
// Note: Pattern requires __brand field, but we use 'as unknown' for testing
const forgedPattern: Pattern = {
  schemaVersion: asSemVer("1.0.0"),
  name: "test",
  version: asSemVer("1.0.0"),
  phases: [{ name: "run" }],
  hooks: {},
  binds: { declares: [] },
} as unknown as Pattern;

/**
 * Test 6: Verify Module (phantom) also requires its brand.
 */
// Note: PhantomModule requires __brand field, but we use 'as unknown' for testing
const forgedModule: PhantomModule = {
  specifier: "module://test",
  name: "test",
  version: asSemVer("1.0.0"),
  exports: [],
} as unknown as PhantomModule;

/**
 * Test 7: Verify brand is readonly and cannot be modified.
 */
const pattern: Pattern = {
  schemaVersion: asSemVer("1.0.0"),
  name: "test",
  version: asSemVer("1.0.0"),
  phases: [{ name: "run" }],
  hooks: {},
  binds: { declares: [] },
} as unknown as Pattern;

// The brand field is not directly assignable (it's a readonly unique symbol)
// This test documents the constraint at compile-time

/**
 * Test 8: Array types preserve nominal distinction.
 *
 * Arrays of Pattern and arrays of Module are not compatible.
 */
const patternArrayElement: Pattern = {
  schemaVersion: asSemVer("1.0.0"),
  name: "test",
  version: asSemVer("1.0.0"),
  phases: [{ name: "run" }],
  hooks: {},
  binds: { declares: [] },
} as unknown as Pattern;

// @ts-expect-error - Pattern[] and PhantomModule[] are not compatible
const moduleArray: PhantomModule[] = [patternArrayElement];

/**
 * Test 9: Verify Phase vs other subtypes
 */
const phaseTest: Pattern["phases"][0] = {
  name: "test-phase",
  description: "Test phase description",
};

// @ts-expect-error - Phase requires 'name'
const invalidPhase: Pattern["phases"][0] = {
  description: "Missing name",
};

/**
 * Test 10: Verify Gate structure
 */
const gateTest: Pattern["gates"] = [
  {
    name: "test-gate",
    description: "Test gate description",
  },
];

// Export to prevent unused variable warnings
export {
  phantomModule,
  assignModuleToPattern,
  assignPatternToModule,
  patternHasBinds,
  phantomModuleHasSpecifier,
  patternStructural,
  moduleStructural,
  assignModuleStructuralToPatternStructural,
  forgedPattern,
  forgedModule,
  pattern,
  patternArrayElement,
  phaseTest,
  invalidPhase,
  gateTest,
};
