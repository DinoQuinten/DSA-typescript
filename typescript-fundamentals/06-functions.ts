// ================================================================
// 🔧 Section 6: Functions
// Run standalone:  bun run 06-functions.ts
// ================================================================

import { title, sub, explain, code, codeRaw, tip, log } from "./_helpers";

export function run(userName: string) {
  title("🔧", "Section 6: Functions");
  explain("Functions are the building blocks of algorithms.");
  explain("You'll use them for recursion, helpers, and callbacks.");

  sub("Function declaration vs Arrow function");
  log();

  function add(a: number, b: number): number { return a + b; }
  const multiply = (a: number, b: number): number => a * b;

  codeRaw(`function add(a: number, b: number): number`, "Classic syntax, hoisted");
  code(`add(2, 3)`, add(2, 3));
  log();
  codeRaw(`const multiply = (a, b) => a * b`, "Arrow function, concise");
  code(`multiply(4, 5)`, multiply(4, 5));
  tip("Arrow functions are the modern style. Use them for short functions.");

  sub("Handling edge cases — returning null");
  log();
  const safeDivide = (a: number, b: number): number | null => {
    if (b === 0) return null;
    return a / b;
  };
  codeRaw(`safeDivide(a, b) → null if b is 0`, "Return type: number | null");
  code(`safeDivide(10, 3)`, safeDivide(10, 3));
  code(`safeDivide(10, 0)`, safeDivide(10, 0));
  explain("  ↳ Returns null instead of crashing — this pattern is common in DSA");

  sub("Optional & default parameters");
  log();
  function greet(name: string, greeting?: string): string {
    return `${greeting ?? "Hello"}, ${name}!`;
  }
  codeRaw(`greet(name, greeting?)`, "The ? makes greeting optional");
  code(`greet("${userName}")`, greet(userName));
  code(`greet("${userName}", "Hey")`, greet(userName, "Hey"));
  explain("  ↳ ?? means: if greeting is undefined, use 'Hello' instead");

  log();
  function createFilledArray(size: number, fill: number = 0): number[] {
    return new Array(size).fill(fill);
  }
  codeRaw(`createFilledArray(size, fill = 0)`, "fill defaults to 0");
  code(`createFilledArray(5)`, createFilledArray(5));
  code(`createFilledArray(3, 7)`, createFilledArray(3, 7));

  sub("Rest parameters — accept any number of arguments");
  log();
  function sumAll(...nums: number[]): number {
    return nums.reduce((acc, n) => acc + n, 0);
  }
  codeRaw(`function sumAll(...nums: number[])`, "...nums collects all args into an array");
  code(`sumAll(1, 2, 3)`, sumAll(1, 2, 3));
  code(`sumAll(1, 2, 3, 4, 5)`, sumAll(1, 2, 3, 4, 5));

  sub("Callbacks — passing functions as arguments");
  explain("This is how .sort(), .map(), .filter() work under the hood:");
  log();
  function processArray(arr: number[], transform: (n: number) => number): number[] {
    return arr.map(transform);
  }
  code(`processArray([1,2,3], n => n * 2)`, processArray([1, 2, 3], n => n * 2));
  code(`processArray([1,2,3], n => n ** 2)`, processArray([1, 2, 3], n => n ** 2));
  explain("  ↳ Same function, different behavior — just pass a different callback!");
}

if (import.meta.main) run("Learner");
