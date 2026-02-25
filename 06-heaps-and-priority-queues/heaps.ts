export {};

// ================================================================
// 🏔️ CHAPTER 6: HEAPS & PRIORITY QUEUES — Runnable Examples
// ================================================================
// Run: bun run heaps.ts
//
// A heap is a complete binary tree stored in a flat array where
// every parent is "better" than its children (smaller for min-heap,
// larger for max-heap). This gives you O(1) access to the best
// element and O(log n) insert/extract.
//
// Priority Queues are the abstract concept; heaps are the most
// common implementation. Think of it as a waiting room where the
// most urgent patient always gets called next, regardless of
// arrival order.
//
// This file covers:
//   1. MinHeap — core implementation with bubbleUp/bubbleDown
//   2. MaxHeap — built from MinHeap using the negation trick
//   3. Generic PriorityQueue — custom comparators for any type
//   4. Top-K Largest — min-heap as a "gatekeeper"
//   5. Merge K Sorted Arrays — the classic heap application
//   6. Running Median — the elegant two-heap technique
// ================================================================


// ================================================================
// 📦 MIN HEAP IMPLEMENTATION
// ================================================================
// WHAT: A min-heap is a complete binary tree where every parent
//   node is SMALLER than or equal to its children. The smallest
//   element is always at the root (index 0).
//
// WHY an array? A complete binary tree has no gaps, so we can
//   store it compactly in an array without any pointers:
//     Parent of index i:      Math.floor((i - 1) / 2)
//     Left child of index i:  2 * i + 1
//     Right child of index i: 2 * i + 2
//
// REAL-WORLD ANALOGY:
//   An emergency room triage system. New patients are added, but
//   the most critical (smallest priority number) is always served
//   first. When a patient is admitted, the queue reorganizes so
//   the next-most-critical is now at the front.
//
// COMPLEXITY:
//   peek — O(1): the min is always at index 0
//   insert — O(log n): add at end, then bubble up
//   extractMin — O(log n): remove root, move last to root, bubble down
//   buildHeap — O(n): bottom-up heapify is faster than n inserts
//   Space — O(n)
// ================================================================

class MinHeap {
  private heap: number[] = [];

  get size(): number {
    return this.heap.length;
  }

  peek(): number | undefined {
    return this.heap[0];
  }

  // ──────────────────────────────────────────────────────────────
  // INSERT — O(log n)
  // ──────────────────────────────────────────────────────────────
  // HOW:
  //   1. Append the new value at the END of the array (maintains
  //      the complete tree shape).
  //   2. "Bubble up": compare with parent. If smaller, swap.
  //      Repeat until the heap property is restored.
  //
  // WHY bubble up? The new element might be smaller than its
  //   parent, violating the heap property. Swapping it upward
  //   fixes the violation at each level. At most log(n) swaps.
  // ──────────────────────────────────────────────────────────────
  insert(val: number): void {
    this.heap.push(val);
    this.bubbleUp(this.heap.length - 1);
  }

  // ──────────────────────────────────────────────────────────────
  // EXTRACT MIN — O(log n)
  // ──────────────────────────────────────────────────────────────
  // HOW:
  //   1. Save the root (index 0) — that's our minimum.
  //   2. Move the LAST element to the root position. This
  //      maintains the complete tree shape but breaks ordering.
  //   3. "Bubble down": compare with children. Swap with the
  //      SMALLER child. Repeat until heap property is restored.
  //
  // WHY move the last element? Removing from the middle of an
  //   array is O(n). Swapping root with last and popping is O(1),
  //   then we only need O(log n) to fix the ordering.
  // ──────────────────────────────────────────────────────────────
  extractMin(): number | undefined {
    if (this.heap.length === 0) return undefined;
    if (this.heap.length === 1) return this.heap.pop();

    const min = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.bubbleDown(0);
    return min;
  }

  // ──────────────────────────────────────────────────────────────
  // BUBBLE UP — restore heap property upward
  // ──────────────────────────────────────────────────────────────
  // Starting at index i, compare with parent. If we're smaller,
  // swap and continue. Stop when we're >= parent or reach root.
  // ──────────────────────────────────────────────────────────────
  private bubbleUp(i: number): void {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.heap[i] >= this.heap[parent]) break;
      [this.heap[i], this.heap[parent]] = [this.heap[parent], this.heap[i]];
      i = parent;
    }
  }

  // ──────────────────────────────────────────────────────────────
  // BUBBLE DOWN — restore heap property downward
  // ──────────────────────────────────────────────────────────────
  // Starting at index i, find the smallest among self and two
  // children. If self isn't the smallest, swap with the smallest
  // child and continue. Stop when self is smallest (heap property
  // restored) or we reach a leaf.
  //
  // WHY swap with the SMALLEST child? To ensure the new parent
  // is smaller than BOTH children, maintaining the heap property.
  // ──────────────────────────────────────────────────────────────
  private bubbleDown(i: number): void {
    const n = this.heap.length;
    while (true) {
      let smallest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;

      if (left < n && this.heap[left] < this.heap[smallest]) {
        smallest = left;
      }
      if (right < n && this.heap[right] < this.heap[smallest]) {
        smallest = right;
      }
      if (smallest === i) break;

      [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
      i = smallest;
    }
  }

  // ──────────────────────────────────────────────────────────────
  // BUILD HEAP — O(n) from an unsorted array
  // ──────────────────────────────────────────────────────────────
  // HOW: Copy the array, then call bubbleDown on each non-leaf
  //   node from bottom to top. Leaves (the second half of the
  //   array) are already valid 1-element heaps.
  //
  // WHY O(n) and not O(n log n)?
  //   Most nodes are near the bottom and only bubble down 1-2
  //   levels. The math works out to O(n) total swaps. This is
  //   called "Floyd's algorithm" or "bottom-up heapify."
  //   (n inserts would be O(n log n), so buildHeap is faster!)
  // ──────────────────────────────────────────────────────────────
  static buildHeap(arr: number[]): MinHeap {
    const h = new MinHeap();
    h.heap = [...arr];
    for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
      h.bubbleDown(i);
    }
    return h;
  }

  toArray(): number[] {
    return [...this.heap];
  }
}


// ================================================================
// 📦 MAX HEAP — Using the Negation Trick
// ================================================================
// WHAT: A max-heap where the LARGEST element is always at the root.
//
// HOW: Instead of writing a separate implementation, we REUSE
//   MinHeap by negating all values on the way in and out.
//   Inserting 10 stores -10. The min-heap puts -15 (which
//   represents 15) at the root. Negating on extract gives back
//   the original maximum.
//
// WHY this trick? It avoids code duplication. In many languages
//   (especially Python with heapq), this is the standard approach.
//
// TRADE-OFF: Slightly less readable, but zero maintenance cost.
//   Any improvements to MinHeap automatically benefit MaxHeap.
// ================================================================

class MaxHeap {
  private minHeap = new MinHeap();

  get size(): number {
    return this.minHeap.size;
  }

  peek(): number | undefined {
    const val = this.minHeap.peek();
    return val !== undefined ? -val : undefined;
  }

  insert(val: number): void {
    this.minHeap.insert(-val);
  }

  extractMax(): number | undefined {
    const val = this.minHeap.extractMin();
    return val !== undefined ? -val : undefined;
  }
}


// ================================================================
// 📦 GENERIC PRIORITY QUEUE WITH CUSTOM COMPARATOR
// ================================================================
// WHAT: A heap that works with any data type, not just numbers.
//   You provide a comparator function that defines "priority."
//
// WHY: Real-world priority queues hold objects (tasks, events,
//   graph edges), not raw numbers. The comparator lets you
//   define what "higher priority" means for your use case.
//
// HOW: The compareFn(a, b) returns true if `a` has HIGHER
//   priority than `b`. The highest-priority element sits at
//   index 0 and is returned by pop().
//
// EXAMPLES:
//   Min by value:  (a, b) => a.value < b.value
//   Max by value:  (a, b) => a.value > b.value
//   By urgency:    (a, b) => a.priority < b.priority
//
// COMPLEXITY: Same as MinHeap — O(log n) push/pop, O(1) peek
// ================================================================

class PriorityQueue<T> {
  private heap: T[] = [];

  constructor(private compareFn: (a: T, b: T) => boolean) {}

  get size(): number {
    return this.heap.length;
  }

  peek(): T | undefined {
    return this.heap[0];
  }

  push(val: T): void {
    this.heap.push(val);
    this.bubbleUp(this.heap.length - 1);
  }

  pop(): T | undefined {
    if (this.heap.length === 0) return undefined;
    if (this.heap.length === 1) return this.heap.pop();

    const top = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.bubbleDown(0);
    return top;
  }

  private bubbleUp(i: number): void {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (!this.compareFn(this.heap[i], this.heap[parent])) break;
      [this.heap[i], this.heap[parent]] = [this.heap[parent], this.heap[i]];
      i = parent;
    }
  }

  private bubbleDown(i: number): void {
    const n = this.heap.length;
    while (true) {
      let best = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;

      if (left < n && this.compareFn(this.heap[left], this.heap[best])) {
        best = left;
      }
      if (right < n && this.compareFn(this.heap[right], this.heap[best])) {
        best = right;
      }
      if (best === i) break;

      [this.heap[i], this.heap[best]] = [this.heap[best], this.heap[i]];
      i = best;
    }
  }
}


// ================================================================
// 🧪 DEMO 1: Basic MinHeap Operations
// ================================================================

function demoMinHeap(): void {
  console.log("═══════════════════════════════════════════");
  console.log("🧪 Demo 1: MinHeap — Basic Operations");
  console.log("═══════════════════════════════════════════\n");

  const heap = new MinHeap();

  console.log("Inserting: 10, 4, 15, 1, 7, 3");
  [10, 4, 15, 1, 7, 3].forEach((v) => heap.insert(v));

  console.log(`  Heap array: [${heap.toArray()}]`);
  console.log(`  Peek (min): ${heap.peek()}`);
  console.log(`  Size: ${heap.size}\n`);

  // ──────────────────────────────────────────────────────────────
  // HEAP SORT — a natural consequence of the heap structure.
  // Just keep extracting the min, and you get sorted output!
  // This is O(n log n) — same as mergesort/quicksort.
  // ──────────────────────────────────────────────────────────────
  console.log("Extracting all elements in order:");
  const sorted: number[] = [];
  while (heap.size > 0) {
    sorted.push(heap.extractMin()!);
  }
  console.log(`  Result: [${sorted}]`);
  console.log(`  ✅ Elements come out sorted — this is heap sort!\n`);

  console.log("Building heap from array [9, 5, 2, 7, 1, 8]:");
  const built = MinHeap.buildHeap([9, 5, 2, 7, 1, 8]);
  console.log(`  Heap array: [${built.toArray()}]`);
  console.log(`  Peek (min): ${built.peek()}\n`);
}


// ================================================================
// 🧪 DEMO 2: MaxHeap with Negation Trick
// ================================================================

function demoMaxHeap(): void {
  console.log("═══════════════════════════════════════════");
  console.log("🧪 Demo 2: MaxHeap — Negation Trick");
  console.log("═══════════════════════════════════════════\n");

  const heap = new MaxHeap();

  console.log("Inserting: 10, 4, 15, 1, 7, 3");
  [10, 4, 15, 1, 7, 3].forEach((v) => heap.insert(v));

  console.log(`  Peek (max): ${heap.peek()}`);
  console.log(`  Size: ${heap.size}\n`);

  console.log("Extracting all elements in order:");
  const sorted: number[] = [];
  while (heap.size > 0) {
    sorted.push(heap.extractMax()!);
  }
  console.log(`  Result: [${sorted}]`);
  console.log(`  ✅ Elements come out in descending order!\n`);
}


// ================================================================
// 🧪 DEMO 3: PriorityQueue with Custom Comparator
// ================================================================
// This demo shows how priority queues handle real-world objects
// (tasks with names and urgency levels), not just raw numbers.
// ================================================================

function demoPriorityQueue(): void {
  console.log("═══════════════════════════════════════════");
  console.log("🧪 Demo 3: PriorityQueue — Custom Objects");
  console.log("═══════════════════════════════════════════\n");

  interface Task {
    name: string;
    priority: number;
  }

  const taskQueue = new PriorityQueue<Task>((a, b) => a.priority < b.priority);

  const tasks: Task[] = [
    { name: "Fix critical bug", priority: 1 },
    { name: "Write tests", priority: 5 },
    { name: "Deploy hotfix", priority: 2 },
    { name: "Update docs", priority: 8 },
    { name: "Code review", priority: 3 },
  ];

  console.log("Adding tasks:");
  tasks.forEach((t) => {
    console.log(`  📌 ${t.name} (priority: ${t.priority})`);
    taskQueue.push(t);
  });

  console.log("\nProcessing tasks by priority:");
  while (taskQueue.size > 0) {
    const task = taskQueue.pop()!;
    console.log(`  ▶️  [Priority ${task.priority}] ${task.name}`);
  }
  console.log("  ✅ Tasks processed in priority order!\n");
}


// ================================================================
// 🧪 DEMO 4: Find K Largest Elements
// ================================================================
// WHAT: Given an unsorted array, find the K largest elements.
//
// WHY A MIN-HEAP for finding the LARGEST?
//   Counter-intuitive but brilliant! We maintain a min-heap of
//   size K. The root is the SMALLEST of our K candidates — it's
//   the "gatekeeper." When a new number comes in:
//     - If it's bigger than the gatekeeper → it deserves a spot.
//       Evict the gatekeeper (extractMin) and insert the new number.
//     - If it's smaller → it can't be in the top K. Skip it.
//
//   After processing all numbers, the heap contains exactly the
//   K largest elements.
//
// REAL-WORLD ANALOGY:
//   Imagine a VIP section with K seats. A bouncer (the min-heap
//   root) only lets in people with higher status than the
//   current lowest-status VIP. If someone better shows up, the
//   weakest VIP gets bumped.
//
// COMPLEXITY: O(n log k) time, O(k) space
//   Much better than sorting O(n log n) when k << n.
// ================================================================

function demoKLargest(): void {
  console.log("═══════════════════════════════════════════");
  console.log("🧪 Demo 4: Top K — Find K Largest Elements");
  console.log("═══════════════════════════════════════════\n");

  function findKLargest(nums: number[], k: number): number[] {
    const minHeap = new MinHeap();

    for (const num of nums) {
      minHeap.insert(num);
      if (minHeap.size > k) {
        minHeap.extractMin();
      }
    }

    const result: number[] = [];
    while (minHeap.size > 0) {
      result.push(minHeap.extractMin()!);
    }
    return result;
  }

  const nums = [3, 1, 5, 12, 2, 11, 9, 7, 15, 4];
  const k = 4;

  console.log(`  Array: [${nums}]`);
  console.log(`  K = ${k}\n`);

  const result = findKLargest(nums, k);
  console.log(`  K largest elements: [${result}]`);
  console.log(`  (Sorted for clarity: [${result.sort((a, b) => a - b)}])`);
  console.log(`  ✅ Expected: [9, 11, 12, 15]\n`);

  console.log("  💡 Why min heap for K largest?");
  console.log("     The min heap root is the SMALLEST of the K largest.");
  console.log("     It acts as a gatekeeper — only bigger values replace it.\n");
}


// ================================================================
// 🧪 DEMO 5: Merge K Sorted Arrays
// ================================================================
// WHAT: Given K sorted arrays, merge them into one sorted array.
//
// HOW:
//   1. Push the first element of each array into a priority queue
//      along with metadata (which array, which index).
//   2. Pop the smallest element → add to result.
//   3. Push the NEXT element from that same array into the queue.
//   4. Repeat until the queue is empty.
//
// WHY a heap? We always need the global minimum across K arrays.
//   A heap gives us that in O(log K). Merging two-at-a-time would
//   be O(n log K) too, but the heap approach is cleaner.
//
// REAL-WORLD ANALOGY:
//   Merging K checkout lines at a grocery store into one. You
//   always serve the customer who's been waiting longest across
//   ALL lines (the heap finds them in O(log K)).
//
// COMPLEXITY: O(N log K) time, O(K) space
//   where N = total elements, K = number of arrays
// ================================================================

function demoMergeKSorted(): void {
  console.log("═══════════════════════════════════════════");
  console.log("🧪 Demo 5: Merge K Sorted Arrays");
  console.log("═══════════════════════════════════════════\n");

  type HeapEntry = [number, number, number];

  function mergeKSorted(arrays: number[][]): number[] {
    const pq = new PriorityQueue<HeapEntry>((a, b) => a[0] < b[0]);

    for (let i = 0; i < arrays.length; i++) {
      if (arrays[i].length > 0) {
        pq.push([arrays[i][0], i, 0]);
      }
    }

    const result: number[] = [];
    while (pq.size > 0) {
      const [val, arrIdx, elIdx] = pq.pop()!;
      result.push(val);

      if (elIdx + 1 < arrays[arrIdx].length) {
        pq.push([arrays[arrIdx][elIdx + 1], arrIdx, elIdx + 1]);
      }
    }
    return result;
  }

  const arrays = [
    [1, 4, 7, 10],
    [2, 5, 8, 11],
    [3, 6, 9, 12],
    [0, 13, 14, 15],
  ];

  console.log("  Input arrays:");
  arrays.forEach((arr, i) => console.log(`    Array ${i}: [${arr}]`));

  const merged = mergeKSorted(arrays);
  console.log(`\n  Merged: [${merged}]`);

  const isSorted = merged.every((v, i) => i === 0 || v >= merged[i - 1]);
  console.log(`  ✅ Is sorted: ${isSorted}`);
  console.log(
    `  📊 Complexity: O(N log K) where N=${merged.length}, K=${arrays.length}\n`
  );
}


// ================================================================
// 🧪 DEMO 6: Running Median — Two Heaps
// ================================================================
// WHAT: Given a stream of numbers arriving one at a time, find
//   the median at any point.
//
// WHY TWO HEAPS?
//   The median splits the data in half. We maintain:
//     - maxHeap: holds the SMALLER half (root = largest of smalls)
//     - minHeap: holds the LARGER half (root = smallest of larges)
//
//   The median is either the maxHeap root (odd count) or the
//   average of both roots (even count).
//
// HOW:
//   1. Insert new number into the appropriate heap:
//      - If <= maxHeap root → it belongs in the smaller half.
//      - Otherwise → it belongs in the larger half.
//   2. Rebalance: ensure the heaps differ in size by at most 1.
//      Move the root from the larger heap to the smaller one.
//   3. Query median in O(1) — just look at the root(s).
//
// REAL-WORLD ANALOGY:
//   Imagine sorting a deck of cards into two piles: "low" and
//   "high." The top of the "low" pile (maxHeap) and the top of
//   the "high" pile (minHeap) bracket the median. Keep the piles
//   balanced in size, and the median is always right there.
//
// COMPLEXITY:
//   addNum — O(log n): one heap insert + possibly one rebalance
//   findMedian — O(1): just peek at root(s)
// ================================================================

function demoRunningMedian(): void {
  console.log("═══════════════════════════════════════════");
  console.log("🧪 Demo 6: Running Median — Two Heaps");
  console.log("═══════════════════════════════════════════\n");

  class MedianFinder {
    private maxHeap = new MaxHeap();
    private minHeap = new MinHeap();

    addNum(num: number): void {
      if (this.maxHeap.size === 0 || num <= this.maxHeap.peek()!) {
        this.maxHeap.insert(num);
      } else {
        this.minHeap.insert(num);
      }

      if (this.maxHeap.size > this.minHeap.size + 1) {
        this.minHeap.insert(this.maxHeap.extractMax()!);
      } else if (this.minHeap.size > this.maxHeap.size) {
        this.maxHeap.insert(this.minHeap.extractMin()!);
      }
    }

    findMedian(): number {
      if (this.maxHeap.size > this.minHeap.size) {
        return this.maxHeap.peek()!;
      }
      return (this.maxHeap.peek()! + this.minHeap.peek()!) / 2;
    }

    getState(): string {
      return `maxHeap.peek=${this.maxHeap.peek()}, minHeap.peek=${this.minHeap.peek()}, sizes=[${this.maxHeap.size},${this.minHeap.size}]`;
    }
  }

  const mf = new MedianFinder();
  const stream = [5, 15, 1, 3, 8, 7, 2, 10];

  console.log("  Simulating a data stream:\n");
  console.log(
    "  ┌────────────┬─────────────────────────────────────────────┬─────────┐"
  );
  console.log(
    "  │  Add Value  │  State                                      │  Median │"
  );
  console.log(
    "  ├────────────┼─────────────────────────────────────────────┼─────────┤"
  );

  for (const num of stream) {
    mf.addNum(num);
    const median = mf.findMedian();
    const state = mf.getState();
    console.log(
      `  │  ${String(num).padEnd(9)} │  ${state.padEnd(44)}│  ${String(median).padEnd(6)} │`
    );
  }

  console.log(
    "  └────────────┴─────────────────────────────────────────────┴─────────┘"
  );
  console.log(
    "\n  ✅ Median updates in O(log n) per insertion, O(1) to query!\n"
  );

  console.log("  💡 How it works:");
  console.log("     • maxHeap holds the SMALLER half (root = largest of smalls)");
  console.log("     • minHeap holds the LARGER half (root = smallest of larges)");
  console.log("     • Median = average of two roots (even count)");
  console.log("     •          or maxHeap root (odd count)\n");
}


// ================================================================
// 🚀 Run All Demos
// ================================================================

console.log("\n🏔️  HEAPS & PRIORITY QUEUES — Interactive Examples\n");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

demoMinHeap();
demoMaxHeap();
demoPriorityQueue();
demoKLargest();
demoMergeKSorted();
demoRunningMedian();

console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("🎓 All demos complete! Study the code, then try");
console.log("   implementing these patterns on LeetCode.");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
