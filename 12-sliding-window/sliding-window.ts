export {};

// ================================================================
// 🪟 Chapter 12: SLIDING WINDOW — Runnable Examples
// ================================================================
//
// WHAT IS THE SLIDING WINDOW PATTERN?
// ------------------------------------
// Sliding Window is a technique for efficiently processing
// contiguous subarrays or substrings. Instead of recalculating
// everything from scratch when we move one position forward,
// we incrementally UPDATE the result: add the new element
// entering the window, remove the element leaving it.
//
// REAL-WORLD ANALOGY:
// Imagine sitting on a train, looking out a fixed-size window.
// As the train moves, you don't re-examine all the scenery —
// you just notice what NEW scenery enters the frame on one side
// and what OLD scenery exits on the other.
//
// TWO FLAVORS:
// 1. FIXED WINDOW  — window size k is given; slide it across.
// 2. VARIABLE WINDOW — window grows/shrinks based on a condition
//    (e.g., "no repeating characters", "at most k distinct chars").
//
// WHY USE IT?
// Brute force for subarray problems is often O(n*k) or O(n²).
// Sliding window turns that into O(n). Huge win!
//
// HOW TO RUN:
//   bun run sliding-window.ts
// ================================================================


// ────────────────────────────────────────────────────────────
// 1️⃣  FIXED WINDOW: Maximum Sum of K Consecutive Elements
// ────────────────────────────────────────────────────────────
//
// WHAT:  Given an array of numbers and an integer k, find the
//        maximum sum among all contiguous subarrays of size k.
//
// WHY THIS APPROACH:
//   Brute force: for each starting index, sum k elements → O(n*k).
//   Sliding window: maintain a running sum. When the window is
//   full (right >= k-1), record the sum, then SUBTRACT the element
//   that's about to leave the window (the leftmost element).
//   This gives us O(n) — each element is added and removed exactly once.
//
// HOW (step-by-step):
//   1. Expand: add arr[right] to windowSum.
//   2. Once right >= k-1 (window is full):
//      a. Compare windowSum with maxSum, update if larger.
//      b. Shrink: subtract arr[right - k + 1] (the element leaving).
//   3. Move right forward; repeat.
//
// COMPLEXITY:
//   Time:  O(n) — single pass through the array
//   Space: O(1) — only a few variables
//
// REAL-WORLD ANALOGY:
//   You're computing a 7-day moving average of stock prices.
//   Each day you add the new price and drop the price from 7 days ago.
// ────────────────────────────────────────────────────────────

function maxSumSubarrayOfSizeK(arr: number[], k: number): number {
  const n = arr.length;
  if (n < k) return -1;

  let windowSum = 0;
  let maxSum = -Infinity;

  for (let right = 0; right < n; right++) {
    // EXPAND: include the new element on the right
    windowSum += arr[right];

    // Once the window has reached size k...
    if (right >= k - 1) {
      console.log(
        `  Window [${arr.slice(right - k + 1, right + 1).join(", ")}] → sum = ${windowSum}` +
          (windowSum > maxSum ? " ✅ new max!" : "")
      );
      maxSum = Math.max(maxSum, windowSum);

      // SHRINK: remove the element that's leaving (leftmost in window)
      windowSum -= arr[right - k + 1];
    }
  }

  return maxSum;
}

console.log("═══════════════════════════════════════════════════════");
console.log("1️⃣  Fixed Window: Max Sum of K=3 Consecutive Elements");
console.log("═══════════════════════════════════════════════════════");
const arr1 = [2, 1, 5, 1, 3, 2];
console.log(`Input: [${arr1.join(", ")}], k = 3\n`);
const result1 = maxSumSubarrayOfSizeK(arr1, 3);
console.log(`\n🎯 Maximum sum = ${result1}\n`);


// ────────────────────────────────────────────────────────────
// 2️⃣  VARIABLE WINDOW: Longest Substring Without Repeating
// ────────────────────────────────────────────────────────────
//
// WHAT:  Given a string, find the length of the longest substring
//        that contains NO repeating characters.
//        Example: "abcabcbb" → "abc" → length 3.
//
// WHY THIS APPROACH:
//   We need a window that grows when characters are unique and
//   contracts when a duplicate appears. A HashMap tracks the
//   last-seen index of each character so we can jump `left`
//   directly past the previous occurrence — no need to shrink
//   one position at a time.
//
// HOW (step-by-step):
//   1. Move `right` forward one character at a time.
//   2. If the character was already seen AND its last position
//      is >= left (meaning it's inside our current window):
//      → Jump left to lastSeen[char] + 1 (skip past the duplicate).
//   3. Update lastSeen[char] = right.
//   4. Update maxLen if the current window is bigger.
//
// COMPLEXITY:
//   Time:  O(n) — each character visited at most twice (by left & right)
//   Space: O(min(n, alphabet_size)) — the HashMap
//
// REAL-WORLD ANALOGY:
//   You're typing on a keyboard that rejects duplicate keys until
//   you release (un-press) the earlier duplicate. As soon as a
//   conflict is found, you "release" everything up to and including
//   the first occurrence, then keep typing.
// ────────────────────────────────────────────────────────────

function lengthOfLongestSubstring(s: string): number {
  const lastSeen = new Map<string, number>();
  let left = 0;
  let maxLen = 0;
  let bestStart = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];

    if (lastSeen.has(char) && lastSeen.get(char)! >= left) {
      // Duplicate found INSIDE the current window — shrink from the left
      const oldLeft = left;
      left = lastSeen.get(char)! + 1;
      console.log(
        `  right=${right} char='${char}' → duplicate! ` +
          `left jumps ${oldLeft}→${left}  ` +
          `window: "${s.slice(left, right + 1)}"`
      );
    } else {
      // No conflict — just expand the window
      console.log(
        `  right=${right} char='${char}' → expand    ` +
          `window: "${s.slice(left, right + 1)}" (len ${right - left + 1})`
      );
    }

    lastSeen.set(char, right);
    if (right - left + 1 > maxLen) {
      maxLen = right - left + 1;
      bestStart = left;
    }
  }

  console.log(`\n  Best window: "${s.slice(bestStart, bestStart + maxLen)}"`);
  return maxLen;
}

console.log("═══════════════════════════════════════════════════════");
console.log("2️⃣  Variable Window: Longest Substring Without Repeating");
console.log("═══════════════════════════════════════════════════════");
const s2 = "abcabcbb";
console.log(`Input: "${s2}"\n`);
const result2 = lengthOfLongestSubstring(s2);
console.log(`🎯 Length = ${result2}\n`);


// ────────────────────────────────────────────────────────────
// 3️⃣  MINIMUM WINDOW SUBSTRING (with step-by-step logging)
// ────────────────────────────────────────────────────────────
//
// WHAT:  Given strings s and t, find the smallest substring of s
//        that contains ALL characters of t (including duplicates).
//        LeetCode 76 — a classic "hard" sliding window problem.
//        Example: s="ADOBECODEBANC", t="ABC" → "BANC"
//
// WHY THIS APPROACH:
//   We need a window that:
//   • EXPANDS (right moves) to include more characters until
//     the window satisfies the condition (contains all of t).
//   • CONTRACTS (left moves) to find the smallest valid window.
//   Two frequency maps — `need` (what t requires) and
//   `windowCounts` (what we currently have) — let us track
//   satisfaction efficiently. A counter `have` tracks how many
//   unique characters are fully satisfied.
//
// HOW (step-by-step):
//   1. Build `need` map from t (e.g., {A:1, B:1, C:1}).
//   2. Slide `right` across s. For each char, update windowCounts.
//   3. When windowCounts[char] reaches need[char], increment `have`.
//   4. Once have == required (all chars satisfied):
//      a. Record window if it's smaller than best so far.
//      b. Shrink from the left: decrement windowCounts[leftChar].
//         If it drops below need[leftChar], decrement `have`.
//      c. Move left++, repeat shrinking while still valid.
//   5. Return the smallest window found.
//
// COMPLEXITY:
//   Time:  O(|s| + |t|) — each pointer moves at most |s| times
//   Space: O(|s| + |t|) — for the frequency maps
//
// REAL-WORLD ANALOGY:
//   You're searching a bookshelf (s) for the shortest contiguous
//   span of books that covers a required reading list (t). You
//   expand your scan until all titles are found, then try to
//   narrow the span from the left.
// ────────────────────────────────────────────────────────────

function minWindow(s: string, t: string): string {
  if (t.length > s.length) return "";

  // Step 1: Build frequency map of what we NEED from string t
  const need = new Map<string, number>();
  for (const c of t) {
    need.set(c, (need.get(c) || 0) + 1);
  }

  const windowCounts = new Map<string, number>();
  let have = 0;              // how many unique chars are fully satisfied
  const required = need.size; // how many unique chars we must satisfy
  let left = 0;
  let minLen = Infinity;
  let minStart = 0;

  console.log(`  Need: {${[...need.entries()].map(([k, v]) => `${k}:${v}`).join(", ")}}`);
  console.log(`  Required unique chars matched: ${required}\n`);

  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    windowCounts.set(char, (windowCounts.get(char) || 0) + 1);

    // Check if this character's count now meets the requirement
    if (need.has(char) && windowCounts.get(char) === need.get(char)) {
      have++;
    }

    // CONTRACT: while the window is valid, try to shrink it
    let shrunk = false;
    while (have === required) {
      const windowLen = right - left + 1;
      const windowStr = s.slice(left, right + 1);

      if (windowLen < minLen) {
        minLen = windowLen;
        minStart = left;
        console.log(
          `  ✅ VALID window [${left}..${right}]: "${windowStr}" len=${windowLen} → new best!`
        );
      } else if (!shrunk) {
        console.log(
          `  ✅ VALID window [${left}..${right}]: "${windowStr}" len=${windowLen}`
        );
      }

      shrunk = true;
      const leftChar = s[left];
      windowCounts.set(leftChar, windowCounts.get(leftChar)! - 1);
      if (need.has(leftChar) && windowCounts.get(leftChar)! < need.get(leftChar)!) {
        have--;
        console.log(`     ↩️  shrink left: removed '${leftChar}', now invalid`);
      }
      left++;
    }

    if (!shrunk) {
      console.log(
        `  right=${right} '${char}' → have=${have}/${required} (not yet valid)`
      );
    }
  }

  return minLen === Infinity ? "" : s.slice(minStart, minStart + minLen);
}

console.log("═══════════════════════════════════════════════════════");
console.log("3️⃣  Minimum Window Substring");
console.log("═══════════════════════════════════════════════════════");
const s3 = "ADOBECODEBANC";
const t3 = "ABC";
console.log(`Input: s="${s3}", t="${t3}"\n`);
const result3 = minWindow(s3, t3);
console.log(`\n🎯 Minimum window: "${result3}"\n`);


// ────────────────────────────────────────────────────────────
// 4️⃣  FIND ALL ANAGRAMS IN A STRING
// ────────────────────────────────────────────────────────────
//
// WHAT:  Given strings s and p, find ALL start indices of p's
//        anagrams in s. An anagram is a permutation, so
//        "abc", "bca", "cab" are all anagrams of each other.
//        Example: s="cbaebabacd", p="abc" → [0, 6]
//
// WHY THIS APPROACH:
//   Instead of sorting every window (O(n*k*log k)), we use a
//   FIXED-SIZE sliding window of length p.length and maintain
//   two frequency arrays (26 slots for a-z). We also track a
//   `matches` counter: the number of character slots where the
//   window's frequency equals p's frequency. When matches == 26,
//   every character count lines up → we found an anagram.
//
// HOW (step-by-step):
//   1. Build pCount[26] from p and sCount[26] from s[0..p.length-1].
//   2. Count initial matches (how many of the 26 slots are equal).
//   3. Slide the window one position at a time:
//      a. Add s[right]: increment sCount[rIdx].
//         - If it now equals pCount → matches++
//         - If it just exceeded pCount (was equal, now +1) → matches--
//      b. Remove s[windowStart]: decrement sCount[lIdx].
//         - If it now equals pCount → matches++
//         - If it just dropped below (was equal, now -1) → matches--
//      c. If matches == 26 → record the start index.
//
// COMPLEXITY:
//   Time:  O(n) — one pass, constant work per step
//   Space: O(1) — two fixed 26-element arrays
//
// KEY INSIGHT:
//   Tracking "matches" (26 slots that are equal) avoids comparing
//   entire frequency arrays on every step. Each slide only affects
//   at most 2 slots, so updates are O(1).
// ────────────────────────────────────────────────────────────

function findAnagrams(s: string, p: string): number[] {
  if (p.length > s.length) return [];

  const result: number[] = [];
  const pCount = new Array(26).fill(0);
  const sCount = new Array(26).fill(0);

  const idx = (c: string) => c.charCodeAt(0) - "a".charCodeAt(0);

  // Initialize frequency counts for the first window
  for (let i = 0; i < p.length; i++) {
    pCount[idx(p[i])]++;
    sCount[idx(s[i])]++;
  }

  // Count how many of the 26 character slots already match
  let matches = 0;
  for (let i = 0; i < 26; i++) {
    if (sCount[i] === pCount[i]) matches++;
  }

  for (let right = p.length; right < s.length; right++) {
    const windowStart = right - p.length;
    const windowStr = s.slice(windowStart, right);

    if (matches === 26) {
      result.push(windowStart);
      console.log(
        `  ✅ Anagram found at index ${windowStart}: "${windowStr}"`
      );
    } else {
      console.log(
        `  Window [${windowStart}..${right - 1}]: "${windowStr}" — matches=${matches}/26`
      );
    }

    // ADD the new character entering on the right
    const rIdx = idx(s[right]);
    sCount[rIdx]++;
    if (sCount[rIdx] === pCount[rIdx]) matches++;
    else if (sCount[rIdx] === pCount[rIdx] + 1) matches--;

    // REMOVE the character leaving on the left
    const lIdx = idx(s[windowStart]);
    sCount[lIdx]--;
    if (sCount[lIdx] === pCount[lIdx]) matches++;
    else if (sCount[lIdx] === pCount[lIdx] - 1) matches--;
  }

  // Check the final window position
  if (matches === 26) {
    const lastStart = s.length - p.length;
    result.push(lastStart);
    console.log(
      `  ✅ Anagram found at index ${lastStart}: "${s.slice(lastStart)}"`
    );
  }

  return result;
}

console.log("═══════════════════════════════════════════════════════");
console.log("4️⃣  Find All Anagrams in a String");
console.log("═══════════════════════════════════════════════════════");
const s4 = "cbaebabacd";
const p4 = "abc";
console.log(`Input: s="${s4}", p="${p4}"\n`);
const result4 = findAnagrams(s4, p4);
console.log(`\n🎯 Anagram indices: [${result4.join(", ")}]\n`);


// ────────────────────────────────────────────────────────────
// 5️⃣  LONGEST SUBSTRING WITH AT MOST K DISTINCT CHARACTERS
// ────────────────────────────────────────────────────────────
//
// WHAT:  Given a string s and an integer k, find the length of
//        the longest substring with at most k distinct characters.
//        Example: s="eceba", k=2 → "ece" → length 3.
//
// WHY THIS APPROACH:
//   Classic VARIABLE-SIZE sliding window. The window is valid
//   as long as the number of distinct characters (freq.size)
//   is ≤ k. When it exceeds k, we shrink from the left until
//   we're back within bounds.
//
// HOW (step-by-step):
//   1. Maintain a frequency map `freq` for characters in the window.
//   2. Expand: move `right` forward, add s[right] to freq.
//   3. If freq.size > k (too many distinct characters):
//      a. Shrink: decrement freq[s[left]], remove if zero, move left++.
//      b. Repeat until freq.size <= k.
//   4. Update maxLen with the current window length.
//
// COMPLEXITY:
//   Time:  O(n) — each character is added/removed at most once
//   Space: O(k) — the frequency map holds at most k+1 entries
//
// REAL-WORLD ANALOGY:
//   You're DJing a party and want to find the longest set where
//   you play songs from at most k genres. When a new genre pushes
//   you over the limit, you drop the earliest songs until you're
//   back to k genres.
// ────────────────────────────────────────────────────────────

function longestSubstringKDistinct(s: string, k: number): number {
  const freq = new Map<string, number>();
  let left = 0;
  let maxLen = 0;
  let bestStart = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    freq.set(char, (freq.get(char) || 0) + 1);

    // SHRINK: if we have more than k distinct characters, contract from left
    while (freq.size > k) {
      const leftChar = s[left];
      freq.set(leftChar, freq.get(leftChar)! - 1);
      if (freq.get(leftChar) === 0) freq.delete(leftChar);
      left++;
    }

    const windowLen = right - left + 1;
    const distinct = [...freq.keys()].join(",");
    console.log(
      `  right=${right} '${char}' → window: "${s.slice(left, right + 1)}" ` +
        `(len=${windowLen}, distinct={${distinct}})` +
        (windowLen > maxLen ? " ✅ new best!" : "")
    );

    if (windowLen > maxLen) {
      maxLen = windowLen;
      bestStart = left;
    }
  }

  console.log(`\n  Best window: "${s.slice(bestStart, bestStart + maxLen)}"`);
  return maxLen;
}

console.log("═══════════════════════════════════════════════════════");
console.log("5️⃣  Longest Substring with At Most K Distinct Characters");
console.log("═══════════════════════════════════════════════════════");
const s5 = "eceba";
const k5 = 2;
console.log(`Input: s="${s5}", k=${k5}\n`);
const result5 = longestSubstringKDistinct(s5, k5);
console.log(`🎯 Length = ${result5}\n`);

console.log("═══════════════════════════════════════════════════════");
console.log("5️⃣b  Another example: s='araaci', k=2");
console.log("═══════════════════════════════════════════════════════\n");
const result5b = longestSubstringKDistinct("araaci", 2);
console.log(`🎯 Length = ${result5b}\n`);


// ────────────────────────────────────────────────────────────
// 📊 Summary
// ────────────────────────────────────────────────────────────
//
// SLIDING WINDOW CHEAT SHEET:
// ┌────────────────────────────┬──────────────┬──────────────┐
// │ Problem Type               │ Window Type  │ Key Trick    │
// ├────────────────────────────┼──────────────┼──────────────┤
// │ Max sum of k elements      │ Fixed        │ Running sum  │
// │ Longest no-repeat substr   │ Variable     │ lastSeen map │
// │ Min window substring       │ Variable     │ have/need    │
// │ Find all anagrams          │ Fixed        │ 26-slot freq │
// │ At most K distinct         │ Variable     │ freq.size    │
// └────────────────────────────┴──────────────┴──────────────┘
//
// PATTERN RECOGNITION:
//   Ask yourself: "Am I processing contiguous subarrays/substrings
//   and can I UPDATE the result incrementally as I slide?"
//   If yes → Sliding Window.
// ────────────────────────────────────────────────────────────

console.log("═══════════════════════════════════════════════════════");
console.log("📊 Summary of Results");
console.log("═══════════════════════════════════════════════════════");
console.log(`  1. Max sum of k=3 consecutive:         ${result1}`);
console.log(`  2. Longest substring no repeats:        ${result2}`);
console.log(`  3. Min window substring:                "${result3}"`);
console.log(`  4. All anagram indices:                 [${result4.join(", ")}]`);
console.log(`  5. Longest substr ≤2 distinct ("eceba"):${result5}`);
