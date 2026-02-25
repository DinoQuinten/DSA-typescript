export {};

// ================================================================
// 🔍 Chapter 10: BINARY SEARCH — Step-by-Step Runnable Examples
// ================================================================
//
// WHAT IS BINARY SEARCH?
// A technique for finding a target value in a SORTED array by
// repeatedly halving the search space. Instead of checking every
// element (O(n)), we eliminate half the candidates each step.
//
// REAL-WORLD ANALOGY:
// Think of guessing a number between 1–100. You ask "Is it
// higher or lower than 50?" → instantly eliminate 50 numbers.
// Then "Higher or lower than 75?" → eliminate 25 more.
// In just 7 guesses, you find any number from 1 to 100!
//
// THE THREE TEMPLATES:
//   Template 1: left <= right      (classic — find exact match)
//   Template 2: left < right       (find leftmost/first occurrence)
//   Template 3: left < right + ceil (find rightmost/last occurrence)
//
// PREREQUISITE: The input MUST be sorted (or monotonic for
//               "search on answer" problems).
//
// COMPLEXITY:
//   Time: O(log n) — halving n times gives log₂(n) steps
//   Space: O(1) — just a few pointers
//
// THE OVERFLOW-SAFE MIDPOINT FORMULA:
//   mid = left + Math.floor((right - left) / 2)
//   NOT: mid = Math.floor((left + right) / 2)  ← can overflow!
//
// Run: bun run binary-search.ts
// ================================================================


// ================================================================
// 1️⃣ CLASSIC BINARY SEARCH — Template 1: left <= right
// ================================================================
// WHAT: Find the index of `target` in a sorted array, or -1.
//
// HOW THE TEMPLATE WORKS:
//   - Initialize: left = 0, right = n-1
//   - Loop while left <= right (search space is non-empty)
//   - Calculate mid (overflow-safe)
//   - If arr[mid] === target → found!
//   - If arr[mid] < target → target is in the right half → left = mid + 1
//   - If arr[mid] > target → target is in the left half → right = mid - 1
//   - If loop ends without finding → target doesn't exist
//
// WHY left <= right (not <)?
//   Because when left === right, there's still ONE element to check.
//   Using < would skip that last element.
//
// WHY mid + 1 and mid - 1 (not mid)?
//   We've already checked mid. Including it again would cause an
//   infinite loop when left === right.
//
// Time: O(log n) | Space: O(1)
// ================================================================
function binarySearch(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1;
  let step = 0;

  console.log(`\n🔍 Classic Binary Search: find ${target} in [${nums}]`);

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    step++;
    console.log(
      `  Step ${step}: left=${left}, right=${right}, mid=${mid}, arr[mid]=${nums[mid]}`
    );

    if (nums[mid] === target) {
      console.log(`  ✅ Found ${target} at index ${mid}!`);
      return mid;
    } else if (nums[mid] < target) {
      console.log(`  ${nums[mid]} < ${target} → search RIGHT half`);
      left = mid + 1;
    } else {
      console.log(`  ${nums[mid]} > ${target} → search LEFT half`);
      right = mid - 1;
    }
  }

  console.log(`  ❌ ${target} not found`);
  return -1;
}


// ================================================================
// 2️⃣ FIND FIRST OCCURRENCE — Template 2: Leftmost Position
// ================================================================
// WHAT: In an array with DUPLICATES, find the FIRST (leftmost)
//       index of the target value.
//
// WHY CAN'T WE USE TEMPLATE 1?
//   Template 1 stops at the FIRST match it finds, which could be
//   any of the duplicates (not necessarily the leftmost).
//
// HOW THIS TEMPLATE DIFFERS:
//   - Loop: left < right (not <=)
//   - When arr[mid] >= target: right = mid (keep mid as candidate)
//     NOT mid - 1! Because mid might BE the first occurrence.
//   - When arr[mid] < target: left = mid + 1 (mid is too small)
//   - mid = floor formula (rounds down → avoids infinite loop
//     because left always moves forward or right moves to mid)
//
// EXAMPLE:
//   [1, 2, 2, 2, 2, 3, 4], target = 2
//   We want index 1 (first '2'), not index 2 or 3.
//
// PATTERN: "Find the first/smallest X that satisfies condition"
//
// Time: O(log n) | Space: O(1)
// ================================================================
function findFirstOccurrence(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1;
  let step = 0;

  console.log(
    `\n🔵 Find FIRST occurrence of ${target} in [${nums}]`
  );

  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    step++;
    console.log(
      `  Step ${step}: left=${left}, right=${right}, mid=${mid}, arr[mid]=${nums[mid]}`
    );

    if (nums[mid] < target) {
      console.log(`  ${nums[mid]} < ${target} → left = mid + 1`);
      left = mid + 1;
    } else {
      // arr[mid] >= target: mid could be the answer, so keep it
      console.log(
        `  ${nums[mid]} >= ${target} → right = mid (keep mid as candidate)`
      );
      right = mid;
    }
  }

  if (nums[left] === target) {
    console.log(`  ✅ First occurrence at index ${left}`);
    return left;
  }
  console.log(`  ❌ ${target} not found`);
  return -1;
}


// ================================================================
// 3️⃣ FIND LAST OCCURRENCE — Template 3: Rightmost Position
// ================================================================
// WHAT: In an array with DUPLICATES, find the LAST (rightmost)
//       index of the target value.
//
// KEY DIFFERENCE FROM TEMPLATE 2:
//   - mid = CEIL formula: left + Math.ceil((right - left) / 2)
//     WHY CEIL? With floor, when left + 1 === right and we set
//     left = mid, mid would be left again → infinite loop!
//     Ceil ensures mid rounds UP, so left always advances.
//   - When arr[mid] <= target: left = mid (keep mid as candidate)
//   - When arr[mid] > target: right = mid - 1
//
// EXAMPLE:
//   [1, 2, 2, 2, 2, 3, 4], target = 2
//   We want index 4 (last '2'), not index 1, 2, or 3.
//
// PATTERN: "Find the last/largest X that satisfies condition"
//
// ⚠️ INFINITE LOOP WARNING:
//   If you use floor instead of ceil here, the loop will hang
//   when left and right differ by 1. This is the #1 bug in
//   binary search implementations!
//
// Time: O(log n) | Space: O(1)
// ================================================================
function findLastOccurrence(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1;
  let step = 0;

  console.log(
    `\n🟠 Find LAST occurrence of ${target} in [${nums}]`
  );

  while (left < right) {
    const mid = left + Math.ceil((right - left) / 2); // ⚠️ CEIL to avoid infinite loop
    step++;
    console.log(
      `  Step ${step}: left=${left}, right=${right}, mid=${mid} (ceil!), arr[mid]=${nums[mid]}`
    );

    if (nums[mid] > target) {
      console.log(`  ${nums[mid]} > ${target} → right = mid - 1`);
      right = mid - 1;
    } else {
      // arr[mid] <= target: mid could be the answer, so keep it
      console.log(
        `  ${nums[mid]} <= ${target} → left = mid (keep mid as candidate)`
      );
      left = mid;
    }
  }

  if (nums[left] === target) {
    console.log(`  ✅ Last occurrence at index ${left}`);
    return left;
  }
  console.log(`  ❌ ${target} not found`);
  return -1;
}


// ================================================================
// 4️⃣ SEARCH IN ROTATED SORTED ARRAY — LeetCode 33
// ================================================================
// WHAT: Find a target in an array that WAS sorted but then
//       rotated at some unknown pivot.
//       e.g., [0,1,2,4,5,6,7] rotated at 4 → [4,5,6,7,0,1,2]
//
// WHY IS THIS TRICKY?
//   The array isn't fully sorted, so basic binary search doesn't
//   directly apply. BUT: at least ONE half (left or right of mid)
//   is ALWAYS sorted. We can determine which half is sorted and
//   whether the target lies within it.
//
// HOW:
//   1. Find mid.
//   2. Determine which half is sorted:
//      - If arr[left] <= arr[mid] → LEFT half is sorted
//      - Otherwise → RIGHT half is sorted
//   3. Check if target is within the sorted half:
//      - If yes → search that half
//      - If no → search the other half
//
// WHY DOES THIS WORK?
//   In a rotated sorted array, the rotation point creates exactly
//   one "break". At any mid point, one half won't contain the
//   break and will be perfectly sorted.
//
// Time: O(log n) | Space: O(1)
// ================================================================
function searchRotated(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1;
  let step = 0;

  console.log(
    `\n🔄 Search in Rotated Sorted Array: find ${target} in [${nums}]`
  );

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    step++;
    console.log(
      `  Step ${step}: left=${left}, right=${right}, mid=${mid}, arr[mid]=${nums[mid]}`
    );

    if (nums[mid] === target) {
      console.log(`  ✅ Found ${target} at index ${mid}!`);
      return mid;
    }

    // DETERMINE WHICH HALF IS SORTED
    if (nums[left] <= nums[mid]) {
      console.log(
        `  Left half [${nums.slice(left, mid + 1)}] is sorted`
      );
      if (nums[left] <= target && target < nums[mid]) {
        console.log(`  Target ${target} is in sorted left half → go LEFT`);
        right = mid - 1;
      } else {
        console.log(`  Target ${target} is NOT in left half → go RIGHT`);
        left = mid + 1;
      }
    } else {
      console.log(
        `  Right half [${nums.slice(mid, right + 1)}] is sorted`
      );
      if (nums[mid] < target && target <= nums[right]) {
        console.log(`  Target ${target} is in sorted right half → go RIGHT`);
        left = mid + 1;
      } else {
        console.log(`  Target ${target} is NOT in right half → go LEFT`);
        right = mid - 1;
      }
    }
  }

  console.log(`  ❌ ${target} not found`);
  return -1;
}


// ================================================================
// 5️⃣ FIND PEAK ELEMENT — LeetCode 162
// ================================================================
// WHAT: Find any element that is strictly greater than its
//       neighbors. The array is NOT sorted, but we can still
//       use binary search!
//
// WHY CAN WE USE BINARY SEARCH ON AN UNSORTED ARRAY?
//   We don't need the array to be sorted. We just need a
//   MONOTONIC PROPERTY: "there exists a peak on one side."
//   - If arr[mid] < arr[mid+1] → the sequence is ASCENDING
//     at mid → a peak MUST exist to the RIGHT (including mid+1)
//   - If arr[mid] > arr[mid+1] → the sequence is DESCENDING
//     at mid → a peak MUST exist to the LEFT (including mid)
//   This is because the edges are defined as -∞.
//
// KEY INSIGHT:
//   We're not searching for a value. We're searching for a
//   CONDITION (being a local maximum). As long as we can
//   determine which direction the peak is in, binary search works.
//
// Time: O(log n) | Space: O(1)
// ================================================================
function findPeakElement(nums: number[]): number {
  let left = 0;
  let right = nums.length - 1;
  let step = 0;

  console.log(`\n⛰️ Find Peak Element in [${nums}]`);

  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    step++;
    console.log(
      `  Step ${step}: left=${left}, right=${right}, mid=${mid}, ` +
        `arr[mid]=${nums[mid]}, arr[mid+1]=${nums[mid + 1]}`
    );

    if (nums[mid] < nums[mid + 1]) {
      // ASCENDING: peak is to the right
      console.log(
        `  ${nums[mid]} < ${nums[mid + 1]} → ascending, peak is to the RIGHT`
      );
      left = mid + 1;
    } else {
      // DESCENDING: peak is here or to the left
      console.log(
        `  ${nums[mid]} > ${nums[mid + 1]} → descending, peak is HERE or LEFT`
      );
      right = mid;
    }
  }

  console.log(`  ✅ Peak at index ${left}, value = ${nums[left]}`);
  return left;
}


// ================================================================
// 6️⃣ KOKO EATING BANANAS — Search on Answer / Parametric Search
// ================================================================
// WHAT: Koko has `piles` of bananas and `h` hours. She eats at
//       speed `k` bananas/hour (one pile at a time). Find the
//       MINIMUM `k` so she finishes all piles in ≤ h hours.
//       (LeetCode 875)
//
// WHY IS THIS BINARY SEARCH?
//   We're not searching an array — we're searching a RANGE of
//   possible answers [1, max(piles)]. The key insight:
//   - If speed k works, then speed k+1 also works (monotonic!).
//   - If speed k doesn't work, then speed k-1 also won't work.
//   This monotonic "feasibility function" is what makes binary
//   search applicable.
//
// HOW:
//   1. Search space: [1, max(piles)]
//   2. For each candidate speed `mid`:
//      - Calculate total hours needed: sum of ceil(pile / mid)
//      - If hours ≤ h → speed works! Try slower (right = mid)
//      - If hours > h → too slow! Speed up (left = mid + 1)
//   3. When left === right, we've found the minimum speed.
//
// PATTERN NAME: "Binary Search on Answer"
//   Use whenever you can frame a problem as:
//   "What is the minimum/maximum X such that condition(X) is true?"
//   and condition is monotonic (once true, stays true).
//
// Time: O(n · log(max)) | Space: O(1)
// ================================================================
function minEatingSpeed(piles: number[], h: number): number {
  let left = 1;
  let right = Math.max(...piles);
  let step = 0;

  console.log(
    `\n🍌 Koko Eating Bananas: piles=[${piles}], hours=${h}`
  );
  console.log(`  Search space for speed: [${left}, ${right}]`);

  const canFinish = (speed: number): boolean => {
    let hours = 0;
    for (const pile of piles) {
      hours += Math.ceil(pile / speed);
    }
    return hours <= h;
  };

  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    step++;
    const hoursNeeded = piles.reduce(
      (sum, pile) => sum + Math.ceil(pile / mid),
      0
    );
    const feasible = canFinish(mid);
    console.log(
      `  Step ${step}: speed=${mid}, hours needed=${hoursNeeded}, ` +
        `feasible=${feasible ? "✅" : "❌"}`
    );

    if (feasible) {
      console.log(`  Can finish at speed ${mid} → try slower (right = mid)`);
      right = mid;
    } else {
      console.log(
        `  Too slow at speed ${mid} → speed up (left = mid + 1)`
      );
      left = mid + 1;
    }
  }

  console.log(`  🎯 Minimum eating speed = ${left}`);
  return left;
}


// ================================================================
// 7️⃣ INTEGER SQUARE ROOT — Binary Search on Answer
// ================================================================
// WHAT: Compute floor(√x) without using Math.sqrt().
//       Another classic "search on answer" problem.
//
// WHY BINARY SEARCH?
//   We're searching for the largest integer `m` such that m² ≤ x.
//   The function f(m) = m² is monotonically increasing, so we
//   can binary search on it.
//
// HOW:
//   - Search space: [1, x/2] (√x is always ≤ x/2 for x ≥ 4)
//   - If mid² === x → exact square root
//   - If mid² < x → answer might be higher → left = mid + 1
//   - If mid² > x → answer is lower → right = mid - 1
//   - When loop ends, `right` is floor(√x)
//
// WHY `right` AND NOT `left`?
//   At the end, left > right. The last valid mid where mid² ≤ x
//   was stored implicitly in `right` (because right = mid - 1
//   only when mid² > x, so right points to the last valid value).
//
// Time: O(log x) | Space: O(1)
// ================================================================
function mySqrt(x: number): number {
  if (x < 2) return x;

  let left = 1;
  let right = Math.floor(x / 2);
  let step = 0;

  console.log(`\n√ Square Root of ${x} using Binary Search`);
  console.log(`  Search space: [${left}, ${right}]`);

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    const square = mid * mid;
    step++;
    console.log(
      `  Step ${step}: left=${left}, right=${right}, mid=${mid}, mid²=${square}`
    );

    if (square === x) {
      console.log(`  ✅ Exact: √${x} = ${mid}`);
      return mid;
    } else if (square < x) {
      console.log(`  ${square} < ${x} → search higher`);
      left = mid + 1;
    } else {
      console.log(`  ${square} > ${x} → search lower`);
      right = mid - 1;
    }
  }

  console.log(`  ✅ floor(√${x}) = ${right}`);
  return right;
}


// ================================================================
// 🚀 RUN ALL EXAMPLES
// ================================================================
// Each function prints its own step-by-step trace, so you can
// see exactly how binary search narrows the search space.
// ================================================================

console.log("=".repeat(60));
console.log("🔍 BINARY SEARCH — Step-by-Step Examples");
console.log("=".repeat(60));

// 1. Classic binary search — exact match
binarySearch([1, 3, 5, 7, 9, 11, 13, 15, 17, 19], 11);
binarySearch([1, 3, 5, 7, 9, 11, 13, 15, 17, 19], 6);

// 2. Find first (leftmost) occurrence in array with duplicates
findFirstOccurrence([1, 2, 2, 2, 2, 3, 4], 2);
findFirstOccurrence([1, 3, 5, 7, 9], 4);

// 3. Find last (rightmost) occurrence in array with duplicates
findLastOccurrence([1, 2, 2, 2, 2, 3, 4], 2);

// 4. Search in rotated sorted array
searchRotated([4, 5, 6, 7, 0, 1, 2], 0);
searchRotated([4, 5, 6, 7, 0, 1, 2], 3);

// 5. Find peak element (binary search on unsorted array!)
findPeakElement([1, 2, 3, 1]);
findPeakElement([1, 2, 1, 3, 5, 6, 4]);

// 6. Koko eating bananas (binary search on answer space)
minEatingSpeed([3, 6, 7, 11], 8);
minEatingSpeed([30, 11, 23, 4, 20], 5);

// 7. Integer square root (binary search on answer space)
mySqrt(27);
mySqrt(49);
mySqrt(100);
