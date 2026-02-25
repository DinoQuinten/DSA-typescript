export {};

// ================================================================
// 🔀 Chapter 11: TWO POINTERS — Runnable TypeScript Examples
// ================================================================
//
// WHAT IS THE TWO POINTERS TECHNIQUE?
// Use two index variables (pointers) that move through a data
// structure in a coordinated way to solve problems efficiently —
// often reducing O(n²) brute force to O(n).
//
// THREE MAIN PATTERNS:
//
//   ⬅️➡️ OPPOSITE DIRECTION (converging):
//     Pointers start at opposite ends and move toward each other.
//     Used for: pair sums, palindromes, container problems.
//     Example: left = 0, right = n-1, move inward.
//
//   ➡️➡️ SAME DIRECTION (fast & slow):
//     Both pointers start at the same end; one moves faster.
//     Used for: removing duplicates, partitioning, linked list cycle.
//     Example: slow writes, fast scans ahead.
//
//   📚📚 TWO INPUTS:
//     One pointer per input (e.g., two sorted arrays).
//     Used for: merging, subsequence checking.
//     Example: pointer in string s, pointer in string t.
//
// WHY IS IT O(n)?
//   Each pointer moves at most n steps total. Even with two
//   pointers, total work is O(n) + O(n) = O(n), not O(n²).
//
// Run: bun run two-pointers.ts
// ================================================================


// ================================================================
// 1. 🎯 TWO SUM II — Sorted Array (Opposite Direction)
// LeetCode 167
// ================================================================
// WHAT: Given a SORTED array and a target, find two numbers
//       that add up to the target. Return their 1-indexed positions.
//
// WHY TWO POINTERS (not hash map)?
//   A hash map works but doesn't exploit the sorted property.
//   Two pointers uses the sort to eliminate candidates intelligently:
//   - sum too small → move left pointer right (increase sum)
//   - sum too big → move right pointer left (decrease sum)
//   - sum equals target → found!
//
// REAL-WORLD ANALOGY:
//   Two people searching a bookshelf sorted by page count.
//   One starts from thinnest books, one from thickest.
//   "Together our books have 500 pages — too many? I'll pick
//   a thinner one. Too few? You pick a thicker one."
//
// WHY DOES THIS GUARANTEE FINDING THE ANSWER?
//   In a sorted array, if sum < target, moving right won't help
//   (right is already at its maximum useful position). The ONLY
//   way to increase the sum is to move left forward. Vice versa.
//   We never skip a valid pair.
//
// Time: O(n) | Space: O(1)
// ================================================================
function twoSumII(numbers: number[], target: number): [number, number] {
  let left = 0;
  let right = numbers.length - 1;

  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) return [left + 1, right + 1]; // 1-indexed result
    if (sum < target) left++;   // need a bigger sum → move left up
    else right--;               // need a smaller sum → move right down
  }

  return [-1, -1]; // no pair found
}

console.log("=== Two Sum II (Sorted) ===");
console.log("Input: [2,7,11,15], target=9");
console.log("Output:", twoSumII([2, 7, 11, 15], 9)); // [1, 2]

console.log("Input: [2,3,4], target=6");
console.log("Output:", twoSumII([2, 3, 4], 6)); // [1, 3]

console.log("Input: [-1,0], target=-1");
console.log("Output:", twoSumII([-1, 0], -1)); // [1, 2]
console.log();


// ================================================================
// 2. 🔺 3SUM — Sort + Fix One + Two Pointers (LeetCode 15)
// ================================================================
// WHAT: Find ALL unique triplets [a, b, c] where a + b + c = 0.
//
// BRUTE FORCE: Three nested loops → O(n³). Way too slow.
//
// OPTIMIZED APPROACH: O(n²)
//   1. SORT the array → enables two-pointer technique + dedup.
//   2. FIX one element (nums[i]) with an outer loop.
//   3. Use TWO POINTERS on the remaining subarray [i+1..n-1]
//      to find pairs that sum to -nums[i].
//
// HANDLING DUPLICATES (the tricky part):
//   - Skip duplicate values of nums[i] (if nums[i] === nums[i-1])
//   - After finding a triplet, skip duplicate values of left and
//     right pointers to avoid adding the same triplet twice.
//
// EARLY TERMINATION:
//   If nums[i] > 0, then nums[i] + nums[left] + nums[right] > 0
//   for all left, right > i (since array is sorted). Break early.
//
// WHY SORT FIRST?
//   - Enables two-pointer technique (needs sorted data).
//   - Makes duplicate skipping trivial (duplicates are adjacent).
//
// Time: O(n²) — outer loop × inner two-pointer scan
// Space: O(1) extra (ignoring output and sort space)
// ================================================================
function threeSum(nums: number[]): number[][] {
  const result: number[][] = [];
  nums.sort((a, b) => a - b); // sort ascending

  for (let i = 0; i < nums.length - 2; i++) {
    // SKIP DUPLICATE: same value as previous → would produce same triplets
    if (i > 0 && nums[i] === nums[i - 1]) continue;

    // EARLY EXIT: if smallest remaining is positive, no triplet sums to 0
    if (nums[i] > 0) break;

    let left = i + 1;
    let right = nums.length - 1;

    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];

      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);

        // SKIP DUPLICATES on both sides after finding a valid triplet
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        left++;
        right--;
      } else if (sum < 0) {
        left++;   // need bigger sum
      } else {
        right--;  // need smaller sum
      }
    }
  }

  return result;
}

console.log("=== 3Sum ===");
console.log("Input: [-1,0,1,2,-1,-4]");
console.log("Output:", JSON.stringify(threeSum([-1, 0, 1, 2, -1, -4])));
// [[-1,-1,2],[-1,0,1]]

console.log("Input: [0,0,0,0]");
console.log("Output:", JSON.stringify(threeSum([0, 0, 0, 0])));
// [[0,0,0]]

console.log("Input: [-2,0,1,1,2]");
console.log("Output:", JSON.stringify(threeSum([-2, 0, 1, 1, 2])));
// [[-2,0,2],[-2,1,1]]
console.log();


// ================================================================
// 3. 🌊 CONTAINER WITH MOST WATER (Opposite Direction)
// LeetCode 11
// ================================================================
// WHAT: Given bars of height[], find two bars that, together
//       with the x-axis, form a container holding the most water.
//
// BRUTE FORCE: Check every pair of bars → O(n²).
//
// TWO-POINTER INSIGHT:
//   Start with the WIDEST container (left=0, right=n-1).
//   Water = width × min(height[left], height[right]).
//
//   Which pointer should move?
//   - Moving the TALLER bar inward can only decrease width
//     without increasing height → water can only decrease.
//   - Moving the SHORTER bar inward decreases width BUT might
//     find a taller bar → water MIGHT increase.
//   → Always move the shorter bar.
//
// WHY DOES THIS FIND THE MAXIMUM?
//   We start with maximum width. The only way to get more water
//   with less width is to find a taller minimum bar. By always
//   moving the shorter side, we never miss a potential improvement.
//   Any pair we skip was proven to hold less water.
//
// REAL-WORLD ANALOGY:
//   Two walls forming a pool. If the left wall is shorter,
//   squeezing the right wall closer can't help (water overflows
//   at the left wall's height). You need a taller left wall.
//
// Time: O(n) | Space: O(1)
// ================================================================
function maxArea(height: number[]): number {
  let left = 0;
  let right = height.length - 1;
  let maxWater = 0;

  while (left < right) {
    const width = right - left;
    const h = Math.min(height[left], height[right]);
    maxWater = Math.max(maxWater, width * h);

    // Move the shorter bar inward — it's the bottleneck
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }

  return maxWater;
}

console.log("=== Container With Most Water ===");
console.log("Input: [1,8,6,2,5,4,8,3,7]");
console.log("Output:", maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7])); // 49

console.log("Input: [1,1]");
console.log("Output:", maxArea([1, 1])); // 1

console.log("Input: [4,3,2,1,4]");
console.log("Output:", maxArea([4, 3, 2, 1, 4])); // 16
console.log();


// ================================================================
// 4. 🧹 REMOVE DUPLICATES IN-PLACE (Same Direction — Fast & Slow)
// LeetCode 26
// ================================================================
// WHAT: Given a SORTED array, remove duplicates in-place and
//       return the new length. Elements beyond that length don't
//       matter.
//
// TWO-POINTER ROLES:
//   - `slow`: Points to the last UNIQUE element found so far.
//             Everything at indices [0..slow] is unique.
//   - `fast`: Scans ahead looking for the next unique element.
//
// HOW:
//   [0, 0, 1, 1, 1, 2, 2, 3, 3, 4]
//    s  f
//    s     f  → 1 ≠ 0, so slow++, write 1 → [0, 1, ...]
//    .  s        f  → still 1, skip
//    .  s           f  → still 1, skip
//    .  s              f  → 2 ≠ 1, slow++, write 2
//    ...etc
//   Result: [0, 1, 2, 3, 4, ...] length = 5
//
// WHY THIS PATTERN?
//   "Slow writes, fast scouts" — fast runs ahead to find new
//   data, slow stays behind to write only the good stuff.
//   This same pattern works for removing specific values,
//   filtering, and partitioning.
//
// Time: O(n) — single pass | Space: O(1) — in-place
// ================================================================
function removeDuplicates(nums: number[]): number {
  if (nums.length === 0) return 0;

  let slow = 0; // last position of a unique element

  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[slow]) {
      slow++;                  // advance the write position
      nums[slow] = nums[fast]; // write the new unique element
    }
    // If equal, fast just moves forward (skips the duplicate)
  }

  return slow + 1; // length of unique portion
}

console.log("=== Remove Duplicates In-Place ===");
const arr1 = [1, 1, 2];
const len1 = removeDuplicates(arr1);
console.log(`Input: [1,1,2] → length=${len1}, array=[${arr1.slice(0, len1)}]`);
// length=2, array=[1,2]

const arr2 = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4];
const len2 = removeDuplicates(arr2);
console.log(
  `Input: [0,0,1,1,1,2,2,3,3,4] → length=${len2}, array=[${arr2.slice(0, len2)}]`
);
// length=5, array=[0,1,2,3,4]
console.log();


// ================================================================
// 5. ✅ VALID PALINDROME (Opposite Direction — LeetCode 125)
// ================================================================
// WHAT: Check if a string is a palindrome, ignoring non-alphanumeric
//       characters and case.
//
// HOW:
//   Two pointers from opposite ends. Skip non-alphanumeric chars.
//   Compare characters (case-insensitive). If any mismatch → false.
//
// EXAMPLE:
//   "A man, a plan, a canal: Panama"
//    ^                            ^
//   Skip ':' and ' ' on right...
//    ^                        ^
//   'A' vs 'a' → match (case-insensitive)
//   Move both inward... continue until pointers meet.
//
// WHY TWO POINTERS?
//   The alternative is to clean the string first (O(n) space),
//   then reverse and compare. Two pointers does it in O(1) space
//   and a single pass — no extra string allocation needed.
//
// Time: O(n) | Space: O(1)
// ================================================================
function isAlphaNumeric(c: string): boolean {
  return /[a-zA-Z0-9]/.test(c);
}

function isPalindrome(s: string): boolean {
  let left = 0;
  let right = s.length - 1;

  while (left < right) {
    // Skip non-alphanumeric characters from both sides
    while (left < right && !isAlphaNumeric(s[left])) left++;
    while (left < right && !isAlphaNumeric(s[right])) right--;

    if (s[left].toLowerCase() !== s[right].toLowerCase()) {
      return false; // mismatch found
    }

    left++;
    right--;
  }

  return true; // all characters matched
}

console.log("=== Valid Palindrome ===");
console.log('"A man, a plan, a canal: Panama" →', isPalindrome("A man, a plan, a canal: Panama")); // true
console.log('"race a car" →', isPalindrome("race a car")); // false
console.log('"racecar" →', isPalindrome("racecar")); // true
console.log('"" →', isPalindrome("")); // true
console.log('" " →', isPalindrome(" ")); // true
console.log();


// ================================================================
// 6. 🔍 IS SUBSEQUENCE (Same Direction, Two Inputs — LeetCode 392)
// ================================================================
// WHAT: Check if string `s` is a subsequence of string `t`.
//       A subsequence keeps relative order but can skip characters.
//       e.g., "ace" is a subsequence of "abcde" (a_c_e).
//
// HOW (Two-Pointer on Two Inputs):
//   - sPtr walks through s (the subsequence candidate).
//   - tPtr walks through t (the full string).
//   - If s[sPtr] === t[tPtr] → match found! Advance sPtr.
//   - Always advance tPtr (we're scanning through t).
//   - If sPtr reaches end of s → all chars matched → true!
//
// WHY THIS WORKS:
//   We greedily match each character of s as early as possible
//   in t. If a character appears later in t, matching it early
//   only helps (leaves more room for subsequent characters).
//
// ANALOGY:
//   Reading a book (t) looking for specific plot points (s).
//   You read page by page. When you find a plot point, check
//   it off and look for the next one. If you check off all
//   plot points by the end → it's a subsequence.
//
// Time: O(n + m) where n = |s|, m = |t| | Space: O(1)
// ================================================================
function isSubsequence(s: string, t: string): boolean {
  let sPtr = 0; // pointer into subsequence
  let tPtr = 0; // pointer into full string

  while (sPtr < s.length && tPtr < t.length) {
    if (s[sPtr] === t[tPtr]) {
      sPtr++; // found a match, advance subsequence pointer
    }
    tPtr++; // always advance through the full string
  }

  return sPtr === s.length; // did we match ALL characters of s?
}

console.log("=== Is Subsequence ===");
console.log('"abc" in "ahbgdc" →', isSubsequence("abc", "ahbgdc")); // true
console.log('"axc" in "ahbgdc" →', isSubsequence("axc", "ahbgdc")); // false
console.log('"" in "ahbgdc" →', isSubsequence("", "ahbgdc")); // true
console.log('"ace" in "abcde" →', isSubsequence("ace", "abcde")); // true
console.log();


// ================================================================
// 7. 🔗 MERGE TWO SORTED ARRAYS IN-PLACE (Two Inputs — LeetCode 88)
// ================================================================
// WHAT: Merge sorted array nums2 into sorted array nums1.
//       nums1 has enough trailing zeros to hold nums2's elements.
//
// WHY MERGE FROM THE END (not the beginning)?
//   If we merge from the start, placing elements at nums1[0]
//   would overwrite elements we haven't processed yet!
//   Merging from the END is safe because the trailing zeros
//   are empty space — no data gets overwritten.
//
// HOW (Three Pointers, Right to Left):
//   - p1: last real element in nums1 (index m-1)
//   - p2: last element in nums2 (index n-1)
//   - write: last position in nums1 (index m+n-1)
//
//   Compare nums1[p1] vs nums2[p2]:
//     - Place the LARGER one at nums1[write]
//     - Decrement the pointer of whichever we placed
//     - Decrement write
//   Continue until p2 < 0 (all of nums2 is placed).
//
// WHY STOP WHEN p2 < 0 (not p1)?
//   If p2 < 0, all of nums2 is merged. Any remaining nums1
//   elements are already in their correct positions (they were
//   sorted and haven't been moved).
//
// Time: O(m + n) | Space: O(1)
// ================================================================
function mergeSortedArrays(
  nums1: number[],
  m: number,
  nums2: number[],
  n: number
): void {
  let p1 = m - 1;     // last real element in nums1
  let p2 = n - 1;     // last element in nums2
  let write = m + n - 1; // write position (from the end)

  while (p2 >= 0) {
    if (p1 >= 0 && nums1[p1] > nums2[p2]) {
      nums1[write] = nums1[p1];
      p1--;
    } else {
      nums1[write] = nums2[p2];
      p2--;
    }
    write--;
  }
}

console.log("=== Merge Two Sorted Arrays ===");
const mergeArr1 = [1, 2, 3, 0, 0, 0];
mergeSortedArrays(mergeArr1, 3, [2, 5, 6], 3);
console.log("Merge [1,2,3] + [2,5,6] →", mergeArr1);
// [1,2,2,3,5,6]

const mergeArr2 = [4, 5, 6, 0, 0, 0];
mergeSortedArrays(mergeArr2, 3, [1, 2, 3], 3);
console.log("Merge [4,5,6] + [1,2,3] →", mergeArr2);
// [1,2,3,4,5,6]

const mergeArr3 = [0];
mergeSortedArrays(mergeArr3, 0, [1], 1);
console.log("Merge [] + [1] →", mergeArr3);
// [1]
console.log();


// ================================================================
// 🌧️ BONUS: TRAPPING RAIN WATER (Opposite Direction — LeetCode 42)
// ================================================================
// WHAT: Given elevation bars, compute how much rainwater is
//       trapped between them after raining.
//
// WHY IS THIS A TWO-POINTER PROBLEM?
//   Water at any position = min(maxLeft, maxRight) - height[i].
//   The brute force computes maxLeft and maxRight for every
//   position → O(n²). Two pointers computes it in one pass.
//
// KEY INSIGHT:
//   We process from the SHORTER side. Why?
//   - If height[left] < height[right], we KNOW that:
//     * leftMax is the real bottleneck (water can't rise above it)
//     * rightMax ≥ height[right] > height[left], so rightMax
//       doesn't matter — leftMax determines the water level.
//   - So we can safely compute water at `left` using only leftMax.
//   - Vice versa for the right side.
//
// ANALOGY:
//   Two walls of a valley. Water pools based on the SHORTER wall.
//   If the left wall is shorter, the water level at the left
//   edge depends only on the left wall height — the right wall
//   is guaranteed to be at least as tall (since we chose the
//   shorter side).
//
// HOW:
//   1. Track leftMax and rightMax as we go.
//   2. Process whichever side has the shorter wall:
//      - If height[left] < height[right]:
//        * Update leftMax
//        * Water at left = leftMax - height[left]
//        * Move left++
//      - Else: same logic for right side
//
// Time: O(n) single pass | Space: O(1)
// ================================================================
function trap(height: number[]): number {
  let left = 0;
  let right = height.length - 1;
  let leftMax = 0;
  let rightMax = 0;
  let water = 0;

  while (left < right) {
    if (height[left] < height[right]) {
      // LEFT side is the bottleneck
      if (height[left] >= leftMax) {
        leftMax = height[left]; // new tallest bar on left
      } else {
        water += leftMax - height[left]; // water trapped here
      }
      left++;
    } else {
      // RIGHT side is the bottleneck
      if (height[right] >= rightMax) {
        rightMax = height[right]; // new tallest bar on right
      } else {
        water += rightMax - height[right]; // water trapped here
      }
      right--;
    }
  }

  return water;
}

console.log("=== Trapping Rain Water ===");
console.log("Input: [0,1,0,2,1,0,1,3,2,1,2,1]");
console.log("Output:", trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1])); // 6

console.log("Input: [4,2,0,3,2,5]");
console.log("Output:", trap([4, 2, 0, 3, 2, 5])); // 9
console.log();


// ================================================================
// 📊 SUMMARY — Two Pointers Pattern Cheat Sheet
// ================================================================
console.log("=".repeat(50));
console.log("📊 Two Pointers Pattern Summary");
console.log("=".repeat(50));
console.log(`
⬅️➡️ Opposite Direction:
   • Two Sum II       — pair sum in sorted array
   • Valid Palindrome  — compare from both ends
   • Container Water   — move shorter line inward
   • Trapping Water    — process shorter side

➡️➡️ Same Direction:
   • Remove Duplicates — slow writes, fast scouts

📚📚 Two Inputs:
   • Is Subsequence    — match chars walking forward
   • Merge Sorted      — compare heads, pick smaller

🔺 Composite:
   • 3Sum              — sort + fix one + two pointers
`);
