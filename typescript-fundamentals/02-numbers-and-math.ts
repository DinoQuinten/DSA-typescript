// ================================================================
// 🔢 Section 2: Numbers & Math
// Run standalone:  bun run 02-numbers-and-math.ts
// ================================================================

import { title, sub, explain, code, codeRaw, warn, tip, log } from "./_helpers";

export function run() {
  title("🔢", "Section 2: Numbers & Math");
  explain("TypeScript has ONE number type — no int vs float distinction.");
  explain("All numbers are 64-bit floating point. Here are the methods you'll use daily.");

  sub("Rounding — floor, ceil, round");
  explain("These control how decimals become integers:");
  log();
  code(`Math.floor(3.7)`, Math.floor(3.7));
  explain("  ↳ Always rounds DOWN (towards negative infinity)");
  code(`Math.ceil(3.2)`, Math.ceil(3.2));
  explain("  ↳ Always rounds UP (towards positive infinity)");
  code(`Math.round(3.5)`, Math.round(3.5));
  explain("  ↳ Rounds to NEAREST integer (0.5 goes up)");

  sub("Min, Max, Abs, Pow, Sqrt — everyday math");
  log();
  code(`Math.max(1, 5, 3)`, Math.max(1, 5, 3));
  code(`Math.min(1, 5, 3)`, Math.min(1, 5, 3));
  code(`Math.abs(-7)`, Math.abs(-7));
  explain("  ↳ Removes the negative sign — distance from zero");
  code(`Math.pow(2, 10)`, Math.pow(2, 10));
  explain("  ↳ 2 to the power of 10 = 1024");
  code(`Math.sqrt(144)`, Math.sqrt(144));

  sub("Integer division — a common gotcha!");
  explain("TypeScript has NO integer division operator. You MUST floor manually:");
  log();
  code(`7 / 2`, 7 / 2);
  warn("3.5 — NOT an integer! This trips up many DSA beginners.");
  code(`Math.floor(7 / 2)`, Math.floor(7 / 2));
  tip("Always wrap division with Math.floor() when you need an integer.");

  sub("Modulo (%) — the remainder operator");
  explain("Gives the remainder after division. Used everywhere in DSA:");
  log();
  code(`7 % 3`, 7 % 3);
  explain("  ↳ 7 = 2×3 + 1, so remainder is 1");
  code(`10 % 2`, 10 % 2);
  explain("  ↳ 0 means 10 is even! (divisible by 2)");
  tip("n % 2 === 0 checks if a number is even. You'll use this a lot.");

  sub("Bitwise operators — for tricky LeetCode problems");
  explain("These work on individual bits (binary representation):");
  log();
  code(`5 & 3  (AND)`, 5 & 3);
  code(`5 | 3  (OR)`, 5 | 3);
  code(`5 ^ 3  (XOR)`, 5 ^ 3);
  code(`1 << 3 (left shift = multiply by 2³)`, 1 << 3);
  code(`8 >> 2 (right shift = divide by 2²)`, 8 >> 2);

  log();
  explain("Classic trick: Find the number that appears only once using XOR.");
  explain("XOR cancels out pairs: a ^ a = 0, and a ^ 0 = a");
  const xorNums = [2, 1, 4, 1, 2];
  let single = 0;
  for (const n of xorNums) single ^= n;
  code(`[2, 1, 4, 1, 2] → XOR all`, single);
  explain("  ↳ 2^2=0, 1^1=0, only 4 remains!");
}

if (import.meta.main) run();
