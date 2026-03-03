// ================================================================
// 🔗 Section 10: Interfaces & Type Aliases
// Run standalone:  bun run 10-interfaces-and-types.ts
// ================================================================

import { title, sub, explain, code, codeRaw, tip, log } from "./_helpers";

export function run() {
  title("🔗", "Section 10: Interfaces & Type Aliases");
  explain("Interfaces and types define the SHAPE of data.");
  explain("They describe what properties an object should have.");

  sub("Interface — define the shape of an object");
  log();
  interface Point { x: number; y: number; }
  const origin: Point = { x: 0, y: 0 };
  codeRaw(`interface Point { x: number; y: number }`, "");
  code(`const origin: Point = { x: 0, y: 0 }`, origin);
  explain("  ↳ Now TypeScript ensures every Point has x and y");

  sub("Optional properties — may or may not exist");
  log();
  interface Config { width: number; height: number; color?: string; }
  codeRaw(`interface Config { ...; color?: string }`, "The ? makes it optional");
  codeRaw(`{ width: 100, height: 50 }`, "✅ Valid — color is optional");
  codeRaw(`{ width: 100, height: 50, color: "blue" }`, "✅ Also valid");

  sub("Type alias — name ANY type, not just objects");
  explain("Unlike interfaces, type aliases can describe unions, arrays, functions:");
  log();
  type Direction = "north" | "south" | "east" | "west";
  const dir: Direction = "north";
  codeRaw(`type Direction = "north" | "south" | "east" | "west"`, "Union type");
  code(`const dir: Direction = "north"`, dir);
  codeRaw(`dir = "up"`, "❌ Error! Only the 4 directions are allowed");
  log();
  codeRaw(`type Matrix = number[][]`, "2D array of numbers");
  codeRaw(`type Comparator = (a: number, b: number) => number`, "Function type");
  codeRaw(`type Nullable<T> = T | null`, "Generic type alias");

  sub("Index signatures — when keys are dynamic");
  explain("For objects where you don't know the keys in advance:");
  log();
  interface FrequencyMap { [key: string]: number; }
  const freq: FrequencyMap = {};
  freq["apple"] = 3;
  freq["banana"] = 5;
  codeRaw(`{ [key: string]: number }`, "Any string key, number value");
  code(`freq["apple"] = 3; freq["banana"] = 5`, freq);
  tip("This is useful for frequency counters when using plain objects instead of Map.");
}

if (import.meta.main) run();
