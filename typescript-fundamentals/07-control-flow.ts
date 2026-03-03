// ================================================================
// 🔀 Section 7: Control Flow
// Run standalone:  bun run 07-control-flow.ts
// ================================================================

import { title, sub, explain, code, codeRaw, warn, log, color } from "./_helpers";

export function run() {
  title("🔀", "Section 7: Control Flow");
  explain("Loops and conditionals are the engine of every algorithm.");
  explain("If you can loop, you can solve problems. Let's master every loop type.");

  sub("if / else if / else");
  log();
  const testScore = 85;
  codeRaw(`const testScore = 85`, "");
  codeRaw(`if (testScore >= 90) → "A"`, "");
  codeRaw(`else if (testScore >= 80) → "B"`, `"B" ← this one runs`);
  codeRaw(`else → "C"`, "");

  log();
  explain("Ternary — one-line if/else, great for simple decisions:");
  const grade = testScore >= 90 ? "A" : testScore >= 80 ? "B" : "C";
  code(`score >= 90 ? "A" : score >= 80 ? "B" : "C"`, grade);

  sub("for loop — the workhorse");
  explain("Use when you NEED the index (most DSA problems):");
  log();
  codeRaw(`for (let i = 0; i < 5; i++)`, "");
  log(color.green(`     Output: 0 1 2 3 4`));

  sub("while loop — process until condition changes");
  log();
  let n = 128;
  let steps = 0;
  while (n > 1) { n = Math.floor(n / 2); steps++; }
  codeRaw(`while (n > 1) { n = Math.floor(n/2); steps++ }`, "");
  codeRaw(`Starting from 128`, `Halved ${steps} times to reach 1`);
  explain("  ↳ This is how you calculate log₂(n) — important for time complexity!");

  sub("for...of — iterate VALUES (use for arrays, strings, sets)");
  log();
  codeRaw(`for (const char of "DSA")`, "");
  log(color.green(`     Output: D S A`));
  warn("DON'T use for...in for arrays — it iterates keys (indices) as strings!");

  sub("break & continue — control loop flow");
  log();
  explain("break exits the loop entirely:");
  codeRaw(`for (i = 0..9) { if (i === 3) break }`, `Output: 0 1 2`);
  log();
  explain("continue skips the current iteration:");
  codeRaw(`for (i = 0..9) { if (i % 2 === 0) continue }`, `Output: 1 3 5 7 9`);
  explain("  ↳ Skipped all even numbers, printed only odds");

  sub("Labeled break — escape nested loops");
  explain("Useful in 2D grid problems when you find the target:");
  log();
  const grid = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
  codeRaw(`search: for (r) { for (c) {`, "");
  codeRaw(`  if (grid[r][c] === 5) break search`, "Breaks BOTH loops at once");
  codeRaw(`}}`, "");
  search: for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] === 5) {
        codeRaw(`Found 5 at`, `row=${r}, col=${c}`);
        break search;
      }
    }
  }
}

if (import.meta.main) run();
