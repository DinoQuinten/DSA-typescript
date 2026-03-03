// ================================================================
// 🧬 Section 9: Generics — Reusable Data Structures
// Run standalone:  bun run 09-generics.ts
// ================================================================

import { title, sub, explain, code, codeRaw, tip, log } from "./_helpers";
import { Stack } from "./_shared";

export function run() {
  title("🧬", "Section 9: Generics — Reusable Data Structures");
  explain("Generics let you write ONE piece of code that works with ANY type");
  explain("while keeping full type safety. The <T> is a placeholder for any type.");

  sub("Generic function — works with any type");
  log();
  function firstElement<T>(arr: T[]): T | undefined { return arr[0]; }

  codeRaw(`function firstElement<T>(arr: T[]): T`, "<T> = 'any type you want'");
  code(`firstElement([1, 2, 3])`, firstElement([1, 2, 3]));
  explain("  ↳ T becomes 'number' automatically");
  code(`firstElement(["a", "b"])`, firstElement(["a", "b"]));
  explain("  ↳ T becomes 'string' automatically");
  tip("TypeScript infers T from the argument — you usually don't need to specify it.");

  sub("Generic constraints — limit what types are allowed");
  log();
  function getLength<T extends { length: number }>(item: T): number {
    return item.length;
  }
  codeRaw(`<T extends { length: number }>`, "Only types WITH .length are allowed");
  code(`getLength("hello")`, getLength("hello"));
  code(`getLength([1, 2, 3])`, getLength([1, 2, 3]));
  codeRaw(`getLength(123)`, "❌ Error! Numbers don't have .length");

  sub("Generics in action — the Stack<T> class");
  explain("Same Stack class, different types — fully type-safe:");
  log();
  const numStack = new Stack<number>();
  numStack.push(1); numStack.push(2);
  code(`Stack<number> → peek()`, numStack.peek());

  const strStack = new Stack<string>();
  strStack.push("hello"); strStack.push("world");
  code(`Stack<string> → peek()`, strStack.peek());

  log();
  explain("  ↳ Stack<number> only accepts numbers, Stack<string> only strings.");
  explain("  ↳ One class definition, infinite type combinations!");
}

if (import.meta.main) run();
