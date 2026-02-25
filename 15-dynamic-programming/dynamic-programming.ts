export {};

// ============================================================================
// 📚 Chapter 15: Dynamic Programming — Runnable Examples
// ============================================================================
//
// Dynamic Programming (DP) is a technique for solving problems that have:
//   1. OPTIMAL SUBSTRUCTURE — the optimal solution uses optimal solutions
//      to smaller subproblems.
//   2. OVERLAPPING SUBPROBLEMS — the same subproblems are solved repeatedly.
//
// DP avoids redundant work by storing (caching) results. Two approaches:
//   • Top-Down (Memoization): Start from the big problem, recurse down,
//     cache results as you return back up.
//   • Bottom-Up (Tabulation): Start from the smallest subproblems, build
//     a table iteratively up to the answer.
//
// Run with: bun run dynamic-programming.ts
// ============================================================================


// ============================================================================
// 🔢 1. FIBONACCI — All 4 Approaches
// ============================================================================
//
// The Fibonacci sequence: 0, 1, 1, 2, 3, 5, 8, 13, 21, ...
// Each number = sum of the previous two:  F(n) = F(n-1) + F(n-2)
//
// This is THE canonical DP example because it perfectly illustrates
// overlapping subproblems. Consider the recursion tree for fib(5):
//
//                     fib(5)
//                   /        \
//              fib(4)        fib(3)      ← fib(3) is computed TWICE
//             /     \        /    \
//         fib(3)  fib(2)  fib(2) fib(1)  ← fib(2) is computed THREE times
//        /    \
//     fib(2) fib(1)
//
// Without caching, this explodes into O(2ⁿ) calls.
// With caching (memoization), each fib(k) is computed only ONCE → O(n).
//
// We show 4 approaches to demonstrate the DP evolution:
//   (A) Naive recursion:       O(2ⁿ) time, O(n) stack space
//   (B) Memoized (top-down):   O(n) time,  O(n) space (memo + stack)
//   (C) Tabulated (bottom-up): O(n) time,  O(n) space (table)
//   (D) Space-optimized:       O(n) time,  O(1) space (two variables)
// ============================================================================

// ── Approach A: Naive Recursion ──────────────────────────────────────────────
// WHY it's bad: Each call branches into TWO sub-calls, creating an exponential
// tree. For fib(40), this makes ~1 billion calls.
// HOW: Directly translate the mathematical definition F(n) = F(n-1) + F(n-2).
// Time: O(2ⁿ) | Space: O(n) call stack
function fibNaive(n: number): number {
  if (n <= 1) return n;
  return fibNaive(n - 1) + fibNaive(n - 2);
}

// ── Approach B: Memoized (Top-Down DP) ───────────────────────────────────────
// WHY it works: We still recurse, but we cache each fib(k) the first time
// we compute it. On subsequent calls, we return the cached value in O(1).
// This prunes the entire redundant subtree.
// HOW: Use a Map<number, number> as our memo cache. Before computing,
// check if the answer is already in the map.
// Time: O(n) | Space: O(n) for memo map + O(n) call stack = O(n)
function fibMemoized(n: number, memo: Map<number, number> = new Map()): number {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n)!;

  const result = fibMemoized(n - 1, memo) + fibMemoized(n - 2, memo);
  memo.set(n, result);
  return result;
}

// ── Approach C: Tabulated (Bottom-Up DP) ─────────────────────────────────────
// WHY it's often preferred: No recursion overhead (no stack frames, no risk of
// stack overflow for large n). We fill a table from the base cases upward.
// HOW: Create an array dp[] of size n+1. Set dp[0]=0, dp[1]=1.
// Then for i = 2..n:  dp[i] = dp[i-1] + dp[i-2].
// Real-world analogy: Instead of asking "what's fib(10)?" and diving down,
// imagine building a staircase: you know fib(0) and fib(1), so you can
// compute fib(2), then fib(3), etc., climbing up to fib(10).
// Time: O(n) | Space: O(n)
function fibTabulated(n: number): number {
  if (n <= 1) return n;
  const dp: number[] = new Array(n + 1);
  dp[0] = 0;
  dp[1] = 1;

  console.log(`  Building dp table for fib(${n}):`);
  console.log(`  dp[0] = ${dp[0]} (base case)`);
  console.log(`  dp[1] = ${dp[1]} (base case)`);

  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
    console.log(`  dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}`);
  }

  console.log(`  Final table: [${dp.join(", ")}]`);
  return dp[n];
}

// ── Approach D: Space-Optimized ──────────────────────────────────────────────
// WHY we can optimize space: At each step, dp[i] depends ONLY on dp[i-1]
// and dp[i-2]. We don't need the entire table — just the last two values.
// HOW: Maintain two variables (prev2, prev1) and slide them forward.
// Real-world analogy: You only need to remember the last two steps on the
// staircase, not the entire staircase you already climbed.
// Time: O(n) | Space: O(1) — this is the optimal solution!
function fibSpaceOptimized(n: number): number {
  if (n <= 1) return n;
  let prev2 = 0;
  let prev1 = 1;

  console.log(`  Space-optimized fib(${n}):`);
  console.log(`  Start: prev2=${prev2}, prev1=${prev1}`);

  for (let i = 2; i <= n; i++) {
    const curr = prev1 + prev2;
    console.log(`  i=${i}: curr = ${prev1} + ${prev2} = ${curr}`);
    prev2 = prev1;
    prev1 = curr;
  }

  return prev1;
}

// ── Demo Runner ──────────────────────────────────────────────────────────────
function demoFibonacci(): void {
  console.log("=".repeat(70));
  console.log("🔢 FIBONACCI — Four Approaches");
  console.log("=".repeat(70));

  const n = 10;

  console.log(`\n--- Naive Recursion O(2ⁿ) ---`);
  console.log(`  fib(${n}) = ${fibNaive(n)}`);

  console.log(`\n--- Memoized (Top-Down) O(n) ---`);
  console.log(`  fib(${n}) = ${fibMemoized(n)}`);

  console.log(`\n--- Tabulated (Bottom-Up) O(n) ---`);
  const tabResult = fibTabulated(n);
  console.log(`  fib(${n}) = ${tabResult}`);

  console.log(`\n--- Space-Optimized O(n) time, O(1) space ---`);
  const optResult = fibSpaceOptimized(n);
  console.log(`  fib(${n}) = ${optResult}`);
}


// ============================================================================
// 🧗 2. CLIMBING STAIRS
// ============================================================================
//
// Problem: You're climbing a staircase with n steps. Each time you can
// climb 1 or 2 steps. How many distinct ways can you reach the top?
//
// Why DP? To reach step i, you either came from step i-1 (took 1 step)
// or step i-2 (took 2 steps). So:
//   dp[i] = dp[i-1] + dp[i-2]
//
// This is essentially Fibonacci with different base cases!
//   dp[0] = 1 (1 way to "stay" at the ground — do nothing)
//   dp[1] = 1 (1 way to reach step 1 — one single step)
//
// Real-world analogy: Think of a staircase in a building. To reach any
// step, count the paths from the two steps directly below it and add
// them up. The number of paths accumulates exactly like Fibonacci.
//
// Time: O(n) | Space: O(n) — can be optimized to O(1) like fib
// ============================================================================

function climbStairs(n: number): number {
  const dp: number[] = new Array(n + 1);
  dp[0] = 1;
  dp[1] = 1;

  console.log(`  Building dp table for climbStairs(${n}):`);
  console.log(`  dp[0] = ${dp[0]} (1 way to stay at ground)`);
  console.log(`  dp[1] = ${dp[1]} (1 way to reach step 1)`);

  // Fill the table: each step is the sum of the two steps below it
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
    console.log(`  dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}`);
  }

  // Visual bar chart showing how the number of ways grows
  console.log(`\n  Visual staircase:`);
  for (let i = n; i >= 0; i--) {
    const bar = "█".repeat(dp[i]);
    console.log(`  Step ${String(i).padStart(2)}: ${bar} (${dp[i]} ways)`);
  }

  return dp[n];
}

function demoClimbingStairs(): void {
  console.log("\n" + "=".repeat(70));
  console.log("🧗 CLIMBING STAIRS");
  console.log("=".repeat(70));

  const n = 8;
  console.log(`\n  How many ways to climb ${n} stairs (1 or 2 steps at a time)?\n`);
  const result = climbStairs(n);
  console.log(`\n  ✅ Answer: ${result} ways`);
}


// ============================================================================
// 🏠 3. HOUSE ROBBER
// ============================================================================
//
// Problem: You're a robber planning to rob houses along a street. Each
// house has a certain amount of money, but adjacent houses have connected
// security systems — if you rob two adjacent houses, alarms go off.
// Maximize the total amount you can rob without triggering any alarm.
//
// Why DP? At each house, you face a choice:
//   (1) SKIP this house → your best total so far stays dp[i-1]
//   (2) ROB this house  → you get nums[i] + dp[i-2]
//       (you MUST skip the previous house, so add to dp[i-2])
//
// State:      dp[i] = max money robbing among houses 0..i
// Transition: dp[i] = max(dp[i-1], dp[i-2] + nums[i])
// Base cases: dp[0] = nums[0]
//             dp[1] = max(nums[0], nums[1])
//
// Real-world analogy: Imagine picking seats in a theater — you want the
// best seats but can't sit in two adjacent ones. At each seat, you
// decide: take this seat (and skip the one before) or skip this seat
// (and keep whatever was best so far).
//
// Time: O(n) | Space: O(n) — can be optimized to O(1) with two vars
// ============================================================================

function rob(nums: number[]): number {
  const n = nums.length;
  if (n === 0) return 0;
  if (n === 1) return nums[0];

  const dp: number[] = new Array(n);
  dp[0] = nums[0];
  dp[1] = Math.max(nums[0], nums[1]);

  console.log(`  Houses: [${nums.join(", ")}]`);
  console.log(`  dp[0] = ${dp[0]} (rob house 0)`);
  console.log(`  dp[1] = max(${nums[0]}, ${nums[1]}) = ${dp[1]} (best of first two)`);

  for (let i = 2; i < n; i++) {
    const robCurrent = dp[i - 2] + nums[i];
    const skipCurrent = dp[i - 1];
    dp[i] = Math.max(skipCurrent, robCurrent);
    console.log(
      `  dp[${i}] = max(skip=${skipCurrent}, rob=${dp[i - 2]}+${nums[i]}=${robCurrent}) = ${dp[i]}`
    );
  }

  console.log(`\n  dp table: [${dp.join(", ")}]`);
  return dp[n - 1];
}

function demoHouseRobber(): void {
  console.log("\n" + "=".repeat(70));
  console.log("🏠 HOUSE ROBBER");
  console.log("=".repeat(70));

  const houses = [2, 7, 9, 3, 1, 5, 8];
  console.log(`\n  Can't rob adjacent houses. Maximize total.\n`);
  const result = rob(houses);
  console.log(`\n  ✅ Maximum robbery: $${result}`);
}


// ============================================================================
// 💰 4. COIN CHANGE — Top-Down AND Bottom-Up
// ============================================================================
//
// Problem: Given a set of coin denominations and a target amount, find
// the MINIMUM number of coins needed to make that amount.
// Example: coins = [1, 3, 4], amount = 6 → answer is 2 (use 3+3)
//
// Why DP? This has OVERLAPPING SUBPROBLEMS:
//   To solve amount=6, we try each coin and ask:
//     "What's the min coins for amount=5?" (used coin 1)
//     "What's the min coins for amount=3?" (used coin 3)
//     "What's the min coins for amount=2?" (used coin 4)
//   And each of those sub-amounts spawns more sub-problems that overlap.
//
// Why NOT greedy? Greedy would always pick the largest coin first.
//   For coins [1, 3, 4] and amount 6:
//     Greedy: 4 + 1 + 1 = 3 coins ❌
//     DP:     3 + 3     = 2 coins ✅
//
// State:      dp[i] = minimum coins needed to make amount i
// Transition: dp[i] = min(dp[i - coin] + 1) for each coin where i-coin >= 0
// Base case:  dp[0] = 0 (zero coins for zero amount)
//
// Time: O(amount × coins) | Space: O(amount)
// ============================================================================

// ── Top-Down (Memoization) ───────────────────────────────────────────────────
// HOW: Recursively break the problem down. For each remaining amount,
// try subtracting each coin and recurse. Cache results so each amount
// is solved only once.
function coinChangeTopDown(coins: number[], amount: number): number {
  const memo = new Map<number, number>();
  let callCount = 0;

  function dp(remaining: number): number {
    callCount++;
    if (remaining === 0) return 0;
    if (remaining < 0) return Infinity;
    if (memo.has(remaining)) {
      console.log(`  dp(${remaining}) → cache hit! = ${memo.get(remaining)}`);
      return memo.get(remaining)!;
    }

    let minCoins = Infinity;
    for (const coin of coins) {
      const result = dp(remaining - coin);
      if (result + 1 < minCoins) {
        minCoins = result + 1;
      }
    }

    memo.set(remaining, minCoins);
    console.log(`  dp(${remaining}) = ${minCoins === Infinity ? "∞" : minCoins} (computed)`);
    return minCoins;
  }

  const result = dp(amount);
  console.log(`  Total function calls: ${callCount}`);
  return result === Infinity ? -1 : result;
}

// ── Bottom-Up (Tabulation) ───────────────────────────────────────────────────
// HOW: Build a table from amount=0 up to the target. For each amount i,
// try every coin denomination. If coin fits (i-coin >= 0), check if
// using that coin improves the solution: dp[i] = min(dp[i], dp[i-coin]+1).
// The table reveals the answer at dp[amount].
function coinChangeBottomUp(coins: number[], amount: number): number {
  const dp: number[] = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  console.log(`  Coins: [${coins.join(", ")}], Amount: ${amount}`);
  console.log(`  dp[0] = 0 (base case)\n`);

  for (let i = 1; i <= amount; i++) {
    const candidates: string[] = [];
    for (const coin of coins) {
      if (i - coin >= 0 && dp[i - coin] !== Infinity) {
        candidates.push(`dp[${i - coin}]+1=${dp[i - coin] + 1} (use coin ${coin})`);
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
    const val = dp[i] === Infinity ? "∞" : String(dp[i]);
    if (candidates.length > 0) {
      console.log(`  dp[${String(i).padStart(2)}] = ${val}  ← min(${candidates.join(", ")})`);
    } else {
      console.log(`  dp[${String(i).padStart(2)}] = ∞   ← no coin fits`);
    }
  }

  const tableStr = dp.map((v) => (v === Infinity ? "∞" : String(v))).join(", ");
  console.log(`\n  Final table: [${tableStr}]`);

  return dp[amount] === Infinity ? -1 : dp[amount];
}

function demoCoinChange(): void {
  console.log("\n" + "=".repeat(70));
  console.log("💰 COIN CHANGE — Top-Down vs Bottom-Up");
  console.log("=".repeat(70));

  const coins = [1, 3, 4];
  const amount = 10;

  console.log(`\n--- Top-Down (Memoization) ---\n`);
  const result1 = coinChangeTopDown(coins, amount);
  console.log(`  ✅ Min coins for ${amount}: ${result1}`);

  console.log(`\n--- Bottom-Up (Tabulation) ---\n`);
  const result2 = coinChangeBottomUp(coins, amount);
  console.log(`\n  ✅ Min coins for ${amount}: ${result2}`);
}


// ============================================================================
// 📈 5. LONGEST INCREASING SUBSEQUENCE (LIS)
// ============================================================================
//
// Problem: Given an array of integers, find the length of the longest
// strictly increasing subsequence (not necessarily contiguous).
// Example: [10, 9, 2, 5, 3, 7, 101, 18] → LIS = [2, 3, 7, 18], length 4
//
// Why DP? For each element, we need to know the length of the best
// increasing subsequence ending at every earlier element. These are
// overlapping subproblems — many elements share prefix subsequences.
//
// State:      dp[i] = length of the longest increasing subsequence
//             ending at index i (i.e., nums[i] is the LAST element)
// Transition: dp[i] = max(dp[j] + 1) for all j < i where nums[j] < nums[i]
//             In words: look at every earlier element that's smaller,
//             take the best subsequence ending there, and extend it by 1.
// Base case:  dp[i] = 1 for all i (each element alone is a subsequence)
//
// Real-world analogy: Imagine stacking blocks — each block must be taller
// than the one below. For each new block, you scan all existing stacks
// and pick the tallest one it can go on top of.
//
// Time: O(n²) | Space: O(n)
// Note: An O(n log n) solution exists using patience sorting (binary
// search on tails), but the O(n²) DP version is clearer for learning.
// ============================================================================

function lengthOfLIS(nums: number[]): number {
  const n = nums.length;
  // Initialize: every element is a subsequence of length 1 by itself
  const dp: number[] = new Array(n).fill(1);

  console.log(`  Array: [${nums.join(", ")}]\n`);

  for (let i = 1; i < n; i++) {
    const contributions: string[] = [];
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        if (dp[j] + 1 > dp[i]) {
          dp[i] = dp[j] + 1;
          contributions.push(`dp[${j}]+1=${dp[j]}`);
        }
      }
    }
    const detail = contributions.length > 0 ? contributions.join(", ") : "no j with nums[j] < nums[i]";
    console.log(`  dp[${i}] (nums[${i}]=${nums[i]}): ${dp[i]}  ← ${detail}`);
  }

  const maxLen = Math.max(...dp);
  console.log(`\n  dp table: [${dp.join(", ")}]`);

  // ── Reconstruct one actual LIS by backtracking through the dp table ──
  // Walk backwards, collecting elements whose dp value counts down from maxLen
  const lis: number[] = [];
  let target = maxLen;
  for (let i = n - 1; i >= 0; i--) {
    if (dp[i] === target) {
      lis.unshift(nums[i]);
      target--;
    }
  }
  console.log(`  One LIS: [${lis.join(", ")}]`);

  return maxLen;
}

function demoLIS(): void {
  console.log("\n" + "=".repeat(70));
  console.log("📈 LONGEST INCREASING SUBSEQUENCE");
  console.log("=".repeat(70));

  const nums = [10, 9, 2, 5, 3, 7, 101, 18];
  console.log(`\n  Find the longest strictly increasing subsequence.\n`);
  const result = lengthOfLIS(nums);
  console.log(`\n  ✅ Length of LIS: ${result}`);
}


// ============================================================================
// 🤖 6. UNIQUE PATHS (2D Grid)
// ============================================================================
//
// Problem: A robot is at the top-left corner of an m×n grid. It can
// only move RIGHT or DOWN. How many unique paths exist to reach the
// bottom-right corner?
//
// Why DP? Every cell (i,j) can only be reached from (i-1,j) [above]
// or (i,j-1) [left]. The number of paths to (i,j) is the SUM of the
// paths to those two cells. Classic overlapping subproblems.
//
// State:      dp[i][j] = number of unique paths to reach cell (i, j)
// Transition: dp[i][j] = dp[i-1][j] + dp[i][j-1]
// Base cases: dp[i][0] = 1 for all i (only one way down the first column)
//             dp[0][j] = 1 for all j (only one way across the first row)
//
// Real-world analogy: Think of a city grid — to count routes from your
// home (top-left) to work (bottom-right) when you can only go east or
// south. At every intersection, the number of routes equals the sum of
// routes from the north + routes from the west.
//
// Time: O(m × n) | Space: O(m × n) — can be optimized to O(n) with
// a single row since each row only depends on the previous row.
// ============================================================================

function uniquePaths(m: number, n: number): number {
  const dp: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));

  // Base cases: first row and first column have exactly 1 path each
  // (you can only go straight right or straight down — no choices)
  for (let i = 0; i < m; i++) dp[i][0] = 1;
  for (let j = 0; j < n; j++) dp[0][j] = 1;

  console.log(`  Grid size: ${m} × ${n}`);
  console.log(`  Base cases: first row and first column = 1\n`);

  // Fill remaining cells: each cell = paths from above + paths from left
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
    }
  }

  // Print the completed table for visual understanding
  console.log("  Completed DP Table:");
  console.log("  " + "─".repeat(n * 6 + 1));
  for (let i = 0; i < m; i++) {
    const row = dp[i].map((v) => String(v).padStart(5)).join(" ");
    const label = i === 0 && 0 === 0 ? " 🤖" : i === m - 1 ? " 🏁" : "   ";
    console.log(`  |${row} |${label}`);
  }
  console.log("  " + "─".repeat(n * 6 + 1));

  return dp[m - 1][n - 1];
}

function demoUniquePaths(): void {
  console.log("\n" + "=".repeat(70));
  console.log("🤖 UNIQUE PATHS — 2D Grid DP");
  console.log("=".repeat(70));

  const m = 4, n = 5;
  console.log(`\n  Robot at top-left, count paths to bottom-right (only right/down).\n`);
  const result = uniquePaths(m, n);
  console.log(`\n  ✅ Unique paths in ${m}×${n} grid: ${result}`);
}


// ============================================================================
// 🔤 7. LONGEST COMMON SUBSEQUENCE (LCS) — 2D Table with Visual
// ============================================================================
//
// Problem: Given two strings, find the length of their longest common
// subsequence. A subsequence is a sequence derived by deleting zero or
// more characters WITHOUT changing the order of remaining characters.
// Example: "abcdef" and "acbcf" → LCS = "abcf", length 4
//
// Why DP? Comparing two strings character-by-character creates a tree
// of choices that has massive overlap. Each (i,j) pair — "best LCS
// using first i chars of text1 and first j chars of text2" — repeats.
//
// State:      dp[i][j] = length of LCS of text1[0..i-1] and text2[0..j-1]
//
// Transition:
//   IF text1[i-1] == text2[j-1]:
//     Characters match! Extend the LCS:
//     dp[i][j] = dp[i-1][j-1] + 1
//   ELSE:
//     Characters don't match. Take the better of:
//     dp[i][j] = max(dp[i-1][j], dp[i][j-1])
//       ↑ skip char from text1    ↑ skip char from text2
//
// Base case:  dp[0][j] = 0 for all j (empty text1 → LCS = 0)
//             dp[i][0] = 0 for all i (empty text2 → LCS = 0)
//
// Real-world analogy: Think of two DNA strands. You're trying to find
// the longest sequence of nucleotides that appears in both strands (in
// order, but not necessarily adjacent). This is literally how bioinformatics
// tools like BLAST work.
//
// Time: O(m × n) | Space: O(m × n)
// ============================================================================

function longestCommonSubsequence(text1: string, text2: string): number {
  const m = text1.length;
  const n = text2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  console.log(`  text1: "${text1}"`);
  console.log(`  text2: "${text2}"\n`);

  // Fill the 2D table comparing each character pair
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Print the 2D table with row/column headers for visual clarity
  console.log("  " + "   " + " ".repeat(3) + Array.from(text2).map((c) => c.padStart(3)).join(""));
  console.log("  " + "   " + dp[0].map((v) => String(v).padStart(3)).join(""));

  for (let i = 1; i <= m; i++) {
    const rowLabel = text1[i - 1];
    const rowValues = dp[i].map((v) => String(v).padStart(3)).join("");
    console.log(`  ${rowLabel}  ${rowValues}`);
  }

  // ── Reconstruct the actual LCS string by backtracking ──
  // Start at dp[m][n] and trace back: if characters match, they're in
  // the LCS. Otherwise, move toward the larger neighbor.
  let lcs = "";
  let i = m, j = n;
  while (i > 0 && j > 0) {
    if (text1[i - 1] === text2[j - 1]) {
      lcs = text1[i - 1] + lcs;
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  console.log(`\n  LCS: "${lcs}"`);
  return dp[m][n];
}

function demoLCS(): void {
  console.log("\n" + "=".repeat(70));
  console.log("🔤 LONGEST COMMON SUBSEQUENCE — 2D Table");
  console.log("=".repeat(70));

  console.log(`\n  Find the longest common subsequence of two strings.\n`);
  const result = longestCommonSubsequence("abcdef", "acbcf");
  console.log(`\n  ✅ LCS length: ${result}`);

  console.log(`\n  --- Another example ---\n`);
  const result2 = longestCommonSubsequence("AGGTAB", "GXTXAYB");
  console.log(`\n  ✅ LCS length: ${result2}`);
}


// ============================================================================
// 🎒 8. 0/1 KNAPSACK
// ============================================================================
//
// Problem: You have n items, each with a weight and a value. You have a
// knapsack with a weight capacity W. Maximize the total value of items
// you can carry WITHOUT exceeding the weight limit. Each item can be
// taken at most once (hence "0/1" — take it or leave it).
//
// Why DP? At each item, you make a binary choice: take or skip. A brute
// force approach tries all 2ⁿ subsets. DP reduces this by recognizing
// that many subsets share the same "remaining capacity" subproblem.
//
// State:      dp[i][w] = max value using items 0..i-1 with capacity w
//
// Transition: For item i (0-indexed as i-1):
//   SKIP item i:  dp[i][w] = dp[i-1][w]
//   TAKE item i:  dp[i][w] = dp[i-1][w - weight[i-1]] + value[i-1]
//                 (only if weight[i-1] <= w)
//   dp[i][w] = max(skip, take)
//
// Base case:  dp[0][w] = 0 for all w (no items → no value)
//
// Real-world analogy: You're packing for a camping trip with a weight
// limit on your backpack. Each item (tent, food, water, etc.) has a
// weight and a "usefulness" value. You want maximum usefulness without
// breaking the weight limit. For each item you ask: "Is it worth
// carrying this, given how much space it takes up?"
//
// Time: O(n × W) | Space: O(n × W) — can be optimized to O(W) with
// a 1D array since each row depends only on the previous row.
// ============================================================================

function knapsack(
  weights: number[],
  values: number[],
  capacity: number,
  itemNames: string[]
): number {
  const n = weights.length;
  const dp: number[][] = Array.from(
    { length: n + 1 },
    () => new Array(capacity + 1).fill(0)
  );

  console.log(`  Items:`);
  for (let i = 0; i < n; i++) {
    console.log(`    ${itemNames[i]}: weight=${weights[i]}, value=${values[i]}`);
  }
  console.log(`  Capacity: ${capacity}\n`);

  // Build the table row by row (one row per item considered)
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      dp[i][w] = dp[i - 1][w]; // default: skip this item
      if (weights[i - 1] <= w) {
        const takeValue = dp[i - 1][w - weights[i - 1]] + values[i - 1];
        if (takeValue > dp[i][w]) {
          dp[i][w] = takeValue;
        }
      }
    }
    const row = dp[i].map((v) => String(v).padStart(3)).join("");
    console.log(`  After considering ${itemNames[i - 1].padEnd(10)}: [${row} ]`);
  }

  // Print the full DP table for inspection
  console.log(`\n  Full DP Table (rows=items, cols=capacity 0..${capacity}):`);
  const capHeader = Array.from({ length: capacity + 1 }, (_, i) => String(i).padStart(3)).join("");
  console.log(`  ${"".padEnd(12)} ${capHeader}`);
  console.log(`  ${"(none)".padEnd(12)} ${dp[0].map((v) => String(v).padStart(3)).join("")}`);
  for (let i = 1; i <= n; i++) {
    console.log(`  ${itemNames[i - 1].padEnd(12)} ${dp[i].map((v) => String(v).padStart(3)).join("")}`);
  }

  // ── Reconstruct which items were taken ──
  // Walk backwards through the table: if dp[i][w] differs from dp[i-1][w],
  // item i was taken. Subtract its weight and continue.
  const taken: string[] = [];
  let w = capacity;
  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      taken.unshift(itemNames[i - 1]);
      w -= weights[i - 1];
    }
  }

  console.log(`\n  Items taken: [${taken.join(", ")}]`);
  console.log(`  Total weight: ${weights.filter((_, i) => taken.includes(itemNames[i])).reduce((a, b) => a + b, 0)}`);

  return dp[n][capacity];
}

function demoKnapsack(): void {
  console.log("\n" + "=".repeat(70));
  console.log("🎒 0/1 KNAPSACK");
  console.log("=".repeat(70));

  const itemNames = ["Laptop", "Guitar", "Headphones", "Book", "Camera"];
  const weights = [3, 1, 2, 1, 4];
  const values = [4, 2, 3, 1, 5];
  const capacity = 7;

  console.log(`\n  Maximize value within weight limit. Each item: take or skip.\n`);
  const result = knapsack(weights, values, capacity, itemNames);
  console.log(`\n  ✅ Maximum value: ${result}`);
}


// ============================================================================
// 🚀 RUN ALL DEMOS
// ============================================================================

function main(): void {
  console.log("╔══════════════════════════════════════════════════════════════════════╗");
  console.log("║       📚 Chapter 15: Dynamic Programming — Live Examples           ║");
  console.log("╚══════════════════════════════════════════════════════════════════════╝");

  demoFibonacci();
  demoClimbingStairs();
  demoHouseRobber();
  demoCoinChange();
  demoLIS();
  demoUniquePaths();
  demoLCS();
  demoKnapsack();

  console.log("\n" + "=".repeat(70));
  console.log("🎯 All Dynamic Programming demos complete!");
  console.log("=".repeat(70));
}

main();
