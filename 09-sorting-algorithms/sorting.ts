export {};

// ================================================================
// 📂 Chapter 9: SORTING ALGORITHMS — Runnable TypeScript Examples
// ================================================================
//
// WHY STUDY SORTING?
// Sorting is the foundation of computer science. Many problems
// become trivial once data is sorted (binary search, two pointers,
// merge intervals, etc.). Understanding HOW sorts work builds
// intuition for divide-and-conquer, recursion, and in-place
// algorithms.
//
// OVERVIEW OF ALGORITHMS IN THIS FILE:
//   ┌────────────────────┬──────────┬──────────┬────────────┐
//   │ Algorithm          │ Best     │ Average  │ Worst      │
//   ├────────────────────┼──────────┼──────────┼────────────┤
//   │ Bubble Sort        │ O(n)     │ O(n²)    │ O(n²)      │
//   │ Insertion Sort     │ O(n)     │ O(n²)    │ O(n²)      │
//   │ Selection Sort     │ O(n²)    │ O(n²)    │ O(n²)      │
//   │ Merge Sort         │ O(n logn)│ O(n logn)│ O(n log n) │
//   │ Quick Sort         │ O(n logn)│ O(n logn)│ O(n²)      │
//   │ Counting Sort      │ O(n+k)  │ O(n+k)   │ O(n+k)     │
//   └────────────────────┴──────────┴──────────┴────────────┘
//   n = array length, k = value range (for counting sort)
//
// Run: bun run sorting.ts
// ================================================================


// ================================================================
// 🫧 BUBBLE SORT — The Simplest (but Slowest) Sort
// ================================================================
// WHAT: Repeatedly walk through the array, swapping adjacent
//       elements that are out of order. After each full pass,
//       the largest unsorted element "bubbles up" to its correct
//       position at the end.
//
// REAL-WORLD ANALOGY:
//   Imagine bubbles in a soda — the biggest bubble rises to the
//   top first, then the next biggest, and so on.
//
// HOW IT WORKS (step by step):
//   Pass 1: Compare [0]&[1], [1]&[2], ..., [n-2]&[n-1]
//           → largest element is now at index n-1
//   Pass 2: Same, but only up to index n-2
//           → 2nd largest is now at n-2
//   ...continue until no swaps are needed.
//
// OPTIMIZATION:
//   If a full pass makes NO swaps, the array is already sorted
//   → break early. This gives O(n) best case on sorted input.
//
// Time: O(n²) average/worst | O(n) best (already sorted)
// Space: O(1) — in-place
// Stable: YES (equal elements maintain relative order)
// ================================================================
function bubbleSort(arr: number[]): number[] {
  const a = [...arr];
  const n = a.length;

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;

    // Each pass pushes the next-largest element to the end.
    // We only need to go up to (n - 1 - i) because the last
    // i elements are already in their final positions.
    for (let j = 0; j < n - 1 - i; j++) {
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swapped = true;
      }
    }

    // EARLY EXIT: no swaps means the array is sorted
    if (!swapped) break;
  }
  return a;
}

console.log("=== 🫧 Bubble Sort ===");
console.log("Input:  [64, 34, 25, 12, 22, 11, 90]");
console.log("Output:", bubbleSort([64, 34, 25, 12, 22, 11, 90]));
console.log();


// ================================================================
// 🎴 INSERTION SORT — Sort Like You Sort Playing Cards
// ================================================================
// WHAT: Build a sorted portion one element at a time. Pick the
//       next unsorted element (the "key") and insert it into
//       its correct position among the already-sorted elements.
//
// REAL-WORLD ANALOGY:
//   When you pick up playing cards one at a time: you slide each
//   new card into the right spot in your hand of already-sorted
//   cards.
//
// HOW IT WORKS:
//   [5, 2, 4, 6, 1, 3]
//    ^sorted       unsorted→
//   Pick 2: insert before 5 → [2, 5, | 4, 6, 1, 3]
//   Pick 4: insert between 2,5 → [2, 4, 5, | 6, 1, 3]
//   Pick 6: already in place → [2, 4, 5, 6, | 1, 3]
//   Pick 1: shift all right, insert at 0 → [1, 2, 4, 5, 6, | 3]
//   Pick 3: insert between 2,4 → [1, 2, 3, 4, 5, 6]
//
// WHY USE IT?
//   - Best for small arrays (< ~50 elements)
//   - Best for nearly-sorted arrays: O(n) in best case
//   - Used as the base case in hybrid sorts (Timsort, Introsort)
//
// Time: O(n²) average/worst | O(n) best (nearly sorted)
// Space: O(1) — in-place
// Stable: YES
// ================================================================
function insertionSort(arr: number[]): number[] {
  const a = [...arr];

  for (let i = 1; i < a.length; i++) {
    const key = a[i]; // the card we're inserting
    let j = i - 1;

    // Shift elements that are greater than key one position right
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      j--;
    }
    // Place the key in its correct position
    a[j + 1] = key;
  }
  return a;
}

console.log("=== 🎴 Insertion Sort ===");
console.log("Input:  [5, 2, 4, 6, 1, 3]");
console.log("Output:", insertionSort([5, 2, 4, 6, 1, 3]));
console.log();


// ================================================================
// 🔍 SELECTION SORT — Find the Minimum, Place It
// ================================================================
// WHAT: Divide the array into sorted (left) and unsorted (right)
//       portions. Repeatedly find the MINIMUM element in the
//       unsorted portion and swap it to the end of the sorted
//       portion.
//
// REAL-WORLD ANALOGY:
//   Like picking the shortest person out of a crowd and placing
//   them in line, then picking the next shortest, etc.
//
// HOW IT WORKS:
//   [64, 25, 12, 22, 11]
//   Find min=11 → swap with 64 → [11, | 25, 12, 22, 64]
//   Find min=12 → swap with 25 → [11, 12, | 25, 22, 64]
//   Find min=22 → swap with 25 → [11, 12, 22, | 25, 64]
//   Find min=25 → already in place → [11, 12, 22, 25, | 64]
//   Done!
//
// WHY LEARN IT?
//   - Minimizes the number of SWAPS: exactly n-1 swaps.
//     (Useful when writes are expensive, e.g., flash memory.)
//   - Simple to implement and analyze.
//
// Time: O(n²) always (no best-case optimization)
// Space: O(1) — in-place
// Stable: NO (swaps can change relative order of equal elements)
// ================================================================
function selectionSort(arr: number[]): number[] {
  const a = [...arr];

  for (let i = 0; i < a.length - 1; i++) {
    let minIdx = i;

    // Scan the unsorted portion for the minimum
    for (let j = i + 1; j < a.length; j++) {
      if (a[j] < a[minIdx]) minIdx = j;
    }

    // Swap the minimum into its correct position
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
    }
  }
  return a;
}

console.log("=== 🔍 Selection Sort ===");
console.log("Input:  [64, 25, 12, 22, 11]");
console.log("Output:", selectionSort([64, 25, 12, 22, 11]));
console.log();


// ================================================================
// 🔀 MERGE SORT — Divide and Conquer, Guaranteed O(n log n)
// ================================================================
// WHAT: Recursively split the array in half until you have
//       single elements (which are trivially sorted), then
//       merge sorted halves back together.
//
// REAL-WORLD ANALOGY:
//   Imagine sorting a deck of cards: split the deck in two,
//   sort each half, then merge by repeatedly picking the
//   smaller card from the top of each half.
//
// HOW THE DIVIDE-AND-CONQUER WORKS:
//   [38, 27, 43, 3, 9, 82, 10]
//        ↙              ↘
//   [38, 27, 43]    [3, 9, 82, 10]
//     ↙     ↘          ↙       ↘
//  [38] [27, 43]   [3, 9]  [82, 10]
//        ↙   ↘     ↙  ↘    ↙    ↘
//      [27] [43]  [3] [9] [82] [10]
//        ↘   ↙     ↘  ↙    ↘    ↙
//      [27, 43]   [3, 9]  [10, 82]
//         ↘   ↙         ↘    ↙
//      [27, 38, 43]  [3, 9, 10, 82]
//              ↘          ↙
//        [3, 9, 10, 27, 38, 43, 82]
//
// WHY IS MERGE O(n log n)?
//   - We split log(n) times (halving).
//   - Each level does O(n) work merging.
//   - Total: O(n) × O(log n) = O(n log n).
//
// Time: O(n log n) always | Space: O(n) for the merge buffer
// Stable: YES
// ================================================================
function mergeSort(arr: number[], depth = 0): number[] {
  const indent = "  ".repeat(depth);

  // BASE CASE: arrays of length 0 or 1 are already sorted
  if (arr.length <= 1) {
    console.log(`${indent}Base case: [${arr}]`);
    return arr;
  }

  // DIVIDE: split the array into two halves
  const mid = Math.floor(arr.length / 2);
  console.log(`${indent}Split [${arr}] → [${arr.slice(0, mid)}] | [${arr.slice(mid)}]`);

  // CONQUER: recursively sort each half
  const left = mergeSort(arr.slice(0, mid), depth + 1);
  const right = mergeSort(arr.slice(mid), depth + 1);

  // COMBINE: merge the two sorted halves
  const merged = merge(left, right);
  console.log(`${indent}Merge [${left}] + [${right}] → [${merged}]`);
  return merged;
}

// ================================================================
// MERGE HELPER — Combine two sorted arrays into one sorted array
// ================================================================
// HOW: Use two pointers, one for each input array. Always pick
//      the smaller element and advance that pointer. When one
//      array is exhausted, append the remainder of the other.
//
// Time: O(n + m) where n, m are the lengths of the two arrays
// ================================================================
function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }

  // Append remaining elements from whichever array isn't exhausted
  while (i < left.length) result.push(left[i++]);
  while (j < right.length) result.push(right[j++]);

  return result;
}

console.log("=== 🔀 Merge Sort (with steps) ===");
console.log("Input: [38, 27, 43, 3, 9, 82, 10]");
console.log();
const mergeSorted = mergeSort([38, 27, 43, 3, 9, 82, 10]);
console.log("\nResult:", mergeSorted);
console.log();


// ================================================================
// ⚡ QUICK SORT — Fast In-Place Divide and Conquer
// ================================================================
// WHAT: Choose a "pivot" element, partition the array so that
//       all elements < pivot are on the left and all > pivot
//       are on the right, then recursively sort the two sides.
//
// REAL-WORLD ANALOGY:
//   Like organizing a class by height: pick one student (pivot),
//   everyone shorter goes left, everyone taller goes right.
//   Then repeat in each group.
//
// HOW PARTITION WORKS (Lomuto scheme, pivot = last element):
//   [10, 7, 8, 9, 1, 5]    pivot = 5
//    i=-1
//    j=0: 10 > 5, skip
//    j=1: 7 > 5, skip
//    j=2: 8 > 5, skip
//    j=3: 9 > 5, skip
//    j=4: 1 ≤ 5, i=0, swap → [1, 7, 8, 9, 10, 5]
//    Place pivot: swap arr[1] and arr[5] → [1, 5, 8, 9, 10, 7]
//    Pivot is at index 1 — everything left is ≤ 5, right is > 5
//
// WHY O(n²) WORST CASE?
//   If we always pick the smallest/largest as pivot (e.g., sorted
//   array with last-element pivot), we get n unbalanced partitions.
//   FIX: randomized pivot selection reduces probability to near-zero.
//
// Time: O(n log n) average | O(n²) worst
// Space: O(log n) stack | O(1) auxiliary (in-place)
// Stable: NO
// ================================================================
function quickSort(arr: number[], low = 0, high = arr.length - 1, depth = 0): number[] {
  if (low < high) {
    const indent = "  ".repeat(depth);
    console.log(`${indent}Sorting [${arr.slice(low, high + 1)}] (indices ${low}..${high})`);

    const pivotIndex = partition(arr, low, high);
    console.log(
      `${indent}Pivot: ${arr[pivotIndex]} → ` +
      `left=[${arr.slice(low, pivotIndex)}] | ` +
      `pivot=[${arr[pivotIndex]}] | ` +
      `right=[${arr.slice(pivotIndex + 1, high + 1)}]`
    );

    quickSort(arr, low, pivotIndex - 1, depth + 1);
    quickSort(arr, pivotIndex + 1, high, depth + 1);
  }
  return arr;
}

// ================================================================
// PARTITION (Lomuto Scheme)
// ================================================================
// HOW: Use the last element as pivot. Maintain pointer `i` that
//      tracks where the next "small" element should go. Walk `j`
//      across the array; whenever arr[j] ≤ pivot, swap it to
//      position i+1 and advance i. Finally, place pivot at i+1.
//
// RESULT: Elements at indices [low..i] ≤ pivot ≤ elements [i+2..high]
//         Pivot is at its FINAL sorted position.
// ================================================================
function partition(arr: number[], low: number, high: number): number {
  const pivot = arr[high]; // last element as pivot
  let i = low - 1;        // boundary of "small" elements

  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  // Place pivot in its correct position
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}

console.log("=== ⚡ Quick Sort (with partition steps) ===");
const quickArr = [10, 7, 8, 9, 1, 5];
console.log("Input:", [...quickArr]);
console.log();
quickSort(quickArr);
console.log("\nResult:", quickArr);
console.log();


// ================================================================
// 🔢 COUNTING SORT — O(n+k) Non-Comparison Sort
// ================================================================
// WHAT: Instead of comparing elements, COUNT how many times each
//       value appears, then reconstruct the sorted array from
//       those counts.
//
// WHY IS IT O(n+k) INSTEAD OF O(n log n)?
//   Comparison-based sorts have a theoretical lower bound of
//   O(n log n). Counting sort breaks this by NOT comparing —
//   it directly maps values to positions using arithmetic.
//   The catch: it only works for integers in a bounded range [min, max].
//
// HOW IT WORKS:
//   Input: [4, 2, 2, 8, 3, 3, 1]
//   Step 1: Count occurrences → {1:1, 2:2, 3:2, 4:1, 8:1}
//   Step 2: Cumulative counts → {1:1, 2:3, 3:5, 4:6, 8:7}
//           (tells us: "1" ends at position 1, "2" ends at 3, etc.)
//   Step 3: Place elements from right-to-left using cumulative counts
//   Output: [1, 2, 2, 3, 3, 4, 8]
//
// REAL-WORLD ANALOGY:
//   Like sorting exam papers by grade: make a pile for each grade
//   (A, B, C, D, F), drop each paper in its pile, then stack
//   the piles together. No comparison needed!
//
// Time: O(n + k) where k = max - min + 1
// Space: O(n + k)
// Stable: YES (the right-to-left placement preserves order)
// ================================================================
function countingSort(arr: number[]): number[] {
  if (arr.length === 0) return [];

  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const range = max - min + 1;
  const count = new Array(range).fill(0);
  const output = new Array(arr.length);

  console.log(`  Range: ${min} to ${max} (${range} buckets)`);

  // Step 1: Count occurrences
  for (const num of arr) {
    count[num - min]++;
  }

  console.log("  Counts:", count.map((c, i) => `${i + min}:${c}`).filter(s => !s.endsWith(":0")).join(", "));

  // Step 2: Cumulative sum (each count[i] now holds the number
  // of elements ≤ i, which tells us the final position)
  for (let i = 1; i < range; i++) {
    count[i] += count[i - 1];
  }

  // Step 3: Build output array (iterate right-to-left for stability)
  for (let i = arr.length - 1; i >= 0; i--) {
    output[count[arr[i] - min] - 1] = arr[i];
    count[arr[i] - min]--;
  }

  return output;
}

console.log("=== 🔢 Counting Sort ===");
console.log("Input: [4, 2, 2, 8, 3, 3, 1]");
const countingSorted = countingSort([4, 2, 2, 8, 3, 3, 1]);
console.log("Output:", countingSorted);
console.log();


// ================================================================
// 🎯 QUICK SELECT — Find the Kth Smallest in O(n) Average
// ================================================================
// WHAT: Find the k-th smallest element WITHOUT fully sorting.
//       Based on Quick Sort's partition, but only recurses into
//       ONE side (the side that contains index k).
//
// WHY IS IT O(n) AVERAGE (not O(n log n))?
//   Each partition does O(n) work but cuts the problem in half.
//   Total work: n + n/2 + n/4 + ... ≈ 2n = O(n).
//   (Compare to Quick Sort which recurses into BOTH sides → O(n log n).)
//
// HOW:
//   1. Partition the array around a random pivot.
//   2. If pivot lands at index k → that's our answer!
//   3. If k < pivotIndex → recurse LEFT only.
//   4. If k > pivotIndex → recurse RIGHT only.
//
// REAL-WORLD ANALOGY:
//   Finding the median salary at a company. You don't need to
//   sort all salaries — just partition: "are there enough people
//   below this number?" and narrow down.
//
// Time: O(n) average | O(n²) worst (mitigated by random pivot)
// Space: O(1) extra
// ================================================================
function quickSelect(arr: number[], k: number): number {
  const a = [...arr]; // don't mutate the original
  return quickSelectHelper(a, 0, a.length - 1, k);
}

function quickSelectHelper(arr: number[], low: number, high: number, k: number): number {
  if (low === high) return arr[low]; // only one element left

  const pivotIndex = qsPartition(arr, low, high);

  if (k === pivotIndex) {
    return arr[k]; // pivot IS the k-th element!
  } else if (k < pivotIndex) {
    return quickSelectHelper(arr, low, pivotIndex - 1, k); // search LEFT only
  } else {
    return quickSelectHelper(arr, pivotIndex + 1, high, k); // search RIGHT only
  }
}

// ================================================================
// PARTITION WITH RANDOM PIVOT — Avoids worst-case on sorted input
// ================================================================
// WHY RANDOMIZE? If the input is sorted and we always pick the
// last element, every partition is maximally unbalanced → O(n²).
// Random pivot makes this astronomically unlikely.
// ================================================================
function qsPartition(arr: number[], low: number, high: number): number {
  const randomIdx = low + Math.floor(Math.random() * (high - low + 1));
  [arr[randomIdx], arr[high]] = [arr[high], arr[randomIdx]];

  const pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}

console.log("=== 🎯 Quick Select ===");
const ksArr = [3, 2, 1, 5, 6, 4];
console.log("Array:", ksArr);

console.log(`1st smallest (k=0): ${quickSelect(ksArr, 0)}`);
console.log(`2nd smallest (k=1): ${quickSelect(ksArr, 1)}`);
console.log(`3rd smallest (k=2): ${quickSelect(ksArr, 2)}`);

const n = ksArr.length;
console.log(`\nKth Largest shortcut: "2nd largest" = (n - 2)th smallest`);
console.log(`2nd largest: ${quickSelect(ksArr, n - 2)}`);
console.log();


// ================================================================
// ⚠️ JAVASCRIPT .sort() GOTCHAS — Things That Bite You in Interviews
// ================================================================
// JavaScript's built-in .sort() has several non-obvious behaviors
// that cause bugs if you're not careful. Let's see them all.
// ================================================================

console.log("=== ⚠️ JavaScript .sort() Gotchas ===");
console.log();

// ================================================================
// GOTCHA 1: Default sort is LEXICOGRAPHIC, not numeric!
// ================================================================
// WHY? .sort() converts elements to strings and compares Unicode
// code points. So "10" < "2" because "1" < "2" in Unicode.
// FIX: Always pass a numeric comparator: (a, b) => a - b
// ================================================================
console.log("--- Gotcha 1: Default sort is LEXICOGRAPHIC ---");
const nums1 = [10, 2, 1, 20, 3];
console.log("Input:", [...nums1]);
console.log("Default .sort():", [...nums1].sort());
console.log("Correct numeric .sort((a,b) => a-b):", [...nums1].sort((a, b) => a - b));
console.log();

// ================================================================
// GOTCHA 2: .sort() MUTATES the original array!
// ================================================================
// WHY? For performance — creating a new array every time would
// be wasteful. But it means you might accidentally modify data.
// FIX: Spread first: [...arr].sort(...)
// ================================================================
console.log("--- Gotcha 2: .sort() MUTATES the original ---");
const original = [3, 1, 2];
console.log("Before sort:", [...original]);
const sorted = original.sort((a, b) => a - b);
console.log("After sort, original:", original);
console.log("Same reference?", original === sorted);
console.log();

console.log("--- Fix: spread operator to avoid mutation ---");
const safe = [3, 1, 2];
const safeSorted = [...safe].sort((a, b) => a - b);
console.log("Original preserved:", safe);
console.log("Sorted copy:", safeSorted);
console.log();

// ================================================================
// GOTCHA 3: Negative numbers with default sort
// ================================================================
// "-10" as a string sorts before "-1" because '-' is the same,
// then '1' < '3' — but this isn't numeric order!
// ================================================================
console.log("--- Gotcha 3: Negative numbers ---");
const negatives = [-1, -10, 5, 0, -3, 2];
console.log("Default .sort():", [...negatives].sort());
console.log("Correct:", [...negatives].sort((a, b) => a - b));
console.log();


// ================================================================
// 🔧 CUSTOM COMPARATOR EXAMPLES
// ================================================================
// The comparator function (a, b) => number works as follows:
//   - Return negative → a comes first
//   - Return positive → b comes first
//   - Return 0 → keep original order (stable sort)
//
// This is the MOST IMPORTANT skill for sorting problems in
// interviews. You need to know how to sort by custom criteria.
// ================================================================

console.log("=== 🔧 Custom Comparator Examples ===");
console.log();

// ── Sort by absolute value ──
console.log("--- Sort by absolute value ---");
const absArr = [-5, 3, -1, 4, -2];
console.log("Input:", absArr);
console.log("Sorted by |value|:", [...absArr].sort((a, b) => Math.abs(a) - Math.abs(b)));
console.log();

// ── Sort strings: by length first, then alphabetically ──
console.log("--- Sort strings by length, then alphabetically ---");
const words = ["banana", "apple", "kiwi", "fig", "grape", "pear"];
const sortedWords = [...words].sort((a, b) => {
  if (a.length !== b.length) return a.length - b.length; // shorter first
  return a.localeCompare(b);                              // then alphabetically
});
console.log("Input:", words);
console.log("Sorted:", sortedWords);
console.log();

// ── Sort objects by multiple criteria ──
// PATTERN: Check fields in priority order. If the current
// field differs, return the comparison. Otherwise fall through
// to the next field. This is a very common interview pattern.
console.log("--- Sort objects by multiple criteria ---");
interface Student {
  name: string;
  grade: number;
  age: number;
}

const students: Student[] = [
  { name: "Alice", grade: 90, age: 22 },
  { name: "Bob", grade: 85, age: 21 },
  { name: "Charlie", grade: 90, age: 20 },
  { name: "Diana", grade: 85, age: 22 },
  { name: "Eve", grade: 92, age: 21 },
];

const sortedStudents = [...students].sort((a, b) => {
  if (a.grade !== b.grade) return b.grade - a.grade; // grade descending
  if (a.age !== b.age) return a.age - b.age;         // age ascending
  return a.name.localeCompare(b.name);                // name alphabetically
});

console.log("Students sorted by grade (desc), age (asc), name (alpha):");
sortedStudents.forEach((s) => {
  console.log(`  ${s.name}: grade=${s.grade}, age=${s.age}`);
});
console.log();

// ================================================================
// SORT BY FREQUENCY — LeetCode 1636
// ================================================================
// WHAT: Sort array by frequency (ascending). For ties in
//       frequency, sort by value (descending).
//
// HOW:
//   1. Build a frequency map: {1:2, 2:3, 3:1}
//   2. Sort with comparator: compare freq first, then value.
//
// Time: O(n log n) for the sort
// ================================================================
console.log("--- Sort by frequency (LeetCode 1636) ---");
function sortByFrequency(nums: number[]): number[] {
  const freq = new Map<number, number>();
  for (const n of nums) {
    freq.set(n, (freq.get(n) || 0) + 1);
  }

  return [...nums].sort((a, b) => {
    const freqDiff = freq.get(a)! - freq.get(b)!;
    if (freqDiff !== 0) return freqDiff;     // ascending frequency
    return b - a;                             // descending value for ties
  });
}

console.log("Input: [1, 1, 2, 2, 2, 3]");
console.log("Sorted by frequency:", sortByFrequency([1, 1, 2, 2, 2, 3]));
console.log();


// ================================================================
// 🇳🇱 DUTCH NATIONAL FLAG — Sort Colors (LeetCode 75)
// ================================================================
// WHAT: Sort an array containing only 0s, 1s, and 2s in one pass.
//       This is Dijkstra's Dutch National Flag problem.
//
// WHY NOT JUST .sort()?
//   We can do it in O(n) time with O(1) space and a SINGLE pass.
//   .sort() is O(n log n) — overkill for 3 values.
//
// HOW (Three-Pointer Technique):
//   - `low`: boundary of 0s (everything before low is 0)
//   - `mid`: current element being examined
//   - `high`: boundary of 2s (everything after high is 2)
//
//   Rules:
//   - a[mid] === 0 → swap with low, advance both low and mid
//   - a[mid] === 1 → it's in the right place, advance mid
//   - a[mid] === 2 → swap with high, shrink high (DON'T advance mid
//     because the swapped-in element hasn't been examined yet!)
//
// Time: O(n) single pass | Space: O(1)
// ================================================================
console.log("=== 🇳🇱 Dutch National Flag (Sort Colors) ===");

function sortColors(nums: number[]): number[] {
  const a = [...nums];
  let low = 0;
  let mid = 0;
  let high = a.length - 1;

  while (mid <= high) {
    if (a[mid] === 0) {
      [a[low], a[mid]] = [a[mid], a[low]];
      low++;
      mid++;
    } else if (a[mid] === 1) {
      mid++;
    } else {
      [a[mid], a[high]] = [a[high], a[mid]];
      high--;
      // NOTE: don't advance mid — the swapped element needs checking!
    }
  }
  return a;
}

console.log("Input:  [2, 0, 2, 1, 1, 0]");
console.log("Output:", sortColors([2, 0, 2, 1, 1, 0]));
console.log();


// ================================================================
// 📊 MERGE INTERVALS — LeetCode 56
// ================================================================
// WHAT: Given a collection of intervals, merge all overlapping ones.
//
// HOW:
//   1. Sort intervals by start time. This ensures that if two
//      intervals overlap, they'll be adjacent after sorting.
//   2. Walk through sorted intervals. For each interval:
//      - If it overlaps with the last merged interval
//        (current.start ≤ last.end), extend last.end.
//      - Otherwise, it's a new non-overlapping interval.
//
// WHY SORT FIRST?
//   Without sorting, you'd need to compare every pair → O(n²).
//   Sorting guarantees that overlapping intervals are neighbors → O(n log n).
//
// Time: O(n log n) for sorting | Space: O(n) for output
// ================================================================
console.log("=== 📊 Merge Intervals ===");

function mergeIntervals(intervals: number[][]): number[][] {
  intervals.sort((a, b) => a[0] - b[0]);
  const merged: number[][] = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const last = merged[merged.length - 1];
    if (intervals[i][0] <= last[1]) {
      // OVERLAP: extend the end of the last merged interval
      last[1] = Math.max(last[1], intervals[i][1]);
    } else {
      // NO OVERLAP: start a new interval
      merged.push(intervals[i]);
    }
  }

  return merged;
}

const intervals = [[1, 3], [2, 6], [8, 10], [15, 18]];
console.log("Input: ", JSON.stringify(intervals));
console.log("Merged:", JSON.stringify(mergeIntervals([...intervals.map((i) => [...i])])));
console.log();


// ================================================================
// 📈 PERFORMANCE COMPARISON — See the O(n²) vs O(n log n) Gap
// ================================================================
// This benchmarks all sorting algorithms on random arrays to
// demonstrate the dramatic speed difference between quadratic
// and linearithmic algorithms.
//
// At n=1000:  Bubble/Selection/Insertion take ~1-10ms
// At n=5000:  Bubble/Selection take ~25-250ms (25x slower!)
//             Merge/Quick take ~2-5ms (barely changed!)
//
// This is why O(n²) algorithms are impractical for large inputs.
// ================================================================

console.log("=== 📈 Performance Comparison ===");

function generateRandomArray(size: number): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * size));
}

function timeSort(name: string, sortFn: (arr: number[]) => number[], arr: number[]): void {
  const copy = [...arr];
  const start = performance.now();
  sortFn(copy);
  const elapsed = (performance.now() - start).toFixed(2);
  console.log(`  ${name.padEnd(20)} ${elapsed}ms`);
}

const sizes = [1000, 5000];

for (const size of sizes) {
  const arr = generateRandomArray(size);
  console.log(`\nn = ${size}:`);

  if (size <= 5000) {
    timeSort("Bubble Sort", bubbleSort, arr);
    timeSort("Selection Sort", selectionSort, arr);
    timeSort("Insertion Sort", insertionSort, arr);
  }
  timeSort("Merge Sort", (a) => mergeSort(a.slice(), 999), arr);
  timeSort("Quick Sort", (a) => { quickSort(a); return a; }, arr);
  timeSort("Counting Sort", countingSort, arr);
  timeSort("Built-in .sort()", (a) => { a.sort((x, y) => x - y); return a; }, arr);
}

console.log("\n✅ All sorting examples complete!");
