export {};

// ================================================================
// 📦 CHAPTER 01 — Arrays & Strings: Runnable Examples
// ================================================================
// Run: bun run 01-arrays-and-strings/arrays-and-strings.ts
//
// Arrays and strings are the MOST fundamental data structures.
// Nearly every coding interview starts with one of them.
//
// This file covers:
//   1. Basic array operations and their Big O complexities
//   2. Prefix sum — turning O(n) range queries into O(1)
//   3. Kadane's algorithm — maximum subarray sum in O(n)
//   4. String reversal — multiple approaches compared
//   5. Anagram detection — Map vs Sort
//   6. String concatenation trap — the hidden O(n²)
//   7. In-place array rotation — the three-reverse trick
//
// Each section includes benchmarks so you can SEE the performance
// differences, not just read about them.
//
// See also: 01-arrays-and-strings/README.md for theory.
// ================================================================


// ================================================================
// 🔧 HELPER: Benchmark Utility
// ================================================================
// Wraps any function call with performance.now() timing.
// Returns the function's result so benchmarking doesn't alter
// program behavior — it's purely observational.
//
// The generic <T> means this works for functions returning any type.
// ================================================================

function benchmark<T>(label: string, fn: () => T): T {
  const start = performance.now();
  const result = fn();
  const elapsed = performance.now() - start;
  console.log(`  ⏱️  ${label}: ${elapsed.toFixed(3)}ms`);
  return result;
}

function separator(title: string) {
  console.log(`\n${"═".repeat(60)}`);
  console.log(`  ${title}`);
  console.log(`${"═".repeat(60)}\n`);
}


// ================================================================
// 1️⃣ BASIC ARRAY OPERATIONS
// ================================================================
// Understanding the Big O of each operation is critical:
//
// ┌────────────────────┬────────────┬───────────────────────────┐
// │ Operation          │ Time       │ Why                       │
// ├────────────────────┼────────────┼───────────────────────────┤
// │ Access by index    │ O(1)       │ Direct memory offset      │
// │ push() / pop()     │ O(1)*      │ Add/remove at end         │
// │ unshift() / shift()│ O(n)       │ Must shift ALL elements   │
// │ splice() insert    │ O(n)       │ Must shift elements right │
// │ splice() delete    │ O(n)       │ Must shift elements left  │
// │ indexOf / includes │ O(n)       │ Linear scan               │
// │ slice()            │ O(k)       │ Copies k elements         │
// │ sort()             │ O(n log n) │ Comparison-based sort     │
// └────────────────────┴────────────┴───────────────────────────┘
// * Amortized O(1) — occasional resizing makes a single push O(n),
//   but averaged over many pushes it's O(1).
// ================================================================

separator("1️⃣ Basic Array Operations");

const nums = [10, 20, 30, 40, 50];
console.log("  Original:", nums);

// O(1) — Direct index access. Arrays store elements contiguously,
// so the engine computes: memoryAddress = base + (index × size)
console.log("  Access arr[2]:", nums[2]);
console.log("  Last element:", nums[nums.length - 1]);

// O(1) amortized — push/pop work at the END of the array,
// so no elements need to shift.
nums.push(60);
console.log("  After push(60):", nums);

nums.pop();
console.log("  After pop():", nums);

// O(n) — unshift/shift work at the BEGINNING, forcing every
// other element to move one position. Avoid in hot loops!
nums.unshift(0);
console.log("  After unshift(0):", nums);

nums.shift();
console.log("  After shift():", nums);

// O(n) — splice inserts/removes at arbitrary positions.
// Elements after the index must shift to make room or fill the gap.
nums.splice(2, 0, 25);
console.log("  After splice(2, 0, 25) — insert 25 at index 2:", nums);

nums.splice(2, 1);
console.log("  After splice(2, 1) — remove element at index 2:", nums);

// O(n) — These scan the array element by element.
// For frequent lookups, consider using a Set or Map instead.
console.log("  indexOf(40):", nums.indexOf(40));
console.log("  includes(99):", nums.includes(99));

// O(k) where k = end - start — creates a shallow copy of a portion.
// The original array is NOT modified (unlike splice).
const sliced = nums.slice(1, 4);
console.log("  slice(1, 4):", sliced);
console.log("  Original unchanged:", nums);

// ⚠️ GOTCHA: sort() MUTATES the original array!
// Always spread [...arr] first if you need the original intact.
console.log("\n  ⚠️  sort() mutates the original:");
const toSort = [3, 1, 4, 1, 5, 9, 2, 6];
console.log("  Before sort:", [...toSort]);
toSort.sort((a, b) => a - b);
console.log("  After sort:", toSort);

// ⚠️ GOTCHA: Default sort is LEXICOGRAPHIC (string comparison)!
// [10, 9, 80].sort() → [10, 80, 9] because "10" < "80" < "9"
// ALWAYS pass a comparator for numeric sorting: (a, b) => a - b
console.log("\n  ⚠️  Default sort is lexicographic:");
console.log("  [10, 9, 80].sort():", [10, 9, 80].sort());
console.log("  [10, 9, 80].sort((a,b) => a-b):", [10, 9, 80].sort((a, b) => a - b));


// ================================================================
// 2️⃣ PREFIX SUM — O(1) Range Queries
// ================================================================
// Problem: "What's the sum of elements from index L to R?"
//
// Brute force: Loop from L to R, add them up → O(n) per query
// With prefix sum: One subtraction → O(1) per query!
//
// HOW IT WORKS:
//   prefix[i] = sum of all elements from index 0 to i-1
//   prefix[0] = 0 (empty prefix)
//   prefix[1] = arr[0]
//   prefix[2] = arr[0] + arr[1]
//   ...
//
//   sum(L..R) = prefix[R+1] - prefix[L]
//
// The prefix array is built once in O(n), then each query is O(1).
// If you have Q queries, that's O(n + Q) instead of O(n × Q).
//
// Time: O(n) build + O(1) per query | Space: O(n)
// ================================================================

separator("2️⃣ Prefix Sum");

function buildPrefixSum(nums: number[]): number[] {
  // prefix[i] holds the sum of nums[0..i-1]
  // We make it length + 1 so prefix[0] = 0 (sum of no elements)
  const prefix = new Array(nums.length + 1).fill(0);
  for (let i = 0; i < nums.length; i++) {
    // Each new prefix = previous prefix + current element
    prefix[i + 1] = prefix[i] + nums[i];
  }
  return prefix;
}

function rangeSum(prefix: number[], left: number, right: number): number {
  // The sum from index left to right (inclusive) is:
  // (sum of everything up to right) - (sum of everything before left)
  return prefix[right + 1] - prefix[left];
}

const data = [2, 4, 1, 3, 5];
const prefix = buildPrefixSum(data);

console.log("  Array:", data);
console.log("  Prefix sum:", prefix);
console.log("  sum(1..3) =", rangeSum(prefix, 1, 3), " (expected: 8 → 4+1+3)");
console.log("  sum(0..4) =", rangeSum(prefix, 0, 4), " (expected: 15 → 2+4+1+3+5)");
console.log("  sum(2..2) =", rangeSum(prefix, 2, 2), " (expected: 1)");

// Benchmark: Brute force vs Prefix Sum on 1000 random range queries
console.log("\n  🔁 Brute force vs Prefix Sum — 1000 range queries on 10,000 elements:");
const bigArr = Array.from({ length: 10_000 }, (_, i) => i + 1);
const queries = Array.from({ length: 1_000 }, () => {
  const l = Math.floor(Math.random() * 5_000);
  const r = l + Math.floor(Math.random() * 5_000);
  return [l, r] as const;
});

benchmark("Brute force (sum each time)", () => {
  let total = 0;
  for (const [l, r] of queries) {
    for (let i = l; i <= r; i++) total += bigArr[i];
  }
  return total;
});

const bigPrefix = buildPrefixSum(bigArr);
benchmark("Prefix sum (O(1) per query)", () => {
  let total = 0;
  for (const [l, r] of queries) {
    total += rangeSum(bigPrefix, l, r);
  }
  return total;
});


// ================================================================
// 3️⃣ KADANE'S ALGORITHM — Maximum Subarray Sum
// ================================================================
// Problem: Find the contiguous subarray with the largest sum.
// This is LeetCode #53, one of the most common interview questions.
//
// BRUTE FORCE: Check all O(n²) subarrays → O(n²) or O(n³)
// KADANE'S: One pass through the array → O(n)
//
// KEY INSIGHT: At each position i, we decide:
//   "Should I EXTEND the previous subarray, or START FRESH here?"
//
//   If nums[i] alone is greater than currentSum + nums[i],
//   it's better to start a new subarray at i.
//   Otherwise, extend the current one.
//
// We track the maximum sum seen so far across all positions.
//
// Time: O(n) — single pass | Space: O(1)
// ================================================================

separator("3️⃣ Kadane's Algorithm");

function maxSubarraySum(nums: number[]): { maxSum: number; start: number; end: number } {
  // Initialize with the first element — every subarray must
  // contain at least one element.
  let currentSum = nums[0];
  let maxSum = nums[0];
  let start = 0;
  let end = 0;
  let tempStart = 0; // Tracks where the current subarray began

  for (let i = 1; i < nums.length; i++) {
    // DECISION POINT: Start fresh at i, or extend from previous?
    if (nums[i] > currentSum + nums[i]) {
      // Starting fresh is better — the previous sum was dragging us down
      currentSum = nums[i];
      tempStart = i;
    } else {
      // Extending is better — the previous sum still helps
      currentSum += nums[i];
    }

    // Update our global maximum if the current subarray beats it
    if (currentSum > maxSum) {
      maxSum = currentSum;
      start = tempStart;
      end = i;
    }
  }

  return { maxSum, start, end };
}

const kadaneInput = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
const result = maxSubarraySum(kadaneInput);
console.log("  Input:", kadaneInput);
console.log(`  Max subarray sum: ${result.maxSum}`);
console.log(`  Subarray: [${kadaneInput.slice(result.start, result.end + 1)}] (indices ${result.start}..${result.end})`);

// Edge case: all negative numbers — Kadane's correctly picks the
// least negative element (the "best" single-element subarray).
const allNeg = [-5, -3, -8, -1, -4];
const resultNeg = maxSubarraySum(allNeg);
console.log("\n  All negatives:", allNeg);
console.log(`  Max subarray sum: ${resultNeg.maxSum} (picks least negative)`);


// ================================================================
// 4️⃣ STRING REVERSAL — Multiple Approaches
// ================================================================
// A classic warm-up problem with several solutions, each
// illustrating different TypeScript patterns.
//
// Approach 1: split → reverse → join (built-in, idiomatic)
// Approach 2: Two-pointer swap (in-place on char array)
// Approach 3: reduceRight (functional, but slower due to string concat)
//
// All are O(n) time, but real-world performance varies due to
// memory allocation patterns and string immutability in JS.
// ================================================================

separator("4️⃣ String Reversal — Multiple Approaches");

// Approach 1: Built-in methods
// Strings are immutable in JS, so we split into an array of chars,
// reverse the array in-place, then join back into a string.
// Time: O(n) | Space: O(n)
function reverseBuiltIn(s: string): string {
  return s.split("").reverse().join("");
}

// Approach 2: Two-pointer swap
// Classic algorithmic approach: swap characters from both ends,
// moving inward until the pointers meet. This is the approach
// interviewers usually want to see.
// Time: O(n) | Space: O(n) — we still need the char array since strings are immutable
function reverseTwoPointers(s: string): string {
  const chars = s.split("");
  let left = 0;
  let right = chars.length - 1;

  while (left < right) {
    // Destructuring swap — idiomatic TypeScript
    [chars[left], chars[right]] = [chars[right], chars[left]];
    left++;
    right--;
  }
  return chars.join("");
}

// Approach 3: reduceRight (functional)
// Iterates from right to left, building the reversed string.
// ⚠️ String concatenation (acc + ch) creates a new string object
// each iteration — can be O(n²) for large strings!
// Time: O(n) to O(n²) depending on engine optimization | Space: O(n)
function reverseReduceRight(s: string): string {
  return s.split("").reduceRight((acc, ch) => acc + ch, "");
}

const testStr = "Hello, World! 🌍";
console.log("  Original:", testStr);
console.log("  Built-in (split+reverse+join):", reverseBuiltIn(testStr));
console.log("  Two pointers:", reverseTwoPointers(testStr));
console.log("  reduceRight:", reverseReduceRight(testStr));

console.log("\n  ⏱️  Benchmarking reversal on 100,000-char string:");
const longStr = "a".repeat(100_000);
benchmark("split().reverse().join()", () => reverseBuiltIn(longStr));
benchmark("Two-pointer swap", () => reverseTwoPointers(longStr));
benchmark("reduceRight (string concat)", () => reverseReduceRight(longStr));


// ================================================================
// 5️⃣ ANAGRAM DETECTION
// ================================================================
// Two strings are anagrams if they contain the exact same characters
// with the exact same frequencies (e.g., "listen" ↔ "silent").
//
// Approach 1: Frequency Map — O(n)
//   Count character frequencies for string s, then "subtract"
//   frequencies for string t. If everything zeros out, it's a match.
//
// Approach 2: Sort both strings — O(n log n)
//   If sorted versions are equal, they're anagrams.
//   Simpler code but slower due to sorting.
//
// The Map approach is preferred in interviews for its O(n) time.
// ================================================================

separator("5️⃣ Anagram Detection");

// O(n) approach using a frequency Map.
// We increment counts for chars in s, decrement for chars in t.
// If any count goes below 0, t has a char that s doesn't → not an anagram.
function isAnagram(s: string, t: string): boolean {
  // Quick length check — different lengths can never be anagrams
  if (s.length !== t.length) return false;

  const freq = new Map<string, number>();

  // Build frequency map from first string
  for (const ch of s) freq.set(ch, (freq.get(ch) ?? 0) + 1);

  // Decrement frequencies using second string
  // If any char is missing or count drops below 0, not an anagram
  for (const ch of t) {
    const count = freq.get(ch);
    if (!count) return false; // char not found or count already 0
    freq.set(ch, count - 1);
  }
  return true;
}

// O(n log n) approach using sorting.
// Sort both strings and compare — if equal, they're anagrams.
// Simpler but slower for large strings.
function isAnagramSort(s: string, t: string): boolean {
  if (s.length !== t.length) return false;
  return s.split("").sort().join("") === t.split("").sort().join("");
}

const anagramTests: [string, string][] = [
  ["listen", "silent"],
  ["hello", "world"],
  ["anagram", "nagaram"],
  ["rat", "car"],
  ["abc", "abcd"],
];

console.log("  Frequency Map approach:");
for (const [a, b] of anagramTests) {
  console.log(`    "${a}" vs "${b}": ${isAnagram(a, b)}`);
}

// Benchmark: Map O(n) vs Sort O(n log n) on large strings
console.log("\n  ⏱️  Map vs Sort on 100,000-char strings:");
const s1 = "abcdefghij".repeat(10_000);
const s2 = "jihgfedcba".repeat(10_000);
benchmark("Map-based O(n)", () => isAnagram(s1, s2));
benchmark("Sort-based O(n log n)", () => isAnagramSort(s1, s2));


// ================================================================
// 6️⃣ STRING CONCATENATION: The O(n²) Trap
// ================================================================
// In JavaScript, strings are IMMUTABLE. Every time you do:
//   result += "a"
// ...a BRAND NEW string is created and the old one is discarded.
//
// For n iterations, the total work is: 1 + 2 + 3 + ... + n = O(n²)
// because each concatenation copies the entire string so far.
//
// THE FIX: Collect pieces in an array, then join once at the end.
// Array.push is O(1) amortized, and join does one final O(n) pass.
//
// Modern engines (V8, JSC) sometimes optimize += with "rope"
// strings, but the principle holds for large strings and other
// languages (Java, Python, etc.).
//
// Time: += is O(n²) worst case | join is O(n)
// ================================================================

separator("6️⃣ String Concatenation in a Loop — The O(n²) Trap");

// ❌ BAD: String += in a loop — potentially O(n²)
function buildWithConcat(n: number): string {
  let result = "";
  for (let i = 0; i < n; i++) {
    // Each += creates a new string of length i+1
    result += "a";
  }
  return result;
}

// ✅ GOOD: Array.push + join — O(n) guaranteed
function buildWithJoin(n: number): string {
  const parts: string[] = [];
  for (let i = 0; i < n; i++) {
    parts.push("a"); // O(1) amortized
  }
  return parts.join(""); // One O(n) pass at the end
}

const sizes = [1_000, 10_000, 100_000];

for (const n of sizes) {
  console.log(`\n  n = ${n.toLocaleString()}:`);
  benchmark(`❌ String += (may be O(n²))`, () => buildWithConcat(n));
  benchmark(`✅ Array.join (O(n))`, () => buildWithJoin(n));
}

console.log("\n  📊 Notice how += gets disproportionately slower as n grows!");
console.log("  Modern engines optimize small cases, but the principle holds for large strings.");


// ================================================================
// 7️⃣ IN-PLACE ARRAY ROTATION — The Three-Reverse Trick
// ================================================================
// Problem: Rotate an array to the right by k positions.
//
// Example: [1, 2, 3, 4, 5] rotated by 2 → [4, 5, 1, 2, 3]
//
// NAIVE: Create a new array with slicing → O(n) time, O(n) space
// OPTIMAL: Three-reverse trick → O(n) time, O(1) space!
//
// HOW THE THREE-REVERSE TRICK WORKS:
//   Given [1, 2, 3, 4, 5], k=2:
//   Step 1: Reverse entire array → [5, 4, 3, 2, 1]
//   Step 2: Reverse first k=2    → [4, 5, 3, 2, 1]
//   Step 3: Reverse remaining    → [4, 5, 1, 2, 3] ✅
//
// WHY does this work? Reversing is like flipping a deck of cards.
// The full reverse puts elements in the right "groups" but
// backwards — the two partial reverses fix the internal order.
//
// Time: O(n) — three passes | Space: O(1) — in-place swaps only
// ================================================================

separator("7️⃣ In-Place Array Rotation");

// Helper: Reverse a section of an array in-place using two pointers.
// This is the building block for the three-reverse trick.
// Time: O(end - start) | Space: O(1)
function reverseSection(arr: number[], start: number, end: number): void {
  while (start < end) {
    [arr[start], arr[end]] = [arr[end], arr[start]];
    start++;
    end--;
  }
}

// O(n) time, O(1) space — the optimal in-place rotation
function rotateRight(nums: number[], k: number): void {
  const n = nums.length;
  // k % n handles cases where k > array length (e.g., rotating
  // a 5-element array by 7 is the same as rotating by 2)
  k = k % n;
  if (k === 0) return;

  reverseSection(nums, 0, n - 1);       // Step 1: Reverse entire array
  reverseSection(nums, 0, k - 1);       // Step 2: Reverse first k elements
  reverseSection(nums, k, n - 1);       // Step 3: Reverse remaining elements
}

// O(n) time, O(n) space — simpler but uses extra memory
function rotateNaive(nums: number[], k: number): number[] {
  const n = nums.length;
  k = k % n;
  // slice + spread creates a new array with the last k elements first
  return [...nums.slice(n - k), ...nums.slice(0, n - k)];
}

const rotArr = [1, 2, 3, 4, 5, 6, 7];
console.log("  Original:", [...rotArr]);

const naive = rotateNaive([...rotArr], 3);
console.log("  Naive rotate right by 3:", naive, "(creates new array)");

rotateRight(rotArr, 3);
console.log("  In-place rotate right by 3:", rotArr, "(O(1) extra space)");

// Step-by-step walkthrough to visualize the three-reverse trick
console.log("\n  Step-by-step for [1,2,3,4,5], k=2:");
const demo = [1, 2, 3, 4, 5];
console.log("  Start:        ", [...demo]);
reverseSection(demo, 0, demo.length - 1);
console.log("  Reverse all:  ", [...demo]);
reverseSection(demo, 0, 1);
console.log("  Reverse 0..1: ", [...demo]);
reverseSection(demo, 2, demo.length - 1);
console.log("  Reverse 2..4: ", [...demo], "✅");

// Benchmark: Naive (O(n) space) vs In-place (O(1) space)
console.log("\n  ⏱️  Naive (O(n) space) vs In-place (O(1) space) on 1,000,000 elements:");
const bigRot = Array.from({ length: 1_000_000 }, (_, i) => i);
const bigRot2 = [...bigRot];
benchmark("Naive (slice + spread)", () => rotateNaive(bigRot, 333_333));
benchmark("In-place (three reverses)", () => rotateRight(bigRot2, 333_333));


// ================================================================
// 🏁 SUMMARY
// ================================================================

separator("🏁 All Examples Complete!");

console.log("  Key takeaways from running these examples:");
console.log("  • Array access is O(1) — instant by index");
console.log("  • Prefix sum turns repeated range queries from O(n) to O(1)");
console.log("  • Kadane's algorithm finds max subarray sum in O(n)");
console.log("  • String concatenation in loops can be O(n²) — use array.join()");
console.log("  • Map-based anagram detection beats sorting: O(n) vs O(n log n)");
console.log("  • Three-reverse trick rotates arrays in O(1) extra space");
console.log("");
