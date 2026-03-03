// ================================================================
// 🧰 Section 12: Destructuring & Spread
// Run standalone:  bun run 12-destructuring-and-spread.ts
// ================================================================

import { title, sub, explain, code, codeRaw, tip, log } from "./_helpers";

export function run(userName: string) {
  title("🧰", "Section 12: Destructuring & Spread");
  explain("These features make code cleaner and more concise.");
  explain("You'll use them in almost every DSA solution.");

  sub("Array destructuring — pull values out by position");
  log();
  const [aa, bb, cc] = [10, 20, 30];
  codeRaw(`const [a, b, c] = [10, 20, 30]`, `a=${aa}, b=${bb}, c=${cc}`);

  const [firstVal, , thirdVal] = [1, 2, 3];
  codeRaw(`const [first, , third] = [1, 2, 3]`, `first=${firstVal}, third=${thirdVal}`);
  explain("  ↳ The empty slot skips the middle element");

  const [head, ...tail] = [1, 2, 3, 4, 5];
  codeRaw(`const [head, ...tail] = [1,2,3,4,5]`, `head=${head}, tail=[${tail}]`);
  explain("  ↳ ...rest collects everything that's left");

  sub("SWAP TRICK — no temp variable needed!");
  explain("Used ALL THE TIME in sorting algorithms:");
  log();
  let x = 1, y = 2;
  codeRaw(`let x = 1, y = 2`, "");
  [x, y] = [y, x];
  codeRaw(`[x, y] = [y, x]`, `x=${x}, y=${y} — swapped!`);
  log();
  const swapArr = [10, 20, 30, 40, 50];
  [swapArr[0], swapArr[4]] = [swapArr[4], swapArr[0]];
  codeRaw(`[arr[0], arr[4]] = [arr[4], arr[0]]`, JSON.stringify(swapArr));
  explain("  ↳ Swap first and last element in an array — one line!");
  tip("In C++/Java you need a temp variable. In TypeScript, destructuring does it.");

  sub("Object destructuring — pull properties out by name");
  log();
  const person = { personName: userName, personAge: 25, city: "Chennai" };
  const { personName, personAge } = person;
  codeRaw(`const { personName, personAge } = person`, `${personName}, ${personAge}`);
  const { personName: renamed, city: userCity } = person;
  codeRaw(`const { personName: renamed, city } = person`, `${renamed}, ${userCity}`);
  explain("  ↳ You can rename variables during destructuring with :");

  sub("Spread operator (...) — copy and merge");
  log();
  code(`[...[1,2,3]]`, [...[1, 2, 3]]);
  explain("  ↳ Creates a copy (not a reference — changes won't affect original)");
  code(`[...[1,2], ...[3,4], ...[5,6]]`, [...[1, 2], ...[3, 4], ...[5, 6]]);
  explain("  ↳ Merge multiple arrays into one");
}

if (import.meta.main) run("Learner");
