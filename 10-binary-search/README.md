# 🔍 Chapter 10: Binary Search

> *"The art of eliminating half the possibilities with a single question."*

---

## 🌍 Real-World Analogy

### The Number Guessing Game

Imagine your friend picks a number between **1 and 100**. After each guess, they say **"higher"** or **"lower"**.

**Naive approach**: Guess 1, 2, 3, 4... → Up to **100 guesses** 😩

**Smart approach**: Always guess the **middle**:

```
Round 1: Guess 50 → "Higher"    (eliminate 1-50)
Round 2: Guess 75 → "Lower"     (eliminate 75-100)
Round 3: Guess 62 → "Higher"    (eliminate 50-62)
Round 4: Guess 68 → "Lower"     (eliminate 68-75)
Round 5: Guess 65 → "Higher"    (eliminate 62-65)
Round 6: Guess 66 → "Lower"     (eliminate 67-68)
Round 7: Guess 67 → ✅ Found!
```

At most **7 guesses** for 1-100 because **log₂(100) ≈ 7**. That's binary search.

### The Dictionary Analogy 📖

Looking up "Mango" in a physical dictionary:

1. Open to the **middle** → you're at "L" → "Mango" is after "L", go right
2. Open to the **middle of the right half** → you're at "P" → "Mango" is before "P", go left
3. Open to the **middle** again → you're at "M" → scan nearby pages → ✅ Found!

You **never** read the dictionary page by page. You **halve** the search space each time.

---

## 📝 What & Why

### What Is Binary Search?

Binary search is a **divide-and-conquer** algorithm that repeatedly **splits the search space in half**, eliminating the half that cannot contain the answer.

```mermaid
graph LR
    A["🔍 Full Search Space"] --> B["Split in Half"]
    B --> C["Keep relevant half"]
    B --> D["❌ Discard other half"]
    C --> E["Split in Half again"]
    E --> F["Keep relevant half"]
    E --> G["❌ Discard"]
    F --> H["🎯 Found!"]
```

### The One Prerequisite: MONOTONICITY

Binary search requires a **monotonic** property — the search space must have a **clear boundary** where a condition flips from `false` to `true` (or vice versa).

```
Index:     0   1   2   3   4   5   6   7   8   9
Sorted:   [1,  3,  5,  7,  9, 11, 13, 15, 17, 19]
≥ 9?:      F   F   F   F   T   T   T   T   T   T
                          ↑ boundary
```

This monotonicity isn't limited to sorted arrays! It applies to any search space where a condition transitions cleanly.

### Why It Matters: O(log n) vs O(n)

| Items (n)       | Linear Search O(n) | Binary Search O(log n) |
|-----------------|--------------------|-----------------------|
| 100             | 100 steps          | 7 steps               |
| 10,000          | 10,000 steps       | 14 steps              |
| 1,000,000       | 1,000,000 steps    | 20 steps              |
| 1,000,000,000   | 1 BILLION steps    | **30 steps** 🤯       |

### When to Use Binary Search

✅ Sorted arrays — find a value, insertion point, first/last occurrence  
✅ Search space problems — "find the minimum X such that..."  
✅ Optimization problems — minimize/maximize with a feasibility check  
✅ Rotated sorted arrays — modified binary search  
✅ Any monotonic condition — true/false boundary  

---

## ⚙️ How It Works

### Step-by-Step: Finding 7 in a Sorted Array

```
Array: [1, 3, 5, 7, 9, 11, 13]
Target: 7
```

```mermaid
graph TD
    A["Step 1: left=0, right=6, mid=3<br/>[1, 3, 5, <b>7</b>, 9, 11, 13]<br/>arr[3]=7 == target ✅"] --> B["🎯 Found at index 3!"]

    style A fill:#d4edda,stroke:#28a745
    style B fill:#28a745,color:#fff
```

Let's try finding **11** instead:

```mermaid
graph TD
    S1["Step 1: left=0, right=6, mid=3<br/>[1, 3, 5, <b>7</b>, 9, 11, 13]<br/>arr[3]=7 < 11 → go RIGHT"] --> S2

    S2["Step 2: left=4, right=6, mid=5<br/>[..., 9, <b>11</b>, 13]<br/>arr[5]=11 == target ✅"] --> S3["🎯 Found at index 5!"]

    style S1 fill:#fff3cd,stroke:#ffc107
    style S2 fill:#d4edda,stroke:#28a745
    style S3 fill:#28a745,color:#fff
```

### Search Space Halving Visualized

Starting with 1024 elements:

```mermaid
graph LR
    A["1024"] -->|"step 1"| B["512"]
    B -->|"step 2"| C["256"]
    C -->|"step 3"| D["128"]
    D -->|"step 4"| E["64"]
    E -->|"step 5"| F["32"]
    F -->|"step 6"| G["16"]
    G -->|"step 7"| H["8"]
    H -->|"step 8"| I["4"]
    I -->|"step 9"| J["2"]
    J -->|"step 10"| K["1 🎯"]
```

> **1024 elements → 10 steps.** That's the power of halving. `log₂(1024) = 10`.

### Left-Biased vs Right-Biased Binary Search

When duplicates exist, we often need the **first** or **last** occurrence:

```
Array: [1, 2, 2, 2, 2, 3, 4]
Index:  0  1  2  3  4  5  6
Target: 2

First occurrence (leftmost): index 1
Last occurrence (rightmost):  index 4
```

```mermaid
graph TD
    subgraph Leftmost["🔵 Find FIRST occurrence of 2"]
        L1["left=0, right=6, mid=3<br/>arr[3]=2 → found, but is it first?<br/>right = mid (keep searching left)"]
        L2["left=0, right=3, mid=1<br/>arr[1]=2 → found, keep searching left<br/>right = mid"]
        L3["left=0, right=1, mid=0<br/>arr[0]=1 < 2 → left = mid + 1"]
        L4["left=1, right=1 → left==right<br/>✅ Answer: index 1"]
        L1 --> L2 --> L3 --> L4
    end

    subgraph Rightmost["🟠 Find LAST occurrence of 2"]
        R1["left=0, right=6, mid=3<br/>arr[3]=2 → found, but is it last?<br/>left = mid + 1 (keep searching right)"]
        R2["left=4, right=6, mid=5<br/>arr[5]=3 > 2 → right = mid - 1"]
        R3["left=4, right=4<br/>arr[4]=2 → ✅ Answer: index 4"]
        R1 --> R2 --> R3
    end
```

### The Two Templates: `while (left <= right)` vs `while (left < right)`

```mermaid
graph TD
    Q["Which loop condition?"] --> A{"Looking for<br/>exact match?"}
    A -->|Yes| B["while left <= right<br/>Return mid when found<br/>Return -1 if not found"]
    A -->|No| C{"Looking for<br/>a boundary?"}
    C -->|First/leftmost| D["while left < right<br/>right = mid<br/>Answer is left at end"]
    C -->|Last/rightmost| E["while left < right<br/>mid = left + Math.ceil(right-left/2)<br/>left = mid<br/>Answer is left at end"]

    style B fill:#d4edda,stroke:#28a745
    style D fill:#cce5ff,stroke:#007bff
    style E fill:#fff3cd,stroke:#ffc107
```

---

## 💻 TypeScript Implementation

### Template 1: Classic Binary Search (Find Exact Value)

> **Use when**: You need to find a specific value and return its index. Return -1 if not found.

```typescript
function binarySearch(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2); // avoid overflow

    if (nums[mid] === target) {
      return mid;          // 🎯 found it
    } else if (nums[mid] < target) {
      left = mid + 1;      // target is in right half
    } else {
      right = mid - 1;     // target is in left half
    }
  }

  return -1; // not found
}
```

**Why `left <= right`?** The search space is `[left, right]` (both inclusive). When `left > right`, the search space is empty — we've checked everything.

**Why `mid + 1` and `mid - 1`?** We've already checked `mid`, so exclude it from the next search space. This guarantees the search space shrinks every iteration → **no infinite loops**.

---

### Template 2: Find Leftmost / First Occurrence (Lower Bound)

> **Use when**: You need the **first** index where a condition is true, or the leftmost occurrence of a value.

```typescript
function findLeftmost(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);

    if (nums[mid] < target) {
      left = mid + 1;     // mid is too small, exclude it
    } else {
      right = mid;        // mid could be the answer, keep it
    }
  }

  // left === right, check if it's the target
  return nums[left] === target ? left : -1;
}
```

**Why `right = mid` (not `mid - 1`)?** Because `mid` might be the first occurrence! We can't exclude it.

**Why `left < right` (not `<=`)?** Because `right = mid` doesn't shrink the space when `left === right === mid`, which would cause an **infinite loop** with `<=`.

**Why floor for mid?** When `left` and `right` are adjacent, `floor` biases toward `left`. Since we set `right = mid`, this ensures the search space always shrinks (mid lands on left, then left = mid + 1 or right = mid which is already left).

---

### Template 3: Find Rightmost / Last Occurrence (Upper Bound)

> **Use when**: You need the **last** index where a condition is true, or the rightmost occurrence of a value.

```typescript
function findRightmost(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const mid = left + Math.ceil((right - left) / 2); // ⚠️ ceil, not floor!

    if (nums[mid] > target) {
      right = mid - 1;    // mid is too big, exclude it
    } else {
      left = mid;         // mid could be the answer, keep it
    }
  }

  return nums[left] === target ? left : -1;
}
```

**Why `Math.ceil` instead of `Math.floor`?** This is the **critical** difference. When `left` and `right` are adjacent:
- `floor` gives `mid = left` → `left = mid = left` → **infinite loop!** 💀
- `ceil` gives `mid = right` → `left = mid` moves past left → **space shrinks** ✅

---

### Template Comparison At a Glance

| Aspect | Template 1 (Classic) | Template 2 (Leftmost) | Template 3 (Rightmost) |
|---|---|---|---|
| **Loop** | `while (left <= right)` | `while (left < right)` | `while (left < right)` |
| **Mid** | `floor` | `floor` | **`ceil`** ⚠️ |
| **Match found** | Return immediately | `right = mid` | `left = mid` |
| **Too small** | `left = mid + 1` | `left = mid + 1` | — |
| **Too big** | `right = mid - 1` | — | `right = mid - 1` |
| **After loop** | Return -1 | Check `nums[left]` | Check `nums[left]` |
| **Use case** | Exact match | First true / lower bound | Last true / upper bound |

---

## 🧩 Essential Binary Search Techniques for LeetCode

### 1. 🔄 Search in Rotated Sorted Array

A sorted array rotated at some pivot: `[4, 5, 6, 7, 0, 1, 2]`

**Key insight**: At least one half is **always sorted**. Determine which half is sorted, then check if the target falls in that sorted half.

```mermaid
graph TD
    A["Array: [4, 5, 6, 7, 0, 1, 2]<br/>left=0, right=6, mid=3"] --> B{"Is left half sorted?<br/>arr[left] <= arr[mid]?<br/>4 <= 7 → YES"}
    B -->|"Left half [4,5,6,7] is sorted"| C{"Is target in [4, 7]?"}
    C -->|"Yes: right = mid - 1"| D["Search left half"]
    C -->|"No: left = mid + 1"| E["Search right half"]

    B -->|"Right half is sorted"| F{"Is target in sorted range?"}
    F -->|"Yes: left = mid + 1"| G["Search right half"]
    F -->|"No: right = mid - 1"| H["Search left half"]

    style A fill:#e8f4fd,stroke:#0288d1
    style B fill:#fff3cd,stroke:#ffc107
```

```typescript
function searchRotated(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);

    if (nums[mid] === target) return mid;

    // Determine which half is sorted
    if (nums[left] <= nums[mid]) {
      // Left half is sorted
      if (nums[left] <= target && target < nums[mid]) {
        right = mid - 1; // target in sorted left half
      } else {
        left = mid + 1;  // target in right half
      }
    } else {
      // Right half is sorted
      if (nums[mid] < target && target <= nums[right]) {
        left = mid + 1;  // target in sorted right half
      } else {
        right = mid - 1; // target in left half
      }
    }
  }

  return -1;
}
```

---

### 2. ⛰️ Find Peak Element

An element is a **peak** if it's greater than its neighbors. The array may be unsorted, but binary search still works!

**Key insight**: If `arr[mid] < arr[mid + 1]`, there MUST be a peak to the right (the sequence is going up). Otherwise, a peak exists to the left (or at mid).

```mermaid
graph TD
    A["Array: [1, 2, 3, 1]"] --> B["left=0, right=3, mid=1<br/>arr[1]=2 < arr[2]=3 → peak is RIGHT"]
    B --> C["left=2, right=3, mid=2<br/>arr[2]=3 > arr[3]=1 → peak is LEFT or HERE"]
    C --> D["left=2, right=2<br/>🎯 Peak at index 2, value=3"]

    style D fill:#28a745,color:#fff
```

```typescript
function findPeakElement(nums: number[]): number {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);

    if (nums[mid] < nums[mid + 1]) {
      left = mid + 1;  // peak is to the right
    } else {
      right = mid;     // peak is at mid or to the left
    }
  }

  return left; // left === right === peak index
}
```

---

### 3. 🎯 Search on Answer (Parametric Search) — THE Most Powerful Technique

This is the **most important** binary search pattern for LeetCode medium/hard problems.

**The idea**: Instead of searching through data, search through **possible answers**. For each candidate answer, check if it's **feasible**.

```mermaid
graph TD
    A["❓ Question: What is the minimum X<br/>such that condition is satisfied?"] --> B["Define search space:<br/>X ranges from min_possible to max_possible"]
    B --> C["Binary search on X"]
    C --> D{"Is X feasible?<br/>(Can we satisfy the<br/>condition with X?)"}
    D -->|"Yes → X might be answer<br/>but try smaller"| E["right = mid"]
    D -->|"No → X too small"| F["left = mid + 1"]
    E --> C
    F --> C
    C --> G["🎯 left = minimum feasible X"]

    style A fill:#e8f4fd,stroke:#0288d1
    style G fill:#28a745,color:#fff
```

#### Example: 🍌 Koko Eating Bananas

> Koko has `piles` of bananas and `h` hours. She eats at speed `k` bananas/hour. What's the **minimum k** to finish all bananas in `h` hours?

The **answer space** is `[1, max(piles)]`. Binary search on `k`:

```
piles = [3, 6, 7, 11], h = 8

Speed k=1:  3+6+7+11 = 27 hours → too slow ❌
Speed k=11: 1+1+1+1  = 4 hours  → fast enough ✅ (but can we go slower?)
Speed k=6:  1+1+2+2  = 6 hours  → fast enough ✅
Speed k=3:  1+2+3+4  = 10 hours → too slow ❌
Speed k=4:  1+2+2+3  = 8 hours  → fast enough ✅
Speed k=4 is the minimum! 🎯
```

```typescript
function minEatingSpeed(piles: number[], h: number): number {
  let left = 1;
  let right = Math.max(...piles);

  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);

    if (canFinish(piles, mid, h)) {
      right = mid;       // feasible, try slower speed
    } else {
      left = mid + 1;    // too slow, speed up
    }
  }

  return left;
}

function canFinish(piles: number[], speed: number, h: number): boolean {
  let hours = 0;
  for (const pile of piles) {
    hours += Math.ceil(pile / speed);
  }
  return hours <= h;
}
```

#### The Parametric Search Pattern

Every "search on answer" problem follows the same skeleton:

```typescript
function searchOnAnswer(): number {
  let left = MIN_POSSIBLE_ANSWER;
  let right = MAX_POSSIBLE_ANSWER;

  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);

    if (isFeasible(mid)) {
      right = mid;       // for minimum answer (use left = mid for maximum)
    } else {
      left = mid + 1;    // for minimum answer (use right = mid - 1 for maximum)
    }
  }

  return left;
}
```

**Other "search on answer" problems**:
- 🚢 **Capacity to Ship Packages Within D Days** — binary search on capacity
- 💐 **Minimum Number of Days to Make m Bouquets** — binary search on days
- ✂️ **Split Array Largest Sum** — binary search on the maximum subarray sum

---

### 4. 🔢 Binary Search on Matrix

A sorted m×n matrix can be treated as a sorted 1D array of length `m * n`:

```
Matrix:           As 1D array:
[1,  3,  5]      [1, 3, 5, 10, 11, 16, 20, 23, 30]
[10, 11, 16]      index: 0  1  2   3   4   5   6   7   8
[20, 23, 30]

Index 5 → row = 5/3 = 1, col = 5%3 = 2 → matrix[1][2] = 16
```

```typescript
function searchMatrix(matrix: number[][], target: number): boolean {
  const m = matrix.length;
  const n = matrix[0].length;
  let left = 0;
  let right = m * n - 1;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    const val = matrix[Math.floor(mid / n)][mid % n]; // convert 1D index to 2D

    if (val === target) return true;
    else if (val < target) left = mid + 1;
    else right = mid - 1;
  }

  return false;
}
```

---

### 5. 📍 Find First and Last Position

Using Template 2 and Template 3 together:

```typescript
function searchRange(nums: number[], target: number): [number, number] {
  return [findFirst(nums, target), findLast(nums, target)];
}

function findFirst(nums: number[], target: number): number {
  let left = 0, right = nums.length - 1;
  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    if (nums[mid] < target) left = mid + 1;
    else right = mid;
  }
  return nums[left] === target ? left : -1;
}

function findLast(nums: number[], target: number): number {
  let left = 0, right = nums.length - 1;
  while (left < right) {
    const mid = left + Math.ceil((right - left) / 2);
    if (nums[mid] > target) right = mid - 1;
    else left = mid;
  }
  return nums[left] === target ? left : -1;
}
```

---

### 6. √ Square Root via Binary Search

Find `floor(√x)` — binary search on the answer space `[0, x]`:

```typescript
function mySqrt(x: number): number {
  if (x < 2) return x;
  let left = 1;
  let right = Math.floor(x / 2);

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    if (mid * mid === x) return mid;
    else if (mid * mid < x) left = mid + 1;
    else right = mid - 1;
  }

  return right; // right < left, right is floor(√x)
}
```

---

## ⏱️ Complexity Analysis

| Variant | Time | Space |
|---|---|---|
| Iterative binary search | **O(log n)** | **O(1)** |
| Recursive binary search | **O(log n)** | **O(log n)** call stack |
| Search on answer | **O(log(range) × check)** | depends on check function |
| Search in m×n matrix | **O(log(m × n))** | **O(1)** |

**Why O(log n)?**

```
n elements → n/2 → n/4 → n/8 → ... → 1

How many times can you halve n before reaching 1?
n / 2^k = 1  →  k = log₂(n)
```

```mermaid
graph LR
    A["n"] -->|"÷2"| B["n/2"]
    B -->|"÷2"| C["n/4"]
    C -->|"÷2"| D["n/8"]
    D -->|"..."| E["1"]
    F["Total steps = log₂ n"]

    style F fill:#ffeeba,stroke:#ffc107
```

---

## 🎯 LeetCode Patterns — Decision Flowchart

Use this flowchart to pick the right approach:

```mermaid
flowchart TD
    START["🔍 Binary Search Problem"] --> Q1{"Is the array<br/>sorted?"}

    Q1 -->|"Yes"| Q2{"Looking for<br/>exact value?"}
    Q1 -->|"Rotated sorted"| R["🔄 Rotated BS<br/>Check which half is sorted"]
    Q1 -->|"Not sorted but<br/>has peak property"| P["⛰️ Find Peak Element<br/>Compare mid with mid+1"]
    Q1 -->|"Not an array<br/>problem at all"| Q4

    Q2 -->|"Yes"| T1["📌 Template 1<br/>while left <= right<br/>return mid"]
    Q2 -->|"First occurrence"| T2["📌 Template 2<br/>while left < right<br/>right = mid"]
    Q2 -->|"Last occurrence"| T3["📌 Template 3<br/>while left < right<br/>left = mid, mid uses ceil"]

    Q4{"Find min/max value<br/>that satisfies a<br/>condition?"}
    Q4 -->|"Yes"| SA["🎯 Search on Answer<br/>Binary search + feasibility check"]
    Q4 -->|"2D Matrix"| MX["🔢 Flatten to 1D<br/>row = mid/cols, col = mid%cols"]

    style START fill:#e8f4fd,stroke:#0288d1
    style T1 fill:#d4edda,stroke:#28a745
    style T2 fill:#cce5ff,stroke:#007bff
    style T3 fill:#fff3cd,stroke:#ffc107
    style SA fill:#f8d7da,stroke:#dc3545
    style R fill:#e2d5f1,stroke:#6f42c1
    style P fill:#fce4ec,stroke:#e91e63
    style MX fill:#e0f2f1,stroke:#009688
```

### Pattern Recognition Cheat Sheet

| You see... | Technique | Template |
|---|---|---|
| "Given a **sorted** array, find X" | Classic binary search | Template 1 |
| "Find the **first/last** position of X" | Leftmost / Rightmost | Template 2 / 3 |
| "**Rotated** sorted array" | Check which half is sorted | Template 1 (modified) |
| "Find **peak** element" | Compare with neighbor | Template 2 |
| "**Minimum** speed / capacity / days to..." | Search on answer | Template 2 (on answer space) |
| "**Koko**, **shipping**, **bouquets**, **split array**" | Parametric search | Template 2 (on answer space) |
| "Search a **2D matrix**" | Flatten to 1D | Template 1 |
| "Find **sqrt(x)**" | Search on answer | Template 1 |

---

## ⚠️ Common Pitfalls

### 1. 💥 Integer Overflow in Mid Calculation

```typescript
// ❌ WRONG — can overflow for large left + right
const mid = Math.floor((left + right) / 2);

// ✅ CORRECT — safe from overflow
const mid = left + Math.floor((right - left) / 2);
```

> In TypeScript/JavaScript, numbers are floating point so overflow isn't a crash risk, but this is a **must-know** for interviews in Java/C++ and shows good habits.

### 2. 🔁 Infinite Loops from Wrong Mid Calculation

```typescript
// Finding rightmost — ❌ WRONG (infinite loop when left + 1 === right)
while (left < right) {
  const mid = left + Math.floor((right - left) / 2); // mid = left
  left = mid; // left = left → STUCK FOREVER
}

// ✅ CORRECT — use ceil for rightmost search
while (left < right) {
  const mid = left + Math.ceil((right - left) / 2); // mid = right when adjacent
  left = mid; // moves forward
}
```

### 3. 🎯 Off-by-One Errors

The most common source of bugs. Remember:
- `while (left <= right)` → search space is `[left, right]`, shrink with `mid ± 1`
- `while (left < right)` → loop ends when `left === right`, that's your answer
- After `while (left <= right)`, if not found, `left` = insertion point

### 4. 🚫 Forgetting the "Not Found" Case

```typescript
// Template 2 returns left, but we must verify:
return nums[left] === target ? left : -1; // Don't forget this check!
```

### 5. 📏 Using Binary Search on Unsorted Data

Binary search **requires monotonicity**. If the data isn't sorted and doesn't have a monotonic property, binary search will give wrong results silently.

---

## 🔑 Key Takeaways

1. **Binary search = halving the search space** each step → O(log n)

2. **Three templates** cover virtually every binary search problem:
   - Template 1: exact match → `while (left <= right)`
   - Template 2: leftmost/first → `while (left < right)`, `right = mid`
   - Template 3: rightmost/last → `while (left < right)`, `left = mid`, **use ceil**

3. **Search on answer is the most powerful pattern** — transform "find minimum X satisfying condition" into binary search on X with a feasibility check

4. **Rotated sorted array**: one half is ALWAYS sorted — use that to decide direction

5. **Always use `left + Math.floor((right - left) / 2)`** for mid to avoid overflow

6. **The #1 bug**: infinite loops from wrong mid calculation in rightmost search (need `ceil`)

7. **Monotonicity is the prerequisite** — not just "sorted". Any boolean condition with a clean boundary works

---

## 📋 Practice Problems

### 🟢 Easy

| # | Problem | Key Technique |
|---|---------|--------------|
| 704 | [Binary Search](https://leetcode.com/problems/binary-search/) | Template 1 — classic |
| 35 | [Search Insert Position](https://leetcode.com/problems/search-insert-position/) | Template 2 — find boundary |
| 278 | [First Bad Version](https://leetcode.com/problems/first-bad-version/) | Template 2 — first true |
| 69 | [Sqrt(x)](https://leetcode.com/problems/sqrtx/) | Search on answer |

### 🟡 Medium

| # | Problem | Key Technique |
|---|---------|--------------|
| 33 | [Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array/) | Check which half is sorted |
| 162 | [Find Peak Element](https://leetcode.com/problems/find-peak-element/) | Compare with neighbor |
| 34 | [Find First and Last Position](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/) | Template 2 + Template 3 |
| 875 | [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas/) | Parametric search |
| 74 | [Search a 2D Matrix](https://leetcode.com/problems/search-a-2d-matrix/) | Flatten to 1D |
| 153 | [Find Minimum in Rotated Sorted Array](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/) | Template 2 on rotated |
| 1011 | [Capacity to Ship Packages](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/) | Parametric search |

### 🔴 Hard

| # | Problem | Key Technique |
|---|---------|--------------|
| 4 | [Median of Two Sorted Arrays](https://leetcode.com/problems/median-of-two-sorted-arrays/) | Binary search on partition |
| 410 | [Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum/) | Parametric search |

---

> 💡 **Pro tip**: When stuck on a binary search problem, ask yourself: *"What am I binary searching ON?"* — is it an index, a value, or an answer? Once you identify the search space, the solution structure falls into place.
