// ================================================================
// 📦 Section 3: Arrays — The Most Important for DSA
// Run standalone:  bun run 03-arrays.ts
// ================================================================

import { title, sub, explain, code, codeRaw, warn, tip, log, color } from "./_helpers";

export function run() {
  title("📦", "Section 3: Arrays — The Most Important for DSA");
  explain("~40% of all LeetCode problems use arrays. Master this section.");
  explain("Arrays are ordered collections that grow automatically in TypeScript.");

  sub("Creating arrays");
  log();
  code(`["apple", "banana", "cherry"]`, ["apple", "banana", "cherry"]);
  code(`[1, 2, 3, 4, 5]`, [1, 2, 3, 4, 5]);
  code(`new Array(5).fill(0)`, new Array(5).fill(0));
  explain("  ↳ Creates [0,0,0,0,0] — you'll use this ALL THE TIME in DP problems");
  log();
  code(`Array.from({length:5}, (_, i) => i)`, Array.from({ length: 5 }, (_, i) => i));
  explain("  ↳ Creates [0,1,2,3,4] — the (_, i) means 'ignore value, use index'");
  code(`Array.from({length:5}, (_, i) => i*i)`, Array.from({ length: 5 }, (_, i) => i * i));

  sub("2D arrays — watch out for this GOTCHA!");
  log();
  const wrong2D = new Array(3).fill(new Array(3).fill(0));
  wrong2D[0][0] = 1;
  codeRaw(`new Array(3).fill(new Array(3).fill(0))`, JSON.stringify(wrong2D));
  warn("ALL rows changed! They all point to the SAME inner array.");
  log();
  const right2D = Array.from({ length: 3 }, () => new Array(3).fill(0));
  right2D[0][0] = 1;
  codeRaw(`Array.from({length:3}, () => new Array(3).fill(0))`, JSON.stringify(right2D));
  tip("Always use Array.from() for 2D arrays. Each row is independent.");

  sub("Adding & removing elements");
  explain("O(1) = instant. O(n) = slow because all elements must shift.");
  log();
  const arr = [10, 20, 30, 40, 50];
  arr.push(60);
  codeRaw(`arr.push(60)`, `${JSON.stringify(arr)}  — O(1) adds to END`);
  const popped = arr.pop();
  codeRaw(`arr.pop()`, `removed ${popped}  — O(1) removes from END`);
  arr.unshift(5);
  codeRaw(`arr.unshift(5)`, `${JSON.stringify(arr)}  — O(n) adds to START`);
  const shifted = arr.shift();
  codeRaw(`arr.shift()`, `removed ${shifted}  — O(n) removes from START`);
  warn("unshift/shift are SLOW — they shift every element. Avoid in hot loops.");

  sub("slice vs splice — easy to confuse!");
  log();
  explain("slice = COPY a portion (original stays the same)");
  const sliced = arr.slice(1, 3);
  codeRaw(`[10,20,30,40,50].slice(1, 3)`, `${JSON.stringify(sliced)}  — copies index 1 to 2`);
  log();
  explain("splice = MODIFY the array (removes/inserts at index)");
  const spliced = [1, 2, 3, 4, 5];
  spliced.splice(2, 1);
  codeRaw(`[1,2,3,4,5].splice(2, 1)`, `${JSON.stringify(spliced)}  — removed 1 item at index 2`);
  tip("slice = Safe copy. splice = Dangerous mutation. Remember: splice has a 'p' for 'permanent'.");

  sub("Looping through arrays — 4 ways");
  const iterArr = [10, 20, 30];
  log();
  explain("1. Classic for — when you NEED the index");
  for (let i = 0; i < iterArr.length; i++) {
    log(color.dim(`     i=${i}  →  arr[${i}] = ${color.green(String(iterArr[i]))}`));
  }
  log();
  explain("2. for...of — cleanest when you just need values");
  for (const val of iterArr) {
    log(color.dim(`     val = ${color.green(String(val))}`));
  }
  log();
  explain("3. forEach — gives both value AND index");
  explain("4. Reverse loop — for (let i = arr.length - 1; i >= 0; i--)");

  sub("Functional methods — transform data without writing loops");
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  log();
  code(`.map(n => n * 2)`, nums.map(n => n * 2));
  explain("  ↳ Transform every element and return a new array");
  code(`.filter(n => n % 2 === 0)`, nums.filter(n => n % 2 === 0));
  explain("  ↳ Keep only elements that pass the test");
  code(`.reduce((acc, n) => acc + n, 0)`, nums.reduce((acc, n) => acc + n, 0));
  explain("  ↳ Combine all elements into a single value (here: sum)");
  code(`.find(n => n > 5)`, nums.find(n => n > 5));
  explain("  ↳ Return the FIRST element that passes the test");
  code(`.includes(5)`, nums.includes(5));
  explain("  ↳ Does the array contain this value? true/false");

  sub("Sorting — CRITICAL gotcha!");
  const unsorted = [10, 9, 2, 30, 100];
  log();
  code(`[10,9,2,30,100].sort()`, [...unsorted].sort());
  warn("WRONG! Default .sort() converts to STRINGS first → alphabetical order!");
  log();
  code(`.sort((a, b) => a - b)`, [...unsorted].sort((a, b) => a - b));
  explain("  ↳ CORRECT ascending sort — always use a comparator for numbers");
  code(`.sort((a, b) => b - a)`, [...unsorted].sort((a, b) => b - a));
  explain("  ↳ Descending sort — just flip a and b");
  tip("ALWAYS provide (a, b) => a - b when sorting numbers. Never trust default .sort().");
}

if (import.meta.main) run();
