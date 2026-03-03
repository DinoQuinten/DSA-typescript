// ================================================================
// 📝 Section 1: Variables & Types
// Run standalone:  bun run 01-variables-and-types.ts
// ================================================================

import { title, sub, explain, code, codeRaw, tip, log } from "./_helpers";

export function run(userName: string) {
  title("📝", "Section 1: Variables & Types");
  explain("TypeScript = JavaScript + Types. Types tell the compiler what kind of");
  explain("data a variable holds, so it catches bugs BEFORE your code even runs.");

  sub("Declaring variables — const vs let");
  explain("Use 'const' for values that never change (this is your default).");
  explain("Use 'let' for values that WILL change later. Never use 'var'.");
  log();

  const courseName: string = "DSA with TypeScript";
  let score: number = 0;
  score = 100;

  code(`const courseName: string = "DSA with TS"`, courseName);
  code(`let score: number = 0;  score = 100`, score);

  sub("Primitive types — the 5 building blocks");
  explain("Every variable in TypeScript is one of these basic types:");
  log();

  code(`const greeting: string = "Hello, DSA!"`, "Hello, DSA!");
  code(`const age: number = 25`, 25);
  code(`const isReady: boolean = true`, true);
  code(`const empty: null = null`, null);
  code(`const notSet: undefined = undefined`, undefined);
  log();
  tip("number covers both integers AND decimals — there's no int vs float.");

  sub("Type inference — TypeScript is smart");
  explain("You don't always need to write the type. TS figures it out from the value:");
  log();
  code(`const x = 42`, 42);
  codeRaw(`typeof x`, `"number" (TS inferred it automatically!)`);

  sub("any vs unknown — two very different things");
  explain("'any' disables type checking — dangerous, avoid it.");
  explain("'unknown' is the safe version — forces you to check the type first.");
  log();

  let safe: unknown = "hello";
  codeRaw(`let safe: unknown = "hello"`, `Can't use .toUpperCase() yet!`);
  if (typeof safe === "string") {
    code(`if (typeof safe === "string") safe.toUpperCase()`, safe.toUpperCase());
  }
  tip("Always prefer 'unknown' over 'any'. It keeps your code safe.");

  sub("Template literals — embed values inside strings");
  explain("Use backticks ` ` and ${} to put variables inside a string:");
  log();

  const points = 95;
  code(`\`${userName} scored \${95} points!\``, `${userName} scored ${points} points!`);
  code("`2 + 3 = ${2 + 3}`", `2 + 3 = ${2 + 3}`);
  code("`Is 95 even? ${95 % 2 === 0}`", `Is 95 even? ${95 % 2 === 0}`);
}

if (import.meta.main) run("Learner");
