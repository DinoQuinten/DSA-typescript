export {};

// ================================================================
// 🗺️ CHAPTER 4: HASH MAPS & HASH SETS — Runnable Examples
// ================================================================
// Run: bun run hash-maps-and-sets.ts
//
// Hash-based data structures are the single most important tool
// for turning O(n) lookups into O(1) lookups. If you learn one
// optimization pattern, make it this: "Can I trade space for time
// by remembering what I've already seen?"
//
// This file covers:
//   1. Building a Hash Map from scratch (chaining strategy)
//   2. Two Sum — the canonical brute-vs-hash comparison
//   3. Frequency Counter — counting occurrences in one pass
//   4. Group Anagrams — grouping by a computed key
//   5. Duplicate Detection with Sets
//   6. Longest Consecutive Sequence — O(n) with a Set
// ================================================================


// ================================================================
// 1️⃣  SIMPLE HASH MAP FROM SCRATCH (Separate Chaining)
// ================================================================
// WHAT: A hash map that maps keys to values with ~O(1) access.
//
// WHY build one from scratch? To understand what's happening
// "under the hood" of Map, dict, HashMap, etc. in every language.
//
// HOW it works:
//   1. An internal array of "buckets" holds the data.
//   2. To store a (key, value) pair, we run the key through a
//      hash function, which converts it to a bucket index.
//   3. If two keys hash to the same index (a "collision"), we
//      store both entries in a linked list at that bucket.
//      This is called "separate chaining."
//   4. When the table gets too full (load factor > 0.75), we
//      double the number of buckets and re-hash everything.
//      This keeps chains short and preserves O(1) performance.
//
// REAL-WORLD ANALOGY:
//   Imagine a library with 16 shelves. Each book's title is
//   hashed to a shelf number. You go directly to that shelf
//   instead of scanning every shelf. If a shelf gets too full,
//   the library adds more shelves and redistributes the books.
//
// COMPLEXITY:
//   set / get / has / delete — O(1) amortized, O(n) worst case
//   rehash — O(n) but amortized over many insertions
//   Space — O(n)
// ================================================================

class SimpleHashMap<K, V> {
  private buckets: Array<Array<[K, V]>>;
  private _size: number = 0;
  private capacity: number;
  private readonly LOAD_FACTOR_THRESHOLD = 0.75;

  constructor(capacity: number = 16) {
    this.capacity = capacity;
    this.buckets = new Array(capacity).fill(null).map(() => []);
  }

  // ──────────────────────────────────────────────────────────────
  // HASH FUNCTION
  // ──────────────────────────────────────────────────────────────
  // Converts any key to an integer index within [0, capacity).
  //
  // HOW: We use the classic "polynomial rolling hash" —
  //   hash = (hash * 31 + charCode) for each character.
  //   The multiplier 31 is a small prime that distributes
  //   values well and allows the JIT to optimize (31 = 32-1).
  //   The `| 0` forces 32-bit integer arithmetic to avoid
  //   floating-point drift on large strings.
  //
  // WHY modulo capacity? The hash can be huge; modulo maps it
  //   into a valid bucket index. Math.abs handles negative hashes.
  // ──────────────────────────────────────────────────────────────
  private hash(key: K): number {
    const str = String(key);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 31 + str.charCodeAt(i)) | 0;
    }
    return Math.abs(hash) % this.capacity;
  }

  // ──────────────────────────────────────────────────────────────
  // SET (insert or update)
  // ──────────────────────────────────────────────────────────────
  // 1. Hash the key → bucket index.
  // 2. Walk the chain at that bucket looking for an existing key.
  //    - Found? Update the value in-place (no duplicates).
  //    - Not found? Append a new [key, value] pair to the chain.
  // 3. After insertion, check if load factor exceeds threshold.
  //    If so, trigger a rehash to keep operations fast.
  // ──────────────────────────────────────────────────────────────
  set(key: K, value: V): void {
    const index = this.hash(key);
    const bucket = this.buckets[index];

    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        bucket[i][1] = value;
        return;
      }
    }

    bucket.push([key, value]);
    this._size++;

    if (this._size / this.capacity > this.LOAD_FACTOR_THRESHOLD) {
      this.rehash();
    }
  }

  // ──────────────────────────────────────────────────────────────
  // GET (lookup by key)
  // ──────────────────────────────────────────────────────────────
  // Hash the key → go to that bucket → scan the chain for a
  // matching key. Average chain length is ~1 if load factor < 0.75,
  // so this is effectively O(1).
  // ──────────────────────────────────────────────────────────────
  get(key: K): V | undefined {
    const index = this.hash(key);
    const bucket = this.buckets[index];

    for (const [k, v] of bucket) {
      if (k === key) return v;
    }
    return undefined;
  }

  has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  // ──────────────────────────────────────────────────────────────
  // DELETE
  // ──────────────────────────────────────────────────────────────
  // Hash → find bucket → linear scan the chain → splice out the
  // matching entry. Returns true if something was removed.
  // ──────────────────────────────────────────────────────────────
  delete(key: K): boolean {
    const index = this.hash(key);
    const bucket = this.buckets[index];

    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        bucket.splice(i, 1);
        this._size--;
        return true;
      }
    }
    return false;
  }

  get size(): number {
    return this._size;
  }

  // ──────────────────────────────────────────────────────────────
  // REHASH — dynamic resizing
  // ──────────────────────────────────────────────────────────────
  // WHY: As the table fills up, chains grow longer and O(1)
  // degrades toward O(n). Doubling the capacity and re-inserting
  // every entry keeps the average chain length near 1.
  //
  // HOW: Save old buckets → double capacity → create fresh
  // empty buckets → re-insert every (key, value) pair. Each pair
  // may land in a different bucket now because capacity changed.
  //
  // COST: O(n), but it's amortized — you only rehash after n/2
  // insertions (if load factor threshold is 0.75 and you double).
  // ──────────────────────────────────────────────────────────────
  private rehash(): void {
    const oldBuckets = this.buckets;
    this.capacity *= 2;
    this.buckets = new Array(this.capacity).fill(null).map(() => []);
    this._size = 0;

    for (const bucket of oldBuckets) {
      for (const [key, value] of bucket) {
        this.set(key, value);
      }
    }
  }

  display(): void {
    console.log(`\n  Size: ${this._size}, Capacity: ${this.capacity}`);
    for (let i = 0; i < this.capacity; i++) {
      if (this.buckets[i].length > 0) {
        const entries = this.buckets[i]
          .map(([k, v]) => `(${k} → ${v})`)
          .join(" → ");
        console.log(`  Bucket ${i}: ${entries}`);
      }
    }
  }
}

// ================================================================
// DEMO: Custom Hash Map
// ================================================================

console.log("═══════════════════════════════════════");
console.log("1️⃣  Custom Hash Map (Chaining)");
console.log("═══════════════════════════════════════");

const myMap = new SimpleHashMap<string, number>(4);
myMap.set("apple", 5);
myMap.set("banana", 3);
myMap.set("cherry", 7);
myMap.set("date", 2);
myMap.set("elderberry", 9);

console.log("\nAfter inserting 5 items into capacity-4 map:");
myMap.display();

console.log(`\n  get("apple") = ${myMap.get("apple")}`);
console.log(`  get("banana") = ${myMap.get("banana")}`);
console.log(`  has("cherry") = ${myMap.has("cherry")}`);
console.log(`  has("fig") = ${myMap.has("fig")}`);

myMap.set("apple", 99);
console.log(`\n  After update: get("apple") = ${myMap.get("apple")}`);

myMap.delete("banana");
console.log(`  After delete: has("banana") = ${myMap.has("banana")}`);
console.log(`  Size: ${myMap.size}`);


// ================================================================
// 2️⃣  TWO SUM — Brute Force vs Hash Map
// ================================================================
// WHAT: Given an array of numbers and a target, find two numbers
//   that add up to the target. Return their indices.
//
// WHY THIS PROBLEM MATTERS:
//   It's the #1 most asked interview question. More importantly,
//   it perfectly demonstrates the "lookup table" optimization
//   that hash maps enable.
//
// BRUTE FORCE APPROACH — O(n²):
//   Try every pair (i, j). For each element, check every other
//   element. This is like searching for a friend in a crowd by
//   tapping every single person on the shoulder.
//
// HASH MAP APPROACH — O(n):
//   For each element, compute what its "complement" would be
//   (target - current). Check if we've already SEEN that
//   complement. If yes, we found our pair. If no, store the
//   current element for future lookups.
//
//   Think of it like this: instead of asking everyone in the room,
//   you write your name on a whiteboard. When someone new arrives,
//   they check the whiteboard first. Instant match!
//
// COMPLEXITY:
//   Brute: O(n²) time, O(1) space
//   Hash:  O(n) time,  O(n) space  ← classic time-space tradeoff
// ================================================================

console.log("\n═══════════════════════════════════════");
console.log("2️⃣  Two Sum — Brute Force vs Hash Map");
console.log("═══════════════════════════════════════");

function twoSumBrute(nums: number[], target: number): number[] {
  let comparisons = 0;
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      comparisons++;
      if (nums[i] + nums[j] === target) {
        console.log(`  Brute Force: Found [${i}, ${j}] after ${comparisons} comparisons`);
        return [i, j];
      }
    }
  }
  return [];
}

function twoSumHashMap(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  let lookups = 0;

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    lookups++;
    if (map.has(complement)) {
      console.log(`  Hash Map:    Found [${map.get(complement)!}, ${i}] after ${lookups} lookups`);
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }
  return [];
}

const nums = [2, 7, 11, 15, 3, 6, 8, 1, 4, 9];
const target = 13;
console.log(`\n  nums = [${nums}], target = ${target}\n`);

twoSumBrute(nums, target);
twoSumHashMap(nums, target);

const bigNums = Array.from({ length: 1000 }, (_, i) => i);
const bigTarget = 1997;
console.log(`\n  Large array (1000 elements), target = ${bigTarget}\n`);

const bruteStart = performance.now();
twoSumBrute(bigNums, bigTarget);
const bruteTime = performance.now() - bruteStart;

const hashStart = performance.now();
twoSumHashMap(bigNums, bigTarget);
const hashTime = performance.now() - hashStart;

console.log(`\n  Brute force time: ${bruteTime.toFixed(3)}ms`);
console.log(`  Hash map time:    ${hashTime.toFixed(3)}ms`);
console.log(`  Speedup:          ${(bruteTime / hashTime).toFixed(1)}x faster`);


// ================================================================
// 3️⃣  FREQUENCY COUNTER
// ================================================================
// WHAT: Count how many times each element appears in an array.
//
// WHY: Frequency counting is a fundamental pattern that appears
//   in dozens of problems: anagram detection, finding modes,
//   checking permutations, histogram building, etc.
//
// HOW:
//   Walk through the array once. For each element, look it up in
//   the map. If it's there, increment. If not, set count to 1.
//   The `?? 0` (nullish coalescing) handles the "not found" case.
//
// REAL-WORLD ANALOGY:
//   Like a tally counter at a polling station. Every time a
//   candidate's name appears, you add one tick mark. One pass
//   through the ballots gives you the full count.
//
// COMPLEXITY: O(n) time, O(k) space where k = unique elements
// ================================================================

console.log("\n═══════════════════════════════════════");
console.log("3️⃣  Frequency Counter");
console.log("═══════════════════════════════════════");

function frequencyCounter<T>(arr: T[]): Map<T, number> {
  const freq = new Map<T, number>();
  for (const item of arr) {
    freq.set(item, (freq.get(item) ?? 0) + 1);
  }
  return freq;
}

// ──────────────────────────────────────────────────────────────
// ANAGRAM CHECK using frequency counting
// ──────────────────────────────────────────────────────────────
// WHAT: Two strings are anagrams if they contain exactly the
//   same characters with the same frequencies.
//
// HOW: Build a frequency map from string `s`. Then for each
//   character in string `t`, decrement the count. If any count
//   goes below zero or a character is missing, they're not
//   anagrams. This avoids sorting (O(n log n)) and instead
//   runs in O(n) time.
// ──────────────────────────────────────────────────────────────
function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false;

  const freq = new Map<string, number>();
  for (const char of s) freq.set(char, (freq.get(char) ?? 0) + 1);
  for (const char of t) {
    const count = freq.get(char);
    if (!count) return false;
    freq.set(char, count - 1);
  }
  return true;
}

const fruits = ["apple", "banana", "apple", "cherry", "banana", "apple"];
const fruitFreq = frequencyCounter(fruits);
console.log("\n  Frequency of fruits:");
fruitFreq.forEach((count, fruit) => {
  console.log(`    ${fruit}: ${"🍎".repeat(count)} (${count})`);
});

const numbers = [1, 2, 3, 2, 1, 3, 3, 4, 5, 4];
const numFreq = frequencyCounter(numbers);
console.log("\n  Frequency of numbers:");
numFreq.forEach((count, num) => {
  console.log(`    ${num}: ${"█".repeat(count)} ${count}`);
});

console.log("\n  Anagram checks:");
console.log(`    "anagram" vs "nagaram": ${isAnagram("anagram", "nagaram")}`);
console.log(`    "rat" vs "car":         ${isAnagram("rat", "car")}`);
console.log(`    "listen" vs "silent":   ${isAnagram("listen", "silent")}`);
console.log(`    "hello" vs "world":     ${isAnagram("hello", "world")}`);


// ================================================================
// 4️⃣  GROUP ANAGRAMS
// ================================================================
// WHAT: Given a list of strings, group all anagrams together.
//   e.g. ["eat","tea","ate"] → same group (all rearrangements).
//
// WHY: This demonstrates the "computed key" pattern — using a
//   hash map where the KEY is derived by transforming the input.
//
// HOW:
//   1. For each word, sort its characters alphabetically.
//      "eat" → "aet", "tea" → "aet", "bat" → "abt"
//   2. Use the sorted string as a map key.
//   3. All words that produce the same sorted key are anagrams.
//
// COMPLEXITY:
//   O(n * k log k) where n = number of words, k = max word length.
//   The k log k comes from sorting each word's characters.
//   An O(n * k) solution exists using character-count keys instead.
// ================================================================

console.log("\n═══════════════════════════════════════");
console.log("4️⃣  Group Anagrams");
console.log("═══════════════════════════════════════");

function groupAnagrams(strs: string[]): string[][] {
  const groups = new Map<string, string[]>();

  for (const str of strs) {
    const key = str.split("").sort().join("");
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(str);
  }

  return [...groups.values()];
}

const words = ["eat", "tea", "tan", "ate", "nat", "bat"];
console.log(`\n  Input: [${words.map((w) => `"${w}"`).join(", ")}]`);
console.log("  Groups:");

const groups = groupAnagrams(words);
groups.forEach((group, index) => {
  const sortedKey = group[0].split("").sort().join("");
  console.log(`    Key "${sortedKey}": [${group.map((w) => `"${w}"`).join(", ")}]`);
});

const moreWords = ["listen", "silent", "enlist", "hello", "world", "tinsel"];
console.log(`\n  Input: [${moreWords.map((w) => `"${w}"`).join(", ")}]`);
console.log("  Groups:");

groupAnagrams(moreWords).forEach((group) => {
  console.log(`    [${group.map((w) => `"${w}"`).join(", ")}]`);
});


// ================================================================
// 5️⃣  DETECT DUPLICATES WITH SET
// ================================================================
// WHAT: A Set stores unique values. We use it to check whether
//   we've seen something before — in O(1) per check.
//
// WHY Sets instead of arrays for "have I seen this?":
//   Array.includes() is O(n) — it scans every element.
//   Set.has() is O(1) — it uses hashing internally.
//   For n elements, that's O(n²) vs O(n) total.
//
// REAL-WORLD ANALOGY:
//   A bouncer at a club with a guest list. When someone arrives,
//   the bouncer doesn't read the entire list top-to-bottom.
//   Instead, names are in a hash set — instant lookup.
//
// COMPLEXITY: O(n) time, O(n) space for all three functions
// ================================================================

console.log("\n═══════════════════════════════════════");
console.log("5️⃣  Detect Duplicates with Set");
console.log("═══════════════════════════════════════");

// ──────────────────────────────────────────────────────────────
// containsDuplicate: Returns true as soon as ANY duplicate found.
// Early exit makes this very fast in practice.
// ──────────────────────────────────────────────────────────────
function containsDuplicate(nums: number[]): boolean {
  const seen = new Set<number>();
  for (const num of nums) {
    if (seen.has(num)) return true;
    seen.add(num);
  }
  return false;
}

// ──────────────────────────────────────────────────────────────
// findDuplicates: Collects ALL values that appear more than once.
// Uses two sets: "seen" tracks first occurrence, "duplicates"
// tracks values we've seen at least twice.
// ──────────────────────────────────────────────────────────────
function findDuplicates(nums: number[]): number[] {
  const seen = new Set<number>();
  const duplicates = new Set<number>();
  for (const num of nums) {
    if (seen.has(num)) duplicates.add(num);
    else seen.add(num);
  }
  return [...duplicates];
}

// ──────────────────────────────────────────────────────────────
// removeDuplicates: The classic one-liner. Spreading a Set back
// into an array removes all duplicates while preserving order.
// ──────────────────────────────────────────────────────────────
function removeDuplicates<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

const arr1 = [1, 2, 3, 1];
const arr2 = [1, 2, 3, 4];
const arr3 = [1, 1, 1, 3, 3, 4, 3, 2, 4, 2];

console.log(`\n  [${arr1}] contains duplicate? ${containsDuplicate(arr1)}`);
console.log(`  [${arr2}] contains duplicate? ${containsDuplicate(arr2)}`);

console.log(`\n  Duplicates in [${arr3}]: [${findDuplicates(arr3)}]`);
console.log(`  Deduplicated [${arr3}]: [${removeDuplicates(arr3)}]`);

// ──────────────────────────────────────────────────────────────
// SET OPERATIONS: Intersection, Union, Difference
// ──────────────────────────────────────────────────────────────
// These are mathematical set operations, commonly needed in
// data processing, database logic, and permission systems.
//
// Intersection (A ∩ B): elements in BOTH sets
// Union (A ∪ B):        elements in EITHER set
// Difference (A \ B):   elements in A but NOT in B
// ──────────────────────────────────────────────────────────────
console.log("\n  Set operations demo:");
const setA = new Set([1, 2, 3, 4, 5]);
const setB = new Set([4, 5, 6, 7, 8]);

const intersection = [...setA].filter((x) => setB.has(x));
const union = [...new Set([...setA, ...setB])];
const difference = [...setA].filter((x) => !setB.has(x));

console.log(`    Set A:          {${[...setA]}}`);
console.log(`    Set B:          {${[...setB]}}`);
console.log(`    Intersection:   {${intersection}}`);
console.log(`    Union:          {${union}}`);
console.log(`    Difference A-B: {${difference}}`);


// ================================================================
// 6️⃣  BONUS: LONGEST CONSECUTIVE SEQUENCE (Set Power!)
// ================================================================
// WHAT: Given an unsorted array of integers, find the length of
//   the longest consecutive elements sequence.
//   e.g. [100, 4, 200, 1, 3, 2] → longest is [1, 2, 3, 4] → 4
//
// WHY THIS IS CLEVER:
//   Sorting would give O(n log n). But we can do O(n) with a Set!
//
// HOW:
//   1. Dump all numbers into a Set (O(n)).
//   2. For each number, check if it's the START of a sequence.
//      How? If (num - 1) is NOT in the set, then num is a start.
//   3. From each start, count forward: num+1, num+2, ... until
//      the chain breaks. Track the longest chain.
//
//   WHY is this O(n)? Each number is visited at most twice:
//   once when checking if it's a start, and once as part of
//   some sequence's forward counting. No nested loops over n.
//
// REAL-WORLD ANALOGY:
//   You have a shuffled deck of numbered cards. Toss them all
//   onto a table (the Set). Then for each card, check if there's
//   a card numbered one-less. If not, this card starts a run —
//   count how far the run goes by checking card+1, card+2, etc.
//
// COMPLEXITY: O(n) time, O(n) space
// ================================================================

console.log("\n═══════════════════════════════════════");
console.log("6️⃣  Bonus: Longest Consecutive Sequence");
console.log("═══════════════════════════════════════");

function longestConsecutive(nums: number[]): number {
  const numSet = new Set(nums);
  let longest = 0;

  for (const num of numSet) {
    if (!numSet.has(num - 1)) {
      let current = num;
      let streak = 1;
      while (numSet.has(current + 1)) {
        current++;
        streak++;
      }
      if (streak > longest) {
        longest = streak;
        console.log(`    Found sequence starting at ${num}, length ${streak}`);
      }
    }
  }
  return longest;
}

const seqNums = [100, 4, 200, 1, 3, 2];
console.log(`\n  Input: [${seqNums}]`);
const result = longestConsecutive(seqNums);
console.log(`  Longest consecutive sequence length: ${result}`);

const seqNums2 = [0, 3, 7, 2, 5, 8, 4, 6, 0, 1];
console.log(`\n  Input: [${seqNums2}]`);
const result2 = longestConsecutive(seqNums2);
console.log(`  Longest consecutive sequence length: ${result2}`);


// ================================================================
// 🏁 CHAPTER SUMMARY
// ================================================================

console.log("\n═══════════════════════════════════════");
console.log("🏁 Chapter 4 Summary");
console.log("═══════════════════════════════════════");
console.log(`
  ✅ Custom HashMap with chaining — O(1) amortized operations
  ✅ Two Sum — hash map turns O(n²) into O(n)
  ✅ Frequency Counter — count anything in one pass
  ✅ Group Anagrams — group by computed key
  ✅ Duplicate Detection — Set gives instant membership checks
  ✅ Longest Consecutive — Set for O(n) sequence finding

  🔑 Key insight: "Can I store what I've seen for instant lookup later?"
     If yes → use a Hash Map or Hash Set!
`);
