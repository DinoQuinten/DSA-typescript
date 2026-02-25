export {};

// ================================================================
// 🧠 CHAPTER 00 — Big O Notation: Runnable Complexity Examples
// ================================================================
// Run: bun run 00-big-o-notation/big-o.ts
//
// Big O notation describes how an algorithm's runtime or space
// grows as the input size (n) increases. It's the universal
// language for comparing algorithm efficiency.
//
// KEY INSIGHT: We care about the GROWTH RATE, not the exact time.
// O(n) doesn't mean "n milliseconds" — it means "if you double
// the input, the time roughly doubles."
//
// This file demonstrates each major complexity class with real
// code you can run and benchmark. Watch the timings as input
// sizes grow — you'll SEE why Big O matters.
//
// See also: 00-big-o-notation/README.md for theory and visuals.
// ================================================================


// ================================================================
// 🟢 O(1) — CONSTANT TIME: Array Access
// ================================================================
// No matter how large the array, accessing an element by index
// takes the same amount of time. The array stores elements in
// contiguous memory, so arr[i] = baseAddress + (i × elementSize).
//
// Real-world analogy: Opening a book to page 500 is just as fast
// as opening it to page 5 — you just go directly there.
//
// Time: O(1) | Space: O(1)
// ================================================================

function accessByIndex(arr: number[], index: number): number {
  // Direct memory offset calculation — no iteration needed.
  // This is what makes arrays so powerful for random access.
  return arr[index];
}


// ================================================================
// 🟢 O(log n) — LOGARITHMIC: Binary Search
// ================================================================
// Binary search works on SORTED arrays by repeatedly halving
// the search space. Each comparison eliminates half the remaining
// elements — that's why it's O(log n).
//
// Think of it like the "higher or lower" guessing game:
//   - Array of 1,000 elements → ~10 steps (log₂ 1000 ≈ 10)
//   - Array of 1,000,000 elements → ~20 steps
//   - Array of 1,000,000,000 elements → ~30 steps
//
// Doubling the input only adds ONE more step!
//
// Prerequisite: The array MUST be sorted.
// Time: O(log n) | Space: O(1)
// ================================================================

function binarySearch(arr: number[], target: number): number {
  // Two pointers define the search window.
  // The target (if it exists) must be between lo and hi.
  let lo = 0;
  let hi = arr.length - 1;

  // Keep searching while the window is valid.
  // When lo > hi, the window is empty → target doesn't exist.
  while (lo <= hi) {
    // Find the midpoint of the current window.
    // Math.floor is needed because indices must be integers.
    // In other languages, (lo + hi) could overflow — in JS,
    // numbers are 64-bit floats so this is safe for typical sizes.
    const mid = Math.floor((lo + hi) / 2);

    if (arr[mid] === target) return mid;  // 🎯 Found it!

    if (arr[mid] < target) {
      // Target is in the RIGHT half — discard left half
      lo = mid + 1;
    } else {
      // Target is in the LEFT half — discard right half
      hi = mid - 1;
    }
  }

  return -1; // Target not found
}


// ================================================================
// 🟡 O(n) — LINEAR TIME: Sum of Array
// ================================================================
// We must visit every element exactly once — there's no shortcut
// because each element contributes to the total. If the array
// doubles in size, the time doubles.
//
// This is the most common complexity. Any time you loop through
// an array once, you're O(n).
//
// Time: O(n) | Space: O(1)
// ================================================================

function linearSum(arr: number[]): number {
  let total = 0;
  // for-of iterates through every element — one pass = O(n)
  for (const num of arr) total += num;
  return total;
}


// ================================================================
// 🟡 O(n) — LINEAR SEARCH
// ================================================================
// When the array is UNSORTED, we have no choice but to check
// elements one by one. In the worst case (element is last or
// not present), we scan the entire array.
//
// Compare this to binary search above: O(n) vs O(log n).
// For 1 billion elements, linear search could take 1 billion
// steps; binary search takes ~30.
//
// Time: O(n) worst/average | Space: O(1)
// ================================================================

function linearSearch(arr: number[], target: number): number {
  // Check each element sequentially — no skipping possible
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1; // Scanned everything, not found
}


// ================================================================
// 🟠 O(n log n) — LINEARITHMIC: Merge Sort
// ================================================================
// Merge sort is a divide-and-conquer algorithm:
//   1. DIVIDE: Split the array in half (log n levels of splitting)
//   2. CONQUER: Merge sorted halves back together (O(n) per level)
//   Total: O(n) work × O(log n) levels = O(n log n)
//
// This is the theoretical BEST for comparison-based sorting.
// Built-in Array.sort() in V8 uses TimSort, which is also O(n log n).
//
// Trade-off: Merge sort needs O(n) extra space for the temp arrays,
// unlike in-place sorts like quicksort.
//
// Time: O(n log n) | Space: O(n)
// ================================================================

function mergeSort(arr: number[]): number[] {
  // Base case: a single element (or empty) array is already sorted
  if (arr.length <= 1) return arr;

  // DIVIDE: split the array at the midpoint
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));   // Recursively sort left half
  const right = mergeSort(arr.slice(mid));      // Recursively sort right half

  // CONQUER: merge two sorted halves into one sorted array
  return merge(left, right);
}

// The merge helper combines two already-sorted arrays into one.
// Uses two pointers to compare front elements of each array,
// always picking the smaller one. This runs in O(n) time.
function merge(a: number[], b: number[]): number[] {
  const result: number[] = [];
  let i = 0; // Pointer into array a
  let j = 0; // Pointer into array b

  // Compare front elements of both arrays, pick the smaller
  while (i < a.length && j < b.length) {
    if (a[i] <= b[j]) result.push(a[i++]);
    else result.push(b[j++]);
  }

  // One array is exhausted — append whatever remains from the other.
  // Only one of these loops will execute.
  while (i < a.length) result.push(a[i++]);
  while (j < b.length) result.push(b[j++]);

  return result;
}


// ================================================================
// 🔴 O(n²) — QUADRATIC: Bubble Sort
// ================================================================
// Bubble sort compares adjacent elements and swaps them if they're
// in the wrong order. It repeats this for every element.
//
// Why it's O(n²):
//   - Outer loop runs n times
//   - Inner loop runs ~n times for each outer iteration
//   - Total comparisons: n × n = n²
//
// Consequence: doubling the input → 4× the time. This is why
// O(n²) algorithms become unusable for large inputs.
//
// The spread [...arr] creates a copy to avoid mutating the input —
// a good practice to keep functions pure.
//
// Time: O(n²) | Space: O(n) for the copy, O(1) for the sorting itself
// ================================================================

function bubbleSort(arr: number[]): number[] {
  const a = [...arr]; // Clone to avoid mutating original

  for (let i = 0; i < a.length; i++) {
    // After each pass, the largest unsorted element "bubbles up"
    // to its correct position. So we can shrink the inner loop
    // by i each time (those elements are already sorted).
    for (let j = 0; j < a.length - i - 1; j++) {
      if (a[j] > a[j + 1]) {
        // TypeScript destructuring swap — clean, no temp variable needed
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
      }
    }
  }
  return a;
}


// ================================================================
// 🔴 O(n²) — QUADRATIC: Nested Loop (Count All Pairs)
// ================================================================
// Every pair (i, j) where i < j is counted. The number of such
// pairs is n × (n-1) / 2, which is O(n²).
//
// This pattern appears in brute-force solutions:
//   - "Check every pair of elements" → O(n²)
//   - Two Sum brute force, closest pair, etc.
//
// When you see a nested loop over the same array, think O(n²).
//
// Time: O(n²) | Space: O(1)
// ================================================================

function countPairs(arr: number[]): number {
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    // j starts at i+1 to avoid counting (i,j) and (j,i) separately
    for (let j = i + 1; j < arr.length; j++) {
      count++;
    }
  }
  return count;
}


// ================================================================
// 🔥 O(2ⁿ) — EXPONENTIAL: Recursive Fibonacci
// ================================================================
// The naive recursive Fibonacci is the classic example of
// exponential time. Each call spawns TWO more calls:
//
//            fib(5)
//           /     \
//        fib(4)   fib(3)
//        /   \     /   \
//     fib(3) fib(2) fib(2) fib(1)
//     ...    ...    ...
//
// The call tree doubles at each level → O(2ⁿ) total calls.
//
// fib(40) makes over 300 MILLION recursive calls!
// fib(50) would take minutes. fib(100) would outlive the sun.
//
// Fix: Use dynamic programming (memoization or tabulation)
// to reduce to O(n). See future chapters.
//
// Time: O(2ⁿ) | Space: O(n) for call stack depth
// ================================================================

function fibRecursive(n: number): number {
  // Base cases: fib(0) = 0, fib(1) = 1
  if (n <= 1) return n;

  // Each call branches into TWO recursive calls — exponential explosion
  return fibRecursive(n - 1) + fibRecursive(n - 2);
}


// ================================================================
// 🔬 BENCHMARKING UTILITY
// ================================================================
// We wrap each algorithm call in a timing function to measure
// real-world performance at different input sizes.
//
// performance.now() gives high-resolution timestamps in milliseconds.
// It's more precise than Date.now() for benchmarking.
// ================================================================

function measure(label: string, fn: () => void): number {
  const start = performance.now();
  fn();
  const elapsed = performance.now() - start;
  return elapsed;
}

// Generates [0, 1, 2, ..., n-1] — a pre-sorted array.
// Useful for testing binary search and O(1) access.
function generateSortedArray(n: number): number[] {
  return Array.from({ length: n }, (_, i) => i);
}

// Generates n random integers in [0, n).
// Useful for testing sorting and summing on unsorted data.
function generateRandomArray(n: number): number[] {
  return Array.from({ length: n }, () => Math.floor(Math.random() * n));
}


// ================================================================
// 🏁 DEMO — Run all complexities at different input sizes
// ================================================================
// Each section below benchmarks one complexity class at increasing
// input sizes. Watch the timing patterns:
//   - O(1): flat (same time regardless of n)
//   - O(log n): barely grows
//   - O(n): proportional to n
//   - O(n log n): slightly faster than linear
//   - O(n²): quadratic growth (doubling n → 4× time)
//   - O(2ⁿ): explosive growth (each +1 → 2× time)
// ================================================================

console.log("=".repeat(75));
console.log("  🧠 Big O Notation — Complexity Comparison Demo");
console.log("=".repeat(75));
console.log();

// ── O(1) Demo ──────────────────────────────────────────────────
// We access the same index 10,000 times at different array sizes.
// The time should be identical regardless of array size.
console.log("🟢 O(1) — Constant Time: Array Access");
console.log("-".repeat(50));
for (const size of [100, 10_000, 1_000_000]) {
  const arr = generateSortedArray(size);
  const ms = measure(`n=${size}`, () => {
    for (let i = 0; i < 10_000; i++) accessByIndex(arr, 0);
  });
  console.log(`  n = ${size.toLocaleString().padStart(11)}  →  ${ms.toFixed(3)} ms (10k lookups)`);
}
console.log("  📌 Same time regardless of array size.\n");

// ── O(log n) Demo ──────────────────────────────────────────────
// Binary search at increasing sizes. Even jumping from 100 to
// 100 million elements barely changes the time — that's logarithmic.
console.log("🟢 O(log n) — Logarithmic: Binary Search");
console.log("-".repeat(50));
for (const size of [100, 10_000, 1_000_000, 100_000_000]) {
  const arr = generateSortedArray(size);
  const target = size - 1; // Worst case: target is the last element
  const ms = measure(`n=${size}`, () => {
    for (let i = 0; i < 10_000; i++) binarySearch(arr, target);
  });
  console.log(`  n = ${size.toLocaleString().padStart(11)}  →  ${ms.toFixed(3)} ms (10k searches)`);
}
console.log("  📌 Barely grows even with 100M elements.\n");

// ── O(n) Demo ──────────────────────────────────────────────────
// Summing arrays of increasing size. Each 10× increase in n
// should show roughly 10× increase in time.
console.log("🟡 O(n) — Linear: Sum of Array");
console.log("-".repeat(50));
for (const size of [1_000, 10_000, 100_000, 1_000_000]) {
  const arr = generateRandomArray(size);
  const ms = measure(`n=${size}`, () => linearSum(arr));
  console.log(`  n = ${size.toLocaleString().padStart(11)}  →  ${ms.toFixed(3)} ms`);
}
console.log("  📌 Time grows linearly with input size.\n");

// ── O(n log n) Demo ────────────────────────────────────────────
// Merge sort grows slightly faster than linear. Compare these
// timings to the O(n) demo above — you'll see the "log n" factor.
console.log("🟠 O(n log n) — Linearithmic: Merge Sort");
console.log("-".repeat(50));
for (const size of [1_000, 10_000, 100_000]) {
  const arr = generateRandomArray(size);
  const ms = measure(`n=${size}`, () => mergeSort(arr));
  console.log(`  n = ${size.toLocaleString().padStart(11)}  →  ${ms.toFixed(3)} ms`);
}
console.log("  📌 Grows slightly faster than linear.\n");

// ── O(n²) Demo ─────────────────────────────────────────────────
// Bubble sort. Watch how doubling n makes it 4× slower.
// 10,000 → 20,000 elements should take roughly 4× as long.
console.log("🔴 O(n²) — Quadratic: Bubble Sort");
console.log("-".repeat(50));
for (const size of [1_000, 5_000, 10_000, 20_000]) {
  const arr = generateRandomArray(size);
  const ms = measure(`n=${size}`, () => bubbleSort(arr));
  console.log(`  n = ${size.toLocaleString().padStart(11)}  →  ${ms.toFixed(3)} ms`);
}
console.log("  📌 Doubling n → 4× the time. This is why O(n²) hurts.\n");

// ── O(2ⁿ) Demo ─────────────────────────────────────────────────
// Recursive Fibonacci. Each +1 to n roughly DOUBLES the time.
// We stop early if it gets too slow (> 5 seconds).
console.log("🔥 O(2ⁿ) — Exponential: Recursive Fibonacci");
console.log("-".repeat(50));
for (const n of [10, 20, 30, 35, 40]) {
  const ms = measure(`n=${n}`, () => fibRecursive(n));
  console.log(`  n = ${String(n).padStart(11)}  →  ${ms.toFixed(3)} ms`);
  if (ms > 5_000) {
    console.log("  ⛔ Stopping — already too slow!");
    break;
  }
}
console.log("  📌 Each +1 to n roughly DOUBLES the time. Exponential explosion.\n");


// ================================================================
// 📊 SUMMARY COMPARISON TABLE
// ================================================================
// All algorithms run on the same input size (n = 10,000) so we
// can directly compare their times side by side. This table
// makes the Big O differences viscerally obvious.
// ================================================================

console.log("=".repeat(75));
console.log("  📊 Summary: Growth Rates Compared");
console.log("=".repeat(75));
console.log();

const N = 10_000;
const sortedArr = generateSortedArray(N);
const randomArr = generateRandomArray(N);

const results: { name: string; complexity: string; ms: number }[] = [];

results.push({
  name: "Array Access",
  complexity: "O(1)",
  ms: measure("", () => { for (let i = 0; i < N; i++) accessByIndex(sortedArr, 0); }),
});

results.push({
  name: "Binary Search",
  complexity: "O(log n)",
  ms: measure("", () => { for (let i = 0; i < N; i++) binarySearch(sortedArr, N - 1); }),
});

results.push({
  name: "Linear Sum",
  complexity: "O(n)",
  ms: measure("", () => linearSum(randomArr)),
});

results.push({
  name: "Merge Sort",
  complexity: "O(n log n)",
  ms: measure("", () => mergeSort(randomArr)),
});

results.push({
  name: "Bubble Sort",
  complexity: "O(n²)",
  ms: measure("", () => bubbleSort(randomArr)),
});

results.push({
  name: "Fib Recursive",
  complexity: "O(2ⁿ)",
  ms: measure("", () => fibRecursive(30)),
});

console.log(
  "  " +
  "Algorithm".padEnd(18) +
  "Complexity".padEnd(14) +
  "Time (ms)".padStart(12)
);
console.log("  " + "-".repeat(44));

for (const r of results) {
  console.log(
    "  " +
    r.name.padEnd(18) +
    r.complexity.padEnd(14) +
    r.ms.toFixed(3).padStart(12)
  );
}

console.log();
console.log("=".repeat(75));
console.log("  ✅ Demo complete! Notice how dramatically the times differ.");
console.log("  💡 This is why Big O matters — the right algorithm changes everything.");
console.log("=".repeat(75));
