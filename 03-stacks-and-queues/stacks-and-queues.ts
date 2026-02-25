export {};

// ================================================================
// 📚 CHAPTER 03 — Stacks & Queues: Runnable Examples
// ================================================================
// Run: bun run 03-stacks-and-queues/stacks-and-queues.ts
//
// Stacks and queues are ABSTRACT data types — they define BEHAVIOR
// (what operations are allowed), not implementation details.
// You can implement them with arrays, linked lists, or other
// structures. What matters is the access pattern:
//
//   STACK: Last-In, First-Out (LIFO)
//   Think: a stack of plates — you add and remove from the TOP.
//   Operations: push (add to top), pop (remove from top), peek (look at top)
//
//   QUEUE: First-In, First-Out (FIFO)
//   Think: a line at a store — first person in line gets served first.
//   Operations: enqueue (add to back), dequeue (remove from front), peek
//
// WHY THEY MATTER:
//   - Stacks: function call stack, undo/redo, parsing expressions,
//     DFS traversal, browser back/forward
//   - Queues: BFS traversal, task scheduling, message queues,
//     printer queues, rate limiting
//
// This file covers:
//   1. Array-based Stack
//   2. Linked-list Queue (O(1) enqueue & dequeue)
//   3. Valid Parentheses (LeetCode 20) — classic stack problem
//   4. Next Greater Element (Monotonic Stack pattern)
//   5. Min Stack (LeetCode 155) — O(1) getMin
//
// See also: 03-stacks-and-queues/README.md for theory.
// ================================================================


// ================================================================
// 1️⃣ STACK — Array-Based Implementation
// ================================================================
// We use a TypeScript array as the backing store. JavaScript arrays
// have built-in push() and pop() that operate on the END of the
// array in O(1) amortized time — perfect for a stack.
//
// All operations are O(1):
// ┌─────────┬──────────┬─────────────────────────────────┐
// │ Method  │ Time     │ Description                     │
// ├─────────┼──────────┼─────────────────────────────────┤
// │ push    │ O(1)*    │ Add element to top              │
// │ pop     │ O(1)     │ Remove and return top element   │
// │ peek    │ O(1)     │ Look at top without removing    │
// │ isEmpty │ O(1)     │ Check if stack is empty         │
// │ size    │ O(1)     │ Number of elements              │
// └─────────┴──────────┴─────────────────────────────────┘
// * Amortized — occasional array resizing is O(n)
//
// The generic <T> allows this stack to hold any type.
// ================================================================

class ArrayStack<T> {
  private items: T[] = [];

  push(value: T): void {
    // Array.push appends to the end — our "top" of the stack
    this.items.push(value);
  }

  pop(): T | undefined {
    // Return undefined for empty stack instead of throwing —
    // matches JavaScript's array.pop() behavior
    if (this.isEmpty()) return undefined;
    return this.items.pop();
  }

  peek(): T | undefined {
    // Look at the top element without removing it.
    // The top is always the LAST element in the array.
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  toString(): string {
    // Visual: leftmost = bottom, rightmost = top
    return `Stack [${this.items.join(", ")}] ← top`;
  }
}

function demoStack(): void {
  console.log("═══ Stack (Array-Based) ═══\n");

  const stack = new ArrayStack<number>();

  console.log("push(10), push(20), push(30):");
  stack.push(10);
  stack.push(20);
  stack.push(30);
  console.log(stack.toString());
  // Stack [10, 20, 30] ← top
  // 30 was added last, so it's on top

  console.log(`\npeek(): ${stack.peek()}`);   // 30 — just looking, not removing
  console.log(`pop():  ${stack.pop()}`);       // 30 — removed from top
  console.log(`pop():  ${stack.pop()}`);       // 20 — next one down
  console.log(`After two pops: ${stack.toString()}`); // Only 10 remains
  console.log(`size(): ${stack.size()}`);       // 1
  console.log(`isEmpty(): ${stack.isEmpty()}`); // false

  stack.pop(); // Remove the last element
  console.log(`After popping last element — isEmpty(): ${stack.isEmpty()}`); // true
  console.log();
}


// ================================================================
// 2️⃣ QUEUE — Linked-List Implementation
// ================================================================
// WHY NOT USE AN ARRAY?
// Array-based queues have a problem: dequeue (removing from front)
// is O(n) because Array.shift() must move every element left.
//
// A linked list solves this: we maintain head (front) and tail (back)
// pointers, making both enqueue and dequeue O(1).
//
// ┌─────────┬──────┬────────────────────────────────────────────┐
// │ Method  │ Time │ Description                                │
// ├─────────┼──────┼────────────────────────────────────────────┤
// │ enqueue │ O(1) │ Add to back (via tail pointer)             │
// │ dequeue │ O(1) │ Remove from front (just move head forward) │
// │ peek    │ O(1) │ Look at front without removing             │
// │ isEmpty │ O(1) │ Check if queue is empty                    │
// │ size    │ O(1) │ Maintained via counter                     │
// └─────────┴──────┴────────────────────────────────────────────┘
//
// This is the same pattern used in Chapter 02's linked list,
// but with the constraint that we only add at the tail
// and remove from the head (FIFO behavior).
// ================================================================

class QueueNode<T> {
  val: T;
  next: QueueNode<T> | null = null;
  constructor(val: T) {
    this.val = val;
  }
}

class LinkedListQueue<T> {
  private head: QueueNode<T> | null = null; // Front of the queue (dequeue here)
  private tail: QueueNode<T> | null = null; // Back of the queue (enqueue here)
  private count = 0;

  enqueue(value: T): void {
    const node = new QueueNode(value);
    if (this.tail) {
      // Queue has elements — link new node after the current tail
      this.tail.next = node;
    } else {
      // Queue was empty — new node is both head and tail
      this.head = node;
    }
    this.tail = node;
    this.count++;
  }

  dequeue(): T | undefined {
    if (!this.head) return undefined;
    const val = this.head.val;
    this.head = this.head.next; // Move head forward

    // If we just dequeued the last element, clear tail too
    if (!this.head) this.tail = null;

    this.count--;
    return val;
  }

  peek(): T | undefined {
    return this.head?.val;
  }

  isEmpty(): boolean {
    return this.head === null;
  }

  size(): number {
    return this.count;
  }

  toString(): string {
    const items: T[] = [];
    let current = this.head;
    while (current) {
      items.push(current.val);
      current = current.next;
    }
    return `Queue front → [${items.join(", ")}] ← back`;
  }
}

function demoQueue(): void {
  console.log("═══ Queue (Linked-List, O(1) Operations) ═══\n");

  const queue = new LinkedListQueue<string>();

  console.log("enqueue('Alice'), enqueue('Bob'), enqueue('Carol'):");
  queue.enqueue("Alice");
  queue.enqueue("Bob");
  queue.enqueue("Carol");
  console.log(queue.toString());
  // Queue front → [Alice, Bob, Carol] ← back
  // Alice was first in, so she'll be first out

  console.log(`\npeek(): ${queue.peek()}`);       // Alice — she's at the front
  console.log(`dequeue(): ${queue.dequeue()}`);     // Alice — first in, first out
  console.log(`dequeue(): ${queue.dequeue()}`);     // Bob — next in line
  console.log(`After two dequeues: ${queue.toString()}`); // Only Carol remains
  console.log(`size(): ${queue.size()}`);           // 1

  queue.enqueue("Dave");
  console.log(`After enqueue('Dave'): ${queue.toString()}`);
  // Queue front → [Carol, Dave] ← back
  console.log();
}


// ================================================================
// 3️⃣ VALID PARENTHESES — LeetCode 20
// ================================================================
// Problem: Given a string of brackets, determine if every opening
// bracket has a matching closing bracket in the correct order.
//
// This is THE classic stack problem. Here's why a stack works:
//   - When we see an OPENING bracket, push it (we'll match it later)
//   - When we see a CLOSING bracket, pop and check if it matches
//   - If the stack is empty at the end, everything matched!
//
// The stack naturally handles NESTING: the most recent opening
// bracket must be matched first (LIFO = correct nesting order).
//
// Example: "{[()]}"
//   { → push → Stack: [{]
//   [ → push → Stack: [{, []
//   ( → push → Stack: [{, [, (]
//   ) → pop ( → matches! Stack: [{, []
//   ] → pop [ → matches! Stack: [{]
//   } → pop { → matches! Stack: []
//   Empty stack → ✅ valid!
//
// Time: O(n) — single pass through the string
// Space: O(n) — worst case, all opening brackets
// ================================================================

function isValid(s: string): boolean {
  const stack: string[] = [];

  // Maps each closing bracket to its matching opening bracket
  const pairs: Record<string, string> = {
    ")": "(",
    "]": "[",
    "}": "{",
  };

  for (const char of s) {
    if (char === "(" || char === "[" || char === "{") {
      // Opening bracket — push it, we'll match it later
      stack.push(char);
    } else {
      // Closing bracket — the top of the stack must be its match
      // If stack is empty or doesn't match, it's invalid
      if (stack.pop() !== pairs[char]) return false;
    }
  }

  // Valid only if ALL opening brackets were matched (stack is empty)
  return stack.length === 0;
}

function demoValidParentheses(): void {
  console.log("═══ Valid Parentheses (LeetCode 20) ═══\n");

  const testCases = [
    { input: "()", expected: true },
    { input: "()[]{}", expected: true },
    { input: "(]", expected: false },
    { input: "{[()]}", expected: true },
    { input: "([)]", expected: false },
    { input: "", expected: true },
    { input: "((", expected: false },
  ];

  for (const { input, expected } of testCases) {
    const result = isValid(input);
    const status = result === expected ? "✅" : "❌";
    console.log(
      `  ${status} isValid("${input}") = ${result} (expected ${expected})`
    );
  }
  console.log();
}


// ================================================================
// 4️⃣ NEXT GREATER ELEMENT — Monotonic Stack
// ================================================================
// Problem: For each element, find the NEXT element to its right
// that is GREATER than it. If none exists, return -1.
//
// Example: [2, 1, 2, 4, 3]
//   2 → next greater is 4
//   1 → next greater is 2
//   2 → next greater is 4
//   4 → no greater element → -1
//   3 → no greater element → -1
//   Result: [4, 2, 4, -1, -1]
//
// BRUTE FORCE: For each element, scan right → O(n²)
// MONOTONIC STACK: Process right to left → O(n)!
//
// KEY INSIGHT: We maintain a stack of "candidates" — elements
// that could be the "next greater" for future elements. The stack
// stays in DECREASING order (monotonic decreasing).
//
// When processing element nums[i]:
//   1. Pop all stack elements ≤ nums[i] (they can't be "next greater"
//      for anything to the left of i, because nums[i] is closer and bigger)
//   2. Whatever remains on top is the next greater for nums[i]
//   3. Push nums[i] — it might be "next greater" for elements to its left
//
// Each element is pushed once and popped at most once → O(n) total.
//
// Time: O(n) | Space: O(n) for the stack
// ================================================================

function nextGreaterElement(nums: number[]): number[] {
  const n = nums.length;
  const result = new Array(n).fill(-1); // Default: no greater element
  const stack: number[] = [];           // Monotonic decreasing stack of VALUES

  // Process from RIGHT to LEFT
  for (let i = n - 1; i >= 0; i--) {
    // Pop elements that are NOT greater than nums[i]
    // They're useless: nums[i] blocks them from being "next greater"
    // for anything to the left
    while (stack.length > 0 && stack[stack.length - 1] <= nums[i]) {
      stack.pop();
    }

    // If stack has elements, the top is the next greater for nums[i]
    if (stack.length > 0) {
      result[i] = stack[stack.length - 1];
    }

    // Push current element — it might be "next greater" for elements to its left
    stack.push(nums[i]);
  }

  return result;
}

function demoNextGreaterElement(): void {
  console.log("═══ Next Greater Element (Monotonic Stack) ═══\n");

  const testCases = [
    { input: [2, 1, 2, 4, 3], expected: [4, 2, 4, -1, -1] },
    { input: [4, 3, 2, 1], expected: [-1, -1, -1, -1] },
    { input: [1, 2, 3, 4], expected: [2, 3, 4, -1] },
    { input: [1, 3, 2, 4], expected: [3, 4, 4, -1] },
  ];

  for (const { input, expected } of testCases) {
    const result = nextGreaterElement(input);
    const match =
      JSON.stringify(result) === JSON.stringify(expected) ? "✅" : "❌";
    console.log(`  ${match} Input:    [${input}]`);
    console.log(`       Result:   [${result}]`);
    console.log(`       Expected: [${expected}]\n`);
  }
}


// ================================================================
// 5️⃣ MIN STACK — LeetCode 155
// ================================================================
// Problem: Design a stack that supports push, pop, top, AND
// retrieving the minimum element — ALL in O(1) time.
//
// THE TRICK: Maintain TWO stacks in parallel:
//   1. Main stack: holds the actual values (normal stack behavior)
//   2. Min stack: tracks the minimum at each level
//
// When we push a value, we also push the current minimum onto
// the min stack. When we pop, we pop from both stacks.
//
// This works because the minimum can only change when we push
// or pop. By recording the min at each "height" of the stack,
// we always know the current min in O(1).
//
// Example:
//   push(5) → main: [5],       mins: [5]       → min = 5
//   push(3) → main: [5,3],     mins: [5,3]     → min = 3
//   push(7) → main: [5,3,7],   mins: [5,3,3]   → min = 3 (unchanged)
//   push(2) → main: [5,3,7,2], mins: [5,3,3,2] → min = 2
//   pop()   → main: [5,3,7],   mins: [5,3,3]   → min = 3 (restored!)
//
// Time: O(1) for all operations | Space: O(n) for the extra min stack
// ================================================================

class MinStack {
  private stack: number[] = [];  // Main stack — holds actual values
  private mins: number[] = [];   // Parallel min stack — tracks minimum at each level

  push(val: number): void {
    this.stack.push(val);
    // The new minimum is either the pushed value or the previous minimum
    const currentMin =
      this.mins.length === 0
        ? val
        : Math.min(val, this.mins[this.mins.length - 1]);
    this.mins.push(currentMin);
  }

  pop(): void {
    // Pop from BOTH stacks to keep them in sync
    this.stack.pop();
    this.mins.pop();
  }

  top(): number {
    return this.stack[this.stack.length - 1];
  }

  getMin(): number {
    // The current minimum is always on top of the mins stack
    return this.mins[this.mins.length - 1];
  }

  toString(): string {
    return `Main: [${this.stack.join(", ")}]  Mins: [${this.mins.join(", ")}]`;
  }
}

function demoMinStack(): void {
  console.log("═══ Min Stack (LeetCode 155) ═══\n");

  const ms = new MinStack();

  // Push several values and watch how the min stack evolves
  const ops: [string, number?][] = [
    ["push", 5],
    ["push", 3],
    ["push", 7],
    ["push", 2],
    ["push", 8],
  ];

  for (const [op, val] of ops) {
    if (op === "push" && val !== undefined) {
      ms.push(val);
      console.log(`  push(${val}) → ${ms.toString()} → min: ${ms.getMin()}`);
    }
  }

  console.log(`\n  Current top: ${ms.top()}, min: ${ms.getMin()}`);

  // Pop elements and watch the minimum get restored correctly
  console.log("\n  Popping elements:");
  for (let i = 0; i < 3; i++) {
    const topBefore = ms.top();
    ms.pop();
    console.log(
      `  pop() removed ${topBefore} → ${ms.toString()} → min: ${ms.getMin()}`
    );
  }
  console.log();
}


// ================================================================
// 🚀 RUN ALL DEMOS
// ================================================================

console.log("╔══════════════════════════════════════════════╗");
console.log("║   Chapter 3: Stacks & Queues — Examples      ║");
console.log("╚══════════════════════════════════════════════╝\n");

demoStack();
demoQueue();
demoValidParentheses();
demoNextGreaterElement();
demoMinStack();

console.log("════════════════════════════════════════════════");
console.log("  All demos complete!");
console.log("  Run with: bun run 03-stacks-and-queues/stacks-and-queues.ts");
console.log("════════════════════════════════════════════════");
