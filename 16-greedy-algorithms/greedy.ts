export {};

// ============================================================================
// 📚 Chapter 16: Greedy Algorithms — Runnable Examples
// ============================================================================
//
// A GREEDY algorithm makes the locally optimal choice at each step,
// hoping it leads to a globally optimal solution. It NEVER reconsiders
// past decisions (unlike DP, which explores all options).
//
// When does greedy work?
//   1. GREEDY CHOICE PROPERTY — a locally optimal choice leads to a
//      globally optimal solution.
//   2. OPTIMAL SUBSTRUCTURE — an optimal solution contains optimal
//      solutions to its subproblems.
//
// When does greedy FAIL?
//   When the locally best choice doesn't lead to the global best.
//   Classic example: Coin Change with denominations [1, 3, 4] and amount 6.
//     Greedy picks 4+1+1 = 3 coins, but optimal is 3+3 = 2 coins.
//   (We demonstrate this failure at the end of this file!)
//
// Run with: bun run greedy.ts
// ============================================================================


// ============================================================================
// 🔗 1. NON-OVERLAPPING INTERVALS (LeetCode 435)
// ============================================================================
//
// Problem: Given a collection of intervals, find the minimum number of
// intervals to REMOVE so that the remaining intervals don't overlap.
//
// Why greedy? Sort by END time. Then greedily keep intervals that start
// AFTER the previous one ends. This maximizes the number of non-overlapping
// intervals we can keep — and minimizing removals is the complement.
//
// WHY sort by end time (not start time)?
//   Sorting by end time ensures we always pick the interval that "finishes
//   earliest," leaving maximum room for subsequent intervals. This is the
//   classic Activity Selection strategy.
//
// Real-world analogy: You're scheduling meetings in one conference room.
//   Each meeting has a start and end time. To fit the MOST meetings,
//   always pick the one that ends earliest — it frees up the room sooner.
//
// Algorithm:
//   1. Sort intervals by end time
//   2. Keep the first interval (it ends earliest)
//   3. For each subsequent interval:
//      - If it starts >= last kept interval's end → keep it (no overlap)
//      - Otherwise → skip it (overlaps, must remove)
//   4. Answer = total intervals - kept intervals
//
// Time: O(n log n) for sorting | Space: O(1) extra (in-place sort)
// ============================================================================

function eraseOverlapIntervals(intervals: number[][]): number {
  if (intervals.length === 0) return 0;

  // Sort by end time — the key greedy insight
  intervals.sort((a, b) => a[1] - b[1]);
  let kept = 1;
  let lastEnd = intervals[0][1];

  console.log(`  Sorted by end time: ${JSON.stringify(intervals)}`);
  console.log(`  ✅ Keep [${intervals[0]}] (first interval)`);

  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] >= lastEnd) {
      console.log(`  ✅ Keep [${intervals[i]}] — starts at ${intervals[i][0]} >= lastEnd ${lastEnd}`);
      kept++;
      lastEnd = intervals[i][1];
    } else {
      console.log(`  ❌ Skip [${intervals[i]}] — starts at ${intervals[i][0]} < lastEnd ${lastEnd} (overlap)`);
    }
  }

  console.log(`  Kept ${kept}, removed ${intervals.length - kept}`);
  return intervals.length - kept;
}

console.log("═══ 1. Non-overlapping Intervals (LC 435) ═══");
console.log("Input: [[1,2],[2,3],[3,4],[1,3]]");
const removed = eraseOverlapIntervals([[1, 2], [2, 3], [3, 4], [1, 3]]);
console.log(`Result: ${removed} interval(s) removed\n`);


// ============================================================================
// 🔗 2. MERGE INTERVALS (LeetCode 56)
// ============================================================================
//
// Problem: Given a collection of intervals, merge all overlapping intervals
// and return the resulting non-overlapping intervals.
//
// Why greedy? Sort by START time. Then scan left-to-right. For each
// interval, if it overlaps with the last merged interval (its start <=
// last merged end), extend the merged interval. Otherwise, start a new one.
//
// WHY sort by start time here (unlike problem 1)?
//   We want to group overlapping intervals together. Sorting by start
//   ensures that intervals that could overlap are adjacent in our scan.
//   Two intervals overlap if and only if the second one starts before
//   the first one ends.
//
// Real-world analogy: You have a list of time blocks when you're busy.
//   Some overlap (meeting 9-11 and meeting 10-12). Merge them into one
//   block (9-12) to see your actual busy periods.
//
// Algorithm:
//   1. Sort intervals by start time
//   2. Start with the first interval in a "merged" list
//   3. For each subsequent interval:
//      - If it starts <= last merged interval's end → merge (extend end)
//      - Otherwise → push as a new separate interval
//
// Time: O(n log n) for sorting | Space: O(n) for output
// ============================================================================

function merge(intervals: number[][]): number[][] {
  intervals.sort((a, b) => a[0] - b[0]);
  const merged: number[][] = [intervals[0]];

  console.log(`  Sorted by start: ${JSON.stringify(intervals)}`);

  for (let i = 1; i < intervals.length; i++) {
    const last = merged[merged.length - 1];
    if (intervals[i][0] <= last[1]) {
      const oldEnd = last[1];
      last[1] = Math.max(last[1], intervals[i][1]);
      console.log(`  🔗 Merge [${intervals[i]}] into [${last[0]},${oldEnd}] → [${last}]`);
    } else {
      merged.push(intervals[i]);
      console.log(`  ➕ New interval [${intervals[i]}] (no overlap with [${last}])`);
    }
  }
  return merged;
}

console.log("═══ 2. Merge Intervals (LC 56) ═══");
console.log("Input: [[1,3],[2,6],[8,10],[15,18]]");
const merged = merge([[1, 3], [2, 6], [8, 10], [15, 18]]);
console.log(`Result: ${JSON.stringify(merged)}\n`);


// ============================================================================
// 🦘 3. JUMP GAME I (LeetCode 55)
// ============================================================================
//
// Problem: Given an array where nums[i] is the max jump length from
// position i, determine if you can reach the last index starting from
// index 0.
//
// Why greedy? We don't need to find the actual path — just whether
// reaching the end is POSSIBLE. Track the "farthest reachable index."
// At each position, update farthest = max(farthest, i + nums[i]).
// If we ever reach an index beyond farthest, we're stuck.
//
// Real-world analogy: Imagine lily pads on a pond. Each lily pad has a
// number telling you the maximum distance you can jump from it. Starting
// at the first pad, can you reach the last one? Just track how far you
// could possibly reach at each step.
//
// Algorithm:
//   1. Initialize farthest = 0
//   2. For each index i from 0 to n-1:
//      - If i > farthest → stuck, return false
//      - Update farthest = max(farthest, i + nums[i])
//      - If farthest >= last index → return true
//
// Time: O(n) | Space: O(1) — single pass, one variable
// ============================================================================

function canJump(nums: number[]): boolean {
  let farthest = 0;

  for (let i = 0; i < nums.length; i++) {
    if (i > farthest) {
      console.log(`  ❌ Stuck at index ${i} — farthest reachable was ${farthest}`);
      return false;
    }
    const newFarthest = Math.max(farthest, i + nums[i]);
    if (newFarthest !== farthest) {
      console.log(`  idx ${i} (val=${nums[i]}): farthest ${farthest} → ${newFarthest}`);
    } else {
      console.log(`  idx ${i} (val=${nums[i]}): farthest stays ${farthest}`);
    }
    farthest = newFarthest;
    if (farthest >= nums.length - 1) {
      console.log(`  ✅ Can reach end! farthest=${farthest} >= last index=${nums.length - 1}`);
      return true;
    }
  }
  return true;
}

console.log("═══ 3a. Jump Game I — Reachable ═══");
console.log("Input: [2, 3, 1, 1, 4]");
console.log(`Result: ${canJump([2, 3, 1, 1, 4])}\n`);

console.log("═══ 3b. Jump Game I — Unreachable ═══");
console.log("Input: [3, 2, 1, 0, 4]");
console.log(`Result: ${canJump([3, 2, 1, 0, 4])}\n`);


// ============================================================================
// 🦘 4. JUMP GAME II (LeetCode 45)
// ============================================================================
//
// Problem: Same setup as Jump Game I, but now find the MINIMUM number
// of jumps to reach the last index. (Guaranteed reachable.)
//
// Why greedy? Use a BFS-like approach where each "level" represents
// one jump. Within the current jump's range, find the farthest we can
// reach. When we exhaust the current range, that's one jump — and we
// start a new range from farthest.
//
// HOW it works (BFS analogy):
//   - "currentEnd" = the rightmost index reachable with the current
//     number of jumps (like the boundary of a BFS level).
//   - "farthest" = the farthest we COULD reach from any index in the
//     current level (like scanning all nodes in one BFS level).
//   - When i reaches currentEnd, we MUST jump. That's jump #(++jumps).
//     The new currentEnd becomes farthest.
//
// Real-world analogy: Think of it as spreading waves. The first wave
// covers indices reachable in 1 jump. From those indices, the second
// wave covers what's reachable in 2 jumps, etc. We count waves.
//
// Time: O(n) | Space: O(1) — single pass with 3 variables
// ============================================================================

function jump(nums: number[]): number {
  let jumps = 0;
  let currentEnd = 0;
  let farthest = 0;

  for (let i = 0; i < nums.length - 1; i++) {
    farthest = Math.max(farthest, i + nums[i]);
    console.log(`  idx ${i} (val=${nums[i]}): farthest=${farthest}, currentEnd=${currentEnd}`);

    // When we reach the end of the current jump's range, we must jump
    if (i === currentEnd) {
      jumps++;
      currentEnd = farthest;
      console.log(`  🦘 JUMP #${jumps}! New range extends to index ${currentEnd}`);
      if (currentEnd >= nums.length - 1) break;
    }
  }
  return jumps;
}

console.log("═══ 4. Jump Game II (LC 45) ═══");
console.log("Input: [2, 3, 1, 1, 4]");
const minJumps = jump([2, 3, 1, 1, 4]);
console.log(`Result: ${minJumps} jumps\n`);


// ============================================================================
// 📈 5. BEST TIME TO BUY AND SELL STOCK II (LeetCode 122)
// ============================================================================
//
// Problem: Given daily stock prices, find the maximum profit. You can
// buy and sell multiple times (but must sell before buying again).
//
// Why greedy? Key insight: collecting EVERY consecutive price increase
// is equivalent to finding the optimal set of buy-sell pairs.
//
// WHY this works (proof intuition):
//   Any profitable sequence buy@day1 → sell@day5 with price going
//   1→3→2→4→5 gives profit = 5-1 = 4.
//   But collecting each increase: (3-1) + (4-2) + (5-4) = 2+2+1 = 5.
//   Wait — that's even MORE! Because we skip the dip from 3→2.
//   In general, summing all positive daily changes captures every
//   upswing and skips every downswing — which is provably optimal.
//
// Real-world analogy: A day trader who buys every morning the price
// will go up and sells every evening. Perfect information = perfect
// timing. Just add up all the days the price went up.
//
// Algorithm:
//   For each consecutive pair of days:
//     If price went up → add the difference to profit
//     If price went down → skip (don't lose money)
//
// Time: O(n) | Space: O(1) — single pass, one accumulator
// ============================================================================

function maxProfit(prices: number[]): number {
  let profit = 0;

  for (let i = 1; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff > 0) {
      profit += diff;
      console.log(`  Day ${i - 1}→${i}: price ${prices[i - 1]}→${prices[i]}, gain +${diff} 📈 (total: ${profit})`);
    } else {
      console.log(`  Day ${i - 1}→${i}: price ${prices[i - 1]}→${prices[i]}, change ${diff} 📉 (skip)`);
    }
  }
  return profit;
}

console.log("═══ 5. Best Time to Buy and Sell Stock II (LC 122) ═══");
console.log("Input: [7, 1, 5, 3, 6, 4]");
const totalProfit = maxProfit([7, 1, 5, 3, 6, 4]);
console.log(`Result: max profit = ${totalProfit}\n`);


// ============================================================================
// ⛽ 6. GAS STATION (LeetCode 134)
// ============================================================================
//
// Problem: There are n gas stations along a circular route. Station i
// has gas[i] fuel and costs cost[i] fuel to travel to station i+1.
// Starting with an empty tank, find the station index to start at so
// you can complete the full circuit. Return -1 if impossible.
//
// Why greedy? Two key insights:
//   1. If total gas >= total cost, a solution EXISTS (provable).
//   2. If we track a running surplus and it goes negative at station i,
//      then NONE of stations 0..i can be the start (because they all
//      lead to a deficit by station i). So restart from station i+1.
//
// WHY can't stations 0..i work?
//   If starting from station 0 causes a deficit at station i, what about
//   starting from station 1? Station 1's path passes through the same
//   "problematic" stations 2..i, and it arrives at them with LESS fuel
//   (because it skipped station 0's contribution). So it's even worse.
//   This argument applies to all stations 0..i — none of them work.
//
// Real-world analogy: Imagine driving a circular highway with gas stations.
//   If you run out of gas at some point, you know you should have started
//   from somewhere AFTER that point. You don't need to test every start.
//
// Algorithm:
//   1. Track totalSurplus and currentSurplus
//   2. At each station: surplus += gas[i] - cost[i]
//   3. If currentSurplus < 0 → reset start to i+1, reset currentSurplus
//   4. At the end: if totalSurplus >= 0, answer is startStation
//
// Time: O(n) | Space: O(1)
// ============================================================================

function canCompleteCircuit(gas: number[], cost: number[]): number {
  let totalSurplus = 0;
  let currentSurplus = 0;
  let startStation = 0;

  console.log("  Station | Gas | Cost | Diff | Current | Action");
  console.log("  --------|-----|------|------|---------|-------");

  for (let i = 0; i < gas.length; i++) {
    const diff = gas[i] - cost[i];
    totalSurplus += diff;
    currentSurplus += diff;

    if (currentSurplus < 0) {
      console.log(`  ${String(i).padStart(7)} | ${String(gas[i]).padStart(3)} | ${String(cost[i]).padStart(4)} | ${String(diff).padStart(4)} | ${String(currentSurplus).padStart(7)} | 🔄 Reset! Start = ${i + 1}`);
      startStation = i + 1;
      currentSurplus = 0;
    } else {
      console.log(`  ${String(i).padStart(7)} | ${String(gas[i]).padStart(3)} | ${String(cost[i]).padStart(4)} | ${String(diff).padStart(4)} | ${String(currentSurplus).padStart(7)} | ✅ OK`);
    }
  }

  const result = totalSurplus >= 0 ? startStation : -1;
  console.log(`  Total surplus: ${totalSurplus} → ${totalSurplus >= 0 ? "Solution exists" : "No solution"}`);
  return result;
}

console.log("═══ 6. Gas Station (LC 134) ═══");
console.log("Gas:  [1, 2, 3, 4, 5]");
console.log("Cost: [3, 4, 5, 1, 2]");
const startIdx = canCompleteCircuit([1, 2, 3, 4, 5], [3, 4, 5, 1, 2]);
console.log(`Result: start at station ${startIdx}\n`);


// ============================================================================
// ✂️ 7. PARTITION LABELS (LeetCode 763)
// ============================================================================
//
// Problem: Given a string s, partition it into as many parts as possible
// so that each letter appears in AT MOST one part. Return the sizes.
// Example: "ababcbacadefegdehijhklij" → [9, 7, 8]
//
// Why greedy? For each character, we MUST extend the current partition
// to include its LAST occurrence. Once we've scanned to that point and
// no character forces further extension, we can cut.
//
// HOW it works step by step:
//   1. First pass: record the last index of every character in s.
//   2. Second pass with two pointers (start, end):
//      - For each character at index i, extend end to max(end, lastIndex[char])
//      - If i == end, we've reached the boundary! Every character in
//        [start..end] has its last occurrence within this range.
//        Record the partition size and move start to i+1.
//
// WHY this is correct:
//   If character 'a' appears at index 0 and last at index 8, the first
//   partition MUST include indices 0..8. But within 0..8, other characters
//   might extend the partition further. Once no character pushes past the
//   current end, we know the partition is self-contained.
//
// Real-world analogy: Think of seating guests at tables. Each guest has
//   friends they MUST sit with. Start assigning guests, and every time a
//   guest requires a friend who hasn't been seated yet, extend the table.
//   Once all seated guests' friends are accounted for, close that table.
//
// Time: O(n) — two passes | Space: O(1) — at most 26 character entries
// ============================================================================

function partitionLabels(s: string): number[] {
  // First pass: record last occurrence index for each character
  const lastIndex = new Map<string, number>();
  for (let i = 0; i < s.length; i++) {
    lastIndex.set(s[i], i);
  }

  const result: number[] = [];
  let start = 0;
  let end = 0;

  // Second pass: extend partition end, cut when i reaches end
  for (let i = 0; i < s.length; i++) {
    const charLast = lastIndex.get(s[i])!;
    if (charLast > end) {
      console.log(`  i=${i} char='${s[i]}': last occurrence at ${charLast} → extend end ${end}→${charLast}`);
      end = charLast;
    }

    if (i === end) {
      const size = end - start + 1;
      result.push(size);
      console.log(`  ✂️  Partition complete! [${start}..${end}] = "${s.slice(start, end + 1)}" (size ${size})`);
      start = i + 1;
    }
  }
  return result;
}

console.log("═══ 7. Partition Labels (LC 763) ═══");
console.log('Input: "ababcbacadefegdehijhklij"');
const partitions = partitionLabels("ababcbacadefegdehijhklij");
console.log(`Result: [${partitions}]\n`);


// ============================================================================
// 📋 8. TASK SCHEDULER (LeetCode 621)
// ============================================================================
//
// Problem: Given tasks (characters) and a cooldown period n, find the
// minimum number of time units to execute all tasks. The SAME task must
// have at least n units between executions. You can insert idle slots.
//
// Why greedy? The most frequent task creates a "frame" that determines
// the minimum time. Less frequent tasks fill gaps in that frame.
//
// HOW the formula works:
//   Let maxFreq = frequency of the most common task (e.g., A appears 3 times)
//   Let maxFreqCount = how many tasks share that max frequency
//
//   Build a frame:  A _ _ A _ _ A
//   Each A needs n=2 gaps after it (except the last one).
//   Frame size = (maxFreq - 1) × (n + 1) + maxFreqCount
//
//   Example: tasks=[A,A,A,B,B,B], n=2
//     maxFreq=3, maxFreqCount=2 (both A and B appear 3 times)
//     Frame: A B _ | A B _ | A B  → (3-1)×(2+1)+2 = 8
//
//   If total tasks > frame size, no idle time needed — the answer is
//   just the total number of tasks.
//
// Real-world analogy: Think of a factory assembly line with cooldown
//   periods between using the same machine. The busiest machine dictates
//   the schedule. Other machines fill in the idle gaps.
//
// Time: O(n) to count frequencies | Space: O(1) — fixed 26-char array
// ============================================================================

function leastInterval(tasks: string[], n: number): number {
  // Count frequency of each task (A-Z → indices 0-25)
  const freq = new Array(26).fill(0);
  for (const task of tasks) {
    freq[task.charCodeAt(0) - 65]++;
  }
  freq.sort((a, b) => b - a);

  const maxFreq = freq[0];
  let maxFreqCount = 0;
  for (const f of freq) {
    if (f === maxFreq) maxFreqCount++;
    else break;
  }

  console.log(`  Frequencies (sorted desc): [${freq.filter(f => f > 0).join(", ")}]`);
  console.log(`  Most frequent task appears ${maxFreq} times`);
  console.log(`  ${maxFreqCount} task(s) share the max frequency`);
  console.log(`  Frame: (${maxFreq} - 1) × (${n} + 1) + ${maxFreqCount} = ${(maxFreq - 1) * (n + 1) + maxFreqCount}`);

  const minTime = (maxFreq - 1) * (n + 1) + maxFreqCount;
  const result = Math.max(minTime, tasks.length);

  if (result > minTime) {
    console.log(`  But total tasks = ${tasks.length} > frame size → result = ${tasks.length}`);
  }

  return result;
}

console.log("═══ 8. Task Scheduler (LC 621) ═══");
console.log('Input: tasks=["A","A","A","B","B","B"], n=2');
const time = leastInterval(["A", "A", "A", "B", "B", "B"], 2);
console.log(`Result: ${time} time units\n`);

console.log('Input: tasks=["A","A","A","A","A","A","B","C","D","E","F","G"], n=2');
const time2 = leastInterval(["A", "A", "A", "A", "A", "A", "B", "C", "D", "E", "F", "G"], 2);
console.log(`Result: ${time2} time units\n`);


// ============================================================================
// ⚠️ BONUS: GREEDY FAILS — Coin Change with [1, 3, 4]
// ============================================================================
//
// This section demonstrates WHY greedy doesn't always work, and why
// Dynamic Programming exists as a more powerful (but slower) alternative.
//
// Problem: Find minimum coins to make amount 6 using coins [1, 3, 4].
//
// GREEDY approach: Always pick the largest coin that fits.
//   6 → take 4 (remaining: 2) → take 1 (remaining: 1) → take 1 (remaining: 0)
//   Result: 3 coins [4, 1, 1]  ❌ NOT OPTIMAL
//
// DP approach: Try ALL possibilities, cache results.
//   dp[6] = min(dp[5]+1, dp[3]+1, dp[2]+1) = min(2+1, 1+1, 2+1) = 2
//   Result: 2 coins [3, 3]  ✅ OPTIMAL
//
// WHY greedy fails here:
//   Greedy is "shortsighted" — it picks 4 because it's the biggest coin,
//   but that forces it into a suboptimal path (two 1s). The globally
//   optimal choice (two 3s) requires skipping the locally best option.
//
// LESSON: Greedy works when the greedy choice property holds (like with
//   US coin denominations [1,5,10,25]). For arbitrary denominations,
//   you need DP to guarantee optimality.
//
// Time: Greedy O(coins × amount/coin) | DP O(amount × coins)
// ============================================================================

function coinChangeGreedy(coins: number[], amount: number): { coins: number; choices: number[] } {
  const sorted = [...coins].sort((a, b) => b - a);
  let remaining = amount;
  let count = 0;
  const choices: number[] = [];

  for (const coin of sorted) {
    while (remaining >= coin) {
      remaining -= coin;
      count++;
      choices.push(coin);
    }
  }
  return { coins: count, choices };
}

function coinChangeDP(coins: number[], amount: number): { coins: number; choices: number[] } {
  const dp = new Array(amount + 1).fill(Infinity);
  const parent = new Array(amount + 1).fill(-1);
  dp[0] = 0;

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i && dp[i - coin] + 1 < dp[i]) {
        dp[i] = dp[i - coin] + 1;
        parent[i] = coin;
      }
    }
  }

  // Reconstruct the coin choices by following the parent pointers back
  const choices: number[] = [];
  let curr = amount;
  while (curr > 0) {
    choices.push(parent[curr]);
    curr -= parent[curr];
  }
  return { coins: dp[amount], choices };
}

console.log("═══ BONUS: Greedy vs DP — Coin Change ═══");
console.log("Coins: [1, 3, 4], Amount: 6\n");

const greedyResult = coinChangeGreedy([1, 3, 4], 6);
console.log(`  ❌ Greedy: ${greedyResult.coins} coins → [${greedyResult.choices.join(" + ")}]`);

const dpResult = coinChangeDP([1, 3, 4], 6);
console.log(`  ✅ DP:     ${dpResult.coins} coins → [${dpResult.choices.join(" + ")}]`);
console.log(`\n  Greedy picked the largest coin first (4), then needed two 1s.`);
console.log(`  DP found that two 3s is optimal. Greedy doesn't always work!`);
