export {};

// ================================================================
// 🔄 Chapter 13: RECURSION & BACKTRACKING — Runnable Examples
// ================================================================
//
// WHAT IS RECURSION?
// -------------------
// Recursion is when a function calls ITSELF to solve a smaller
// version of the same problem. Every recursive function has:
//   1. BASE CASE — the simplest version that can be answered directly.
//   2. RECURSIVE CASE — break the problem down and call yourself.
//
// WHAT IS BACKTRACKING?
// ----------------------
// Backtracking = Recursion + UNDO. It's a systematic way to
// explore ALL possible solutions by:
//   1. CHOOSE — make a decision (add an element, place a queen).
//   2. EXPLORE — recurse with that decision in place.
//   3. UN-CHOOSE — undo the decision (backtrack) and try the next option.
//
// REAL-WORLD ANALOGY:
//   Imagine navigating a maze. At each fork you pick a path (CHOOSE),
//   walk down it (EXPLORE). If you hit a dead end, you walk back to
//   the fork (UN-CHOOSE) and try the other path. You keep doing this
//   until you find the exit or exhaust all options.
//
// WHY IS THIS POWERFUL?
//   Backtracking lets us generate all subsets, permutations,
//   combinations, valid configurations (N-Queens, Sudoku), etc.
//   It's brute-force-PLUS: we PRUNE branches early when we can
//   detect they'll never lead to a valid solution.
//
// HOW TO RUN:
//   bun run recursion-and-backtracking.ts
// ================================================================


// ────────────────────────────────────────────────────────────
// 1️⃣  FACTORIAL — with call stack logging
// ────────────────────────────────────────────────────────────
//
// WHAT:  Compute n! = n × (n-1) × ... × 1.
//        The "Hello World" of recursion.
//
// WHY THIS APPROACH:
//   n! has a naturally recursive definition:
//     factorial(0) = 1           (base case)
//     factorial(n) = n × factorial(n-1)  (recursive case)
//   Each call reduces n by 1, marching toward the base case.
//
// HOW THE CALL STACK WORKS:
//   factorial(5) waits for factorial(4), which waits for
//   factorial(3), ... down to factorial(1) which returns 1.
//   Then the results multiply back UP the chain:
//   1 → 2 → 6 → 24 → 120.
//
// COMPLEXITY:
//   Time:  O(n) — n recursive calls
//   Space: O(n) — n frames on the call stack
//
// REAL-WORLD ANALOGY:
//   A stack of plates: you keep putting plates on (calls) until
//   you reach the base case, then you take plates off one by one
//   (returns), each time combining the result.
// ────────────────────────────────────────────────────────────

function factorial(n: number, depth: number = 0): number {
  const indent = "  ".repeat(depth);
  console.log(`${indent}📥 factorial(${n}) called`);

  // BASE CASE: factorial(0) = factorial(1) = 1
  if (n <= 1) {
    console.log(`${indent}🛑 Base case! factorial(${n}) = 1`);
    return 1;
  }

  // RECURSIVE CASE: n * factorial(n - 1)
  const result = n * factorial(n - 1, depth + 1);
  console.log(`${indent}📤 factorial(${n}) = ${n} × factorial(${n - 1}) = ${result}`);
  return result;
}

console.log("═══════════════════════════════════════");
console.log("1️⃣  FACTORIAL with call stack logging");
console.log("═══════════════════════════════════════");
const factResult = factorial(5);
console.log(`\n✅ factorial(5) = ${factResult}\n`);


// ────────────────────────────────────────────────────────────
// 2️⃣  FIBONACCI (naive) — showing repeated computation
// ────────────────────────────────────────────────────────────
//
// WHAT:  Compute the n-th Fibonacci number using the naive
//        recursive approach: fib(n) = fib(n-1) + fib(n-2).
//
// WHY THIS IS IMPORTANT TO UNDERSTAND:
//   This demonstrates the DANGER of naive recursion. The same
//   subproblems are solved over and over. For example, fib(3)
//   is computed multiple times when calculating fib(6).
//   This is why techniques like MEMOIZATION (caching results)
//   or DYNAMIC PROGRAMMING exist — to eliminate this redundancy.
//
// HOW IT WORKS:
//   fib(0) = 0, fib(1) = 1          (base cases)
//   fib(n) = fib(n-1) + fib(n-2)    (recursive case)
//   The recursion tree branches into TWO calls each time,
//   creating an exponential explosion of work.
//
// COMPLEXITY:
//   Time:  O(2^n) — exponential! The tree doubles at each level.
//   Space: O(n) — maximum depth of the call stack
//
// VISUAL (fib(5) call tree):
//                    fib(5)
//                   /      \
//              fib(4)      fib(3)     ← fib(3) computed TWICE!
//             /    \        /   \
//         fib(3) fib(2) fib(2) fib(1)
//         ...    ...    ...
//
// THE FIX: Memoization turns this into O(n) time. See Chapter
// on Dynamic Programming for that optimization.
// ────────────────────────────────────────────────────────────

const fibCallCount: Record<number, number> = {};

function fibNaive(n: number, depth: number = 0): number {
  fibCallCount[n] = (fibCallCount[n] || 0) + 1;
  const indent = "  ".repeat(depth);

  // BASE CASES: fib(0) = 0, fib(1) = 1
  if (n <= 1) {
    console.log(`${indent}🛑 fib(${n}) = ${n}`);
    return n;
  }

  // RECURSIVE CASE: fib(n) = fib(n-1) + fib(n-2) — two branches!
  console.log(`${indent}🔄 fib(${n}) → fib(${n - 1}) + fib(${n - 2})`);
  const result = fibNaive(n - 1, depth + 1) + fibNaive(n - 2, depth + 1);
  console.log(`${indent}📤 fib(${n}) = ${result}`);
  return result;
}

console.log("═══════════════════════════════════════");
console.log("2️⃣  FIBONACCI (naive) — repeated computation");
console.log("═══════════════════════════════════════");
const fibResult = fibNaive(6);
console.log(`\n✅ fib(6) = ${fibResult}`);
console.log("\n🔴 Call counts (showing redundant work):");
for (const [n, count] of Object.entries(fibCallCount).sort(([a], [b]) => +b - +a)) {
  const bar = "█".repeat(count);
  console.log(`  fib(${n}): called ${count} time(s) ${bar}`);
}
console.log();


// ────────────────────────────────────────────────────────────
// 3️⃣  SUBSETS (Power Set) — with decision tree logging
// ────────────────────────────────────────────────────────────
//
// WHAT:  Generate ALL subsets of a given set of numbers.
//        For [1, 2, 3] there are 2³ = 8 subsets:
//        [], [1], [2], [3], [1,2], [1,3], [2,3], [1,2,3]
//
// WHY BACKTRACKING:
//   At each element, we have a BINARY CHOICE: include it or skip it.
//   This naturally forms a decision tree. Backtracking systematically
//   explores both branches for every element.
//
// HOW (step-by-step):
//   1. Start with an empty path [].
//   2. At index `start`, snapshot the current path as a valid subset.
//   3. For each element from `start` to end:
//      a. CHOOSE: add nums[i] to path.
//      b. EXPLORE: recurse with start = i + 1.
//      c. UN-CHOOSE: remove nums[i] from path (backtrack).
//   4. By starting the loop at `start`, we avoid generating
//      duplicate subsets (e.g., [1,2] and [2,1] are the same subset).
//
// COMPLEXITY:
//   Time:  O(n × 2^n) — 2^n subsets, each takes O(n) to copy
//   Space: O(n) — recursion depth (plus O(n × 2^n) for output)
//
// DECISION TREE for [1, 2, 3]:
//   []  → [1] → [1,2] → [1,2,3]
//                └→ [1,3]
//         └→ [2] → [2,3]
//         └→ [3]
// ────────────────────────────────────────────────────────────

function subsetsWithLogging(nums: number[]): number[][] {
  const result: number[][] = [];

  function backtrack(start: number, path: number[], depth: number): void {
    const indent = "  ".repeat(depth);
    // Every path (at every stage) is a valid subset — snapshot it
    console.log(`${indent}📸 Snapshot path: [${path}]`);
    result.push([...path]);

    for (let i = start; i < nums.length; i++) {
      // CHOOSE: include nums[i]
      console.log(`${indent}  ✅ Choose ${nums[i]}`);
      path.push(nums[i]);

      // EXPLORE: recurse starting from the next element
      backtrack(i + 1, path, depth + 1);

      // UN-CHOOSE: backtrack — remove nums[i] and try the next option
      path.pop();
      console.log(`${indent}  ↩️  Un-choose ${nums[i]}`);
    }
  }

  backtrack(0, [], 0);
  return result;
}

console.log("═══════════════════════════════════════");
console.log("3️⃣  SUBSETS — backtracking with logging");
console.log("═══════════════════════════════════════");
const subsetResult = subsetsWithLogging([1, 2, 3]);
console.log(`\n✅ All subsets of [1, 2, 3]:`);
console.log(`   ${subsetResult.map((s) => `[${s}]`).join(", ")}`);
console.log(`   Total: ${subsetResult.length} subsets (2³ = 8) ✓\n`);


// ────────────────────────────────────────────────────────────
// 4️⃣  PERMUTATIONS — used-set approach
// ────────────────────────────────────────────────────────────
//
// WHAT:  Generate ALL permutations (orderings) of a set of numbers.
//        For [1, 2, 3] there are 3! = 6 permutations:
//        [1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]
//
// WHY THE USED-SET APPROACH:
//   Unlike subsets (which skip elements), permutations use EVERY
//   element exactly once but in different ORDERS. A `used[]` array
//   tracks which elements are currently in the path, preventing
//   the same element from appearing twice in one permutation.
//
// HOW (step-by-step):
//   1. Maintain a `used[i]` boolean array (same length as nums).
//   2. At each recursion level, try ALL elements that aren't used.
//   3. CHOOSE: mark used[i] = true, push nums[i] to path.
//   4. EXPLORE: recurse (one level deeper, one more element chosen).
//   5. UN-CHOOSE: mark used[i] = false, pop from path.
//   6. BASE CASE: when path.length === nums.length, we have a
//      complete permutation → record it.
//
// COMPLEXITY:
//   Time:  O(n × n!) — n! permutations, each takes O(n) to copy
//   Space: O(n) — recursion depth + used array
//
// SUBSETS vs PERMUTATIONS:
//   Subsets:      loop from `start` onwards (order doesn't matter)
//   Permutations: loop from 0 every time, skip `used` elements
// ────────────────────────────────────────────────────────────

function permutationsWithLogging(nums: number[]): number[][] {
  const result: number[][] = [];
  const used: boolean[] = new Array(nums.length).fill(false);

  function backtrack(path: number[], depth: number): void {
    const indent = "  ".repeat(depth);

    // BASE CASE: all elements placed → complete permutation
    if (path.length === nums.length) {
      console.log(`${indent}🎯 Found permutation: [${path}]`);
      result.push([...path]);
      return;
    }

    // Try every unused element at this position
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;

      // CHOOSE
      console.log(`${indent}✅ Choose ${nums[i]} (index ${i})`);
      used[i] = true;
      path.push(nums[i]);

      // EXPLORE
      backtrack(path, depth + 1);

      // UN-CHOOSE (backtrack)
      path.pop();
      used[i] = false;
      console.log(`${indent}↩️  Un-choose ${nums[i]}`);
    }
  }

  backtrack([], 0);
  return result;
}

console.log("═══════════════════════════════════════");
console.log("4️⃣  PERMUTATIONS of [1, 2, 3]");
console.log("═══════════════════════════════════════");
const permResult = permutationsWithLogging([1, 2, 3]);
console.log(`\n✅ All permutations:`);
permResult.forEach((p, i) => console.log(`   ${i + 1}. [${p}]`));
console.log(`   Total: ${permResult.length} permutations (3! = 6) ✓\n`);


// ────────────────────────────────────────────────────────────
// 5️⃣  COMBINATIONS — C(n, k)
// ────────────────────────────────────────────────────────────
//
// WHAT:  Generate all ways to choose k items from [1..n]
//        (order doesn't matter). C(5, 3) = 10 combinations.
//
// WHY THIS APPROACH:
//   Very similar to subsets, but we STOP collecting once the
//   path reaches exactly k elements. We also apply a PRUNING
//   optimization: if there aren't enough remaining elements to
//   reach k, we skip that branch entirely.
//
// HOW (step-by-step):
//   1. Loop from `start` to `n - remaining + 1`:
//      - `remaining` = k - path.length (how many more we need).
//      - This upper bound prunes branches that can't possibly
//        produce a full combination.
//   2. CHOOSE: push i to path.
//   3. EXPLORE: recurse with start = i + 1.
//   4. UN-CHOOSE: pop from path.
//   5. BASE CASE: path.length === k → record combination.
//
// COMPLEXITY:
//   Time:  O(k × C(n,k)) — C(n,k) combinations, each copied in O(k)
//   Space: O(k) — recursion depth
//
// PRUNING IS KEY:
//   Without the `n - remaining + 1` bound, we'd explore many
//   dead-end branches. With it, we cut the search space significantly.
// ────────────────────────────────────────────────────────────

function combinationsWithLogging(n: number, k: number): number[][] {
  const result: number[][] = [];

  function backtrack(start: number, path: number[], depth: number): void {
    const indent = "  ".repeat(depth);

    // BASE CASE: we've chosen k elements
    if (path.length === k) {
      console.log(`${indent}🎯 Found combination: [${path}]`);
      result.push([...path]);
      return;
    }

    // PRUNING: only loop while enough elements remain to fill the combination
    const remaining = k - path.length;
    for (let i = start; i <= n - remaining + 1; i++) {
      console.log(`${indent}✅ Choose ${i}`);
      path.push(i);
      backtrack(i + 1, path, depth + 1);
      path.pop();
      console.log(`${indent}↩️  Un-choose ${i}`);
    }
  }

  backtrack(1, [], 0);
  return result;
}

console.log("═══════════════════════════════════════");
console.log("5️⃣  COMBINATIONS C(5, 3)");
console.log("═══════════════════════════════════════");
const combResult = combinationsWithLogging(5, 3);
console.log(`\n✅ All combinations of choosing 3 from [1..5]:`);
combResult.forEach((c, i) => console.log(`   ${i + 1}. [${c}]`));
console.log(`   Total: ${combResult.length} combinations (C(5,3) = 10) ✓\n`);


// ────────────────────────────────────────────────────────────
// 6️⃣  COMBINATION SUM — candidates can be reused
// ────────────────────────────────────────────────────────────
//
// WHAT:  Given a list of candidates and a target, find ALL unique
//        combinations where the candidates sum to the target.
//        Each candidate can be used UNLIMITED times.
//        Example: candidates=[2,3,6,7], target=7 → [2,2,3], [7]
//
// WHY THIS APPROACH:
//   This is a variation of combinations with two key twists:
//   1. Elements CAN be reused (so we recurse with `i`, not `i+1`).
//   2. We have a `remaining` budget that shrinks as we add numbers.
//   We sort candidates first so we can PRUNE: if candidates[i] >
//   remaining, all subsequent candidates are also too large (break).
//
// HOW (step-by-step):
//   1. Sort candidates ascending.
//   2. Recurse with (start, remaining, path):
//      a. If remaining === 0 → found a valid combination!
//      b. For each candidate from `start` onwards:
//         - If candidate > remaining → PRUNE (break the loop).
//         - CHOOSE: add candidate, recurse with remaining - candidate.
//         - UN-CHOOSE: pop candidate.
//      c. Note: recurse with `i` (not i+1) to allow reuse.
//
// COMPLEXITY:
//   Time:  O(n^(target/min)) in the worst case — exponential
//   Space: O(target/min) — maximum recursion depth
//
// REAL-WORLD ANALOGY:
//   You're at a vending machine with coins of certain denominations.
//   Find all ways to make exact change for the target amount.
// ────────────────────────────────────────────────────────────

function combinationSumWithLogging(
  candidates: number[],
  target: number
): number[][] {
  const result: number[][] = [];
  candidates.sort((a, b) => a - b);

  function backtrack(
    start: number,
    remaining: number,
    path: number[],
    depth: number
  ): void {
    const indent = "  ".repeat(depth);

    // BASE CASE: remaining is zero — we've hit the target exactly
    if (remaining === 0) {
      console.log(`${indent}🎯 Found! [${path}] sums to ${target}`);
      result.push([...path]);
      return;
    }

    for (let i = start; i < candidates.length; i++) {
      // PRUNE: if this candidate exceeds remaining, all after it will too
      if (candidates[i] > remaining) {
        console.log(
          `${indent}✂️  Prune: ${candidates[i]} > remaining ${remaining}`
        );
        break;
      }

      // CHOOSE
      console.log(
        `${indent}✅ Choose ${candidates[i]}, remaining: ${remaining} → ${remaining - candidates[i]}`
      );
      path.push(candidates[i]);

      // EXPLORE: pass `i` (not i+1) because we CAN reuse the same candidate
      backtrack(i, remaining - candidates[i], path, depth + 1);

      // UN-CHOOSE
      path.pop();
      console.log(`${indent}↩️  Un-choose ${candidates[i]}`);
    }
  }

  backtrack(0, target, [], 0);
  return result;
}

console.log("═══════════════════════════════════════");
console.log("6️⃣  COMBINATION SUM — target = 7, candidates = [2, 3, 6, 7]");
console.log("═══════════════════════════════════════");
const csResult = combinationSumWithLogging([2, 3, 6, 7], 7);
console.log(`\n✅ Combinations that sum to 7:`);
csResult.forEach((c, i) => console.log(`   ${i + 1}. [${c.join(" + ")}] = 7`));
console.log(`   Total: ${csResult.length} combinations\n`);


// ────────────────────────────────────────────────────────────
// 7️⃣  N-QUEENS — with board visualization
// ────────────────────────────────────────────────────────────
//
// WHAT:  Place N queens on an N×N chessboard so that NO two
//        queens threaten each other (no shared row, column,
//        or diagonal). Find ALL valid configurations.
//
// WHY THIS APPROACH:
//   Since each row must have exactly one queen, we place queens
//   row by row (row 0, then row 1, ...). For each row, we try
//   every column. Three Sets track attacked positions:
//   - `cols`: columns already occupied
//   - `diag1` (row - col): main diagonals (↘)
//   - `diag2` (row + col): anti-diagonals (↙)
//   If a position is safe (not in any Set), we place the queen
//   and recurse to the next row. If we reach row N, we found
//   a valid solution.
//
// HOW (step-by-step):
//   1. For each column `col` in the current `row`:
//      a. Check if col, row-col, row+col are all free.
//      b. If safe: CHOOSE — place queen, add to Sets.
//      c. EXPLORE — recurse to row + 1.
//      d. UN-CHOOSE — remove queen, delete from Sets.
//   2. BASE CASE: row === N → all queens placed → record solution.
//
// COMPLEXITY:
//   Time:  O(N!) — at most N choices for row 0, N-1 for row 1, etc.
//   Space: O(N) — the board + three Sets + recursion stack
//
// WHY THREE SETS?
//   - Checking "is column c attacked?" is O(1) with a Set.
//   - Diagonals have a neat property: all cells on the same ↘
//     diagonal share the same (row - col) value, and all cells
//     on the same ↙ diagonal share the same (row + col) value.
// ────────────────────────────────────────────────────────────

function solveNQueensVisual(n: number): string[][] {
  const result: string[][] = [];
  const cols = new Set<number>();
  const diag1 = new Set<number>();  // row - col (↘ diagonal)
  const diag2 = new Set<number>();  // row + col (↙ diagonal)
  const board: string[][] = Array.from({ length: n }, () =>
    Array(n).fill(".")
  );
  let solutionCount = 0;

  function printBoard(board: string[][]): void {
    console.log(`\n   ┌${"───┬".repeat(n - 1)}───┐`);
    board.forEach((row, i) => {
      const cells = row.map((c) => (c === "Q" ? " 👑" : " · ")).join("│");
      console.log(`   │${cells}│`);
      if (i < n - 1) {
        console.log(`   ├${"───┼".repeat(n - 1)}───┤`);
      }
    });
    console.log(`   └${"───┴".repeat(n - 1)}───┘`);
  }

  function backtrack(row: number): void {
    // BASE CASE: all N queens are placed successfully
    if (row === n) {
      solutionCount++;
      console.log(`\n🎯 Solution #${solutionCount}:`);
      printBoard(board);
      result.push(board.map((r) => r.join("")));
      return;
    }

    // Try placing a queen in each column of this row
    for (let col = 0; col < n; col++) {
      // CONSTRAINT CHECK: is this cell attacked?
      if (cols.has(col) || diag1.has(row - col) || diag2.has(row + col)) {
        continue;
      }

      // CHOOSE: place queen at (row, col)
      board[row][col] = "Q";
      cols.add(col);
      diag1.add(row - col);
      diag2.add(row + col);

      // EXPLORE: try to place queens in subsequent rows
      backtrack(row + 1);

      // UN-CHOOSE: remove queen and try the next column
      board[row][col] = ".";
      cols.delete(col);
      diag1.delete(row - col);
      diag2.delete(row + col);
    }
  }

  backtrack(0);
  return result;
}

console.log("═══════════════════════════════════════");
console.log("7️⃣  N-QUEENS (N=5)");
console.log("═══════════════════════════════════════");
const nqResult = solveNQueensVisual(5);
console.log(`\n✅ Total solutions for 5-Queens: ${nqResult.length}\n`);


// ────────────────────────────────────────────────────────────
// 8️⃣  GENERATE VALID PARENTHESES
// ────────────────────────────────────────────────────────────
//
// WHAT:  Generate all strings of n pairs of well-formed
//        (balanced) parentheses. For n=3:
//        ((())), (()()), (())(), ()(()), ()()()
//        The count is the n-th Catalan number: C₃ = 5.
//
// WHY THIS APPROACH:
//   At each position we can place '(' or ')'. But not all choices
//   lead to valid strings. Two constraints:
//   1. We can add '(' only if open < n (haven't used all opens).
//   2. We can add ')' only if close < open (can't close more than
//      we've opened — that would make it unbalanced).
//   These constraints PRUNE the search tree so we only generate
//   valid strings — no wasted work.
//
// HOW (step-by-step):
//   1. Start with empty string, open=0, close=0.
//   2. If current.length === 2*n → complete valid string → record it.
//   3. If open < n → branch: add '(' and recurse.
//   4. If close < open → branch: add ')' and recurse.
//   5. The recursion naturally backtracks because we pass
//      `current + "("` as a new string (immutable), so no
//      explicit un-choose is needed.
//
// COMPLEXITY:
//   Time:  O(4^n / √n) — the n-th Catalan number bounds the output
//   Space: O(n) — recursion depth
//
// FUN FACT:
//   The Catalan number sequence: 1, 1, 2, 5, 14, 42, 132, ...
//   It appears in many combinatorial problems: valid parentheses,
//   binary search trees, polygon triangulations, and more.
// ────────────────────────────────────────────────────────────

function generateParenthesisWithLogging(n: number): string[] {
  const result: string[] = [];

  function backtrack(
    current: string,
    open: number,
    close: number,
    depth: number
  ): void {
    const indent = "  ".repeat(depth);

    // BASE CASE: string is complete (2n characters)
    if (current.length === 2 * n) {
      console.log(`${indent}🎯 Valid: "${current}"`);
      result.push(current);
      return;
    }

    // BRANCH 1: add '(' if we haven't used all n opening parens
    if (open < n) {
      console.log(
        `${indent}✅ Add '(' → "${current}(" (open=${open + 1}, close=${close})`
      );
      backtrack(current + "(", open + 1, close, depth + 1);
    }

    // BRANCH 2: add ')' if it won't make the string unbalanced
    if (close < open) {
      console.log(
        `${indent}✅ Add ')' → "${current})" (open=${open}, close=${close + 1})`
      );
      backtrack(current + ")", open, close + 1, depth + 1);
    }
  }

  backtrack("", 0, 0, 0);
  return result;
}

console.log("═══════════════════════════════════════");
console.log("8️⃣  GENERATE PARENTHESES (n=3)");
console.log("═══════════════════════════════════════");
const parenResult = generateParenthesisWithLogging(3);
console.log(`\n✅ All valid combinations of 3 pairs of parentheses:`);
parenResult.forEach((p, i) => console.log(`   ${i + 1}. ${p}`));
console.log(`   Total: ${parenResult.length} combinations (Catalan number C₃ = 5) ✓\n`);


// ────────────────────────────────────────────────────────────
// 📊 SUMMARY
// ────────────────────────────────────────────────────────────
//
// BACKTRACKING TEMPLATE (use this as a starting point):
//
//   function backtrack(state, choices, ...):
//     if (isComplete(state)):
//       record(state)
//       return
//     for choice in choices:
//       if (isValid(choice)):
//         make(choice)          // CHOOSE
//         backtrack(...)        // EXPLORE
//         undo(choice)          // UN-CHOOSE
//
// KEY DIFFERENCES BETWEEN PROBLEMS:
// ┌──────────────────┬────────────────────────────────────────┐
// │ Problem          │ Key Twist                              │
// ├──────────────────┼────────────────────────────────────────┤
// │ Subsets          │ Every path is a valid answer            │
// │ Permutations     │ Use ALL elements, order matters         │
// │ Combinations     │ Choose exactly k, order doesn't matter  │
// │ Combination Sum  │ Elements reusable, target constraint    │
// │ N-Queens         │ Constraint: no attacks (cols/diags)     │
// │ Parentheses      │ Constraint: open >= close at all times  │
// └──────────────────┴────────────────────────────────────────┘
// ────────────────────────────────────────────────────────────

console.log("═══════════════════════════════════════");
console.log("📊 SUMMARY OF RESULTS");
console.log("═══════════════════════════════════════");
console.log(`  1. factorial(5)           = ${factResult}`);
console.log(`  2. fib(6)                 = ${fibResult}`);
console.log(`  3. subsets([1,2,3])        → ${subsetResult.length} subsets`);
console.log(`  4. permutations([1,2,3])   → ${permResult.length} permutations`);
console.log(`  5. combinations C(5,3)     → ${combResult.length} combinations`);
console.log(`  6. combinationSum([2,3,6,7], 7) → ${csResult.length} solutions`);
console.log(`  7. 5-Queens                → ${nqResult.length} solutions`);
console.log(`  8. generateParentheses(3)  → ${parenResult.length} valid strings`);
console.log("\n✅ All examples complete!\n");
