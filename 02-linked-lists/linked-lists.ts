export {};

// ================================================================
// 🔗 CHAPTER 02 — Linked Lists: Runnable Examples
// ================================================================
// Run: bun run 02-linked-lists/linked-lists.ts
//
// Linked lists are the gateway to understanding POINTER-BASED
// data structures. Unlike arrays (contiguous memory), linked list
// nodes are scattered in memory, connected only by references.
//
// WHY LEARN LINKED LISTS?
//   - Foundation for stacks, queues, graphs, and trees
//   - O(1) insertion/deletion at known positions (vs O(n) for arrays)
//   - Classic interview topic: reversal, cycle detection, merging
//   - Teaches pointer manipulation — a core CS skill
//
// TRADE-OFFS vs Arrays:
// ┌───────────────────┬────────────┬────────────────┐
// │ Operation         │ Array      │ Linked List    │
// ├───────────────────┼────────────┼────────────────┤
// │ Access by index   │ O(1)       │ O(n) ❌        │
// │ Insert at head    │ O(n)       │ O(1) ✅        │
// │ Insert at tail    │ O(1)*      │ O(n) or O(1)** │
// │ Delete at head    │ O(n)       │ O(1) ✅        │
// │ Search            │ O(n)       │ O(n)           │
// │ Memory            │ Contiguous │ Scattered+ptrs │
// └───────────────────┴────────────┴────────────────┘
// * Amortized  ** O(1) if we maintain a tail pointer
//
// This file covers:
//   1. Singly Linked List — full implementation with all operations
//   2. List Reversal — iterative and recursive approaches
//   3. Cycle Detection — Floyd's tortoise and hare algorithm
//   4. Find Middle — fast/slow pointer technique
//   5. Merge Two Sorted Lists — the "zipper" merge
//
// See also: 02-linked-lists/README.md for theory and diagrams.
// ================================================================


// ================================================================
// 📦 ListNode — The Building Block
// ================================================================
// Every linked list node has exactly two things:
//   1. data — the value it stores
//   2. next — a pointer to the next node (or null if it's the last)
//
// The generic <T> makes this work with any data type:
//   ListNode<number>, ListNode<string>, ListNode<User>, etc.
//
// Visual: [data | next] → [data | next] → [data | null]
// ================================================================

class ListNode<T> {
  data: T;
  next: ListNode<T> | null = null;

  constructor(data: T) {
    this.data = data;
  }
}


// ================================================================
// 🔹 SINGLY LINKED LIST — Full Implementation
// ================================================================
// A singly linked list maintains a `head` pointer to the first node.
// All operations traverse forward from head (no backward links).
//
// We also track `length` privately for O(1) size queries.
// Without it, getting the size would require an O(n) traversal.
// ================================================================

class SinglyLinkedList<T> {
  head: ListNode<T> | null = null;
  private length: number = 0;

  // ── INSERT AT HEAD — O(1) ──────────────────────────────────
  // The new node's next points to the old head, then we update head.
  // No traversal needed — this is the linked list's killer feature.
  //
  // Before: head → [A] → [B] → null
  // After:  head → [NEW] → [A] → [B] → null
  insertHead(data: T): void {
    const newNode = new ListNode(data);
    newNode.next = this.head; // Point new node to current head
    this.head = newNode;      // Update head to new node
    this.length++;
  }

  // ── INSERT AT TAIL — O(n) ──────────────────────────────────
  // We must traverse the entire list to find the last node,
  // because singly linked lists don't have a tail pointer.
  //
  // To make this O(1), we could maintain a `tail` pointer —
  // see the Queue implementation in Chapter 03 for that approach.
  insertTail(data: T): void {
    const newNode = new ListNode(data);
    if (!this.head) {
      // Empty list — new node becomes the head
      this.head = newNode;
    } else {
      // Traverse to the last node (the one whose .next is null)
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = newNode;
    }
    this.length++;
  }

  // ── INSERT AT INDEX — O(n) ─────────────────────────────────
  // Walk to the node BEFORE the target index, then splice in.
  // We traverse (index - 1) nodes, so worst case is O(n).
  insertAt(index: number, data: T): void {
    if (index < 0 || index > this.length) {
      throw new Error(`Index ${index} out of bounds (size: ${this.length})`);
    }

    // Inserting at index 0 is just insertHead
    if (index === 0) return this.insertHead(data);

    const newNode = new ListNode(data);
    // Walk to the node just BEFORE the insertion point
    let prev = this.head;
    for (let i = 0; i < index - 1; i++) {
      prev = prev!.next;
    }
    // Splice: newNode points to what prev pointed to, prev points to newNode
    newNode.next = prev!.next;
    prev!.next = newNode;
    this.length++;
  }

  // ── DELETE HEAD — O(1) ─────────────────────────────────────
  // Just move the head pointer forward. The old head node becomes
  // unreachable and will be garbage collected.
  deleteHead(): T | null {
    if (!this.head) return null;
    const data = this.head.data;
    this.head = this.head.next; // Skip over the old head
    this.length--;
    return data;
  }

  // ── DELETE TAIL — O(n) ─────────────────────────────────────
  // We need the SECOND-TO-LAST node to set its .next to null.
  // This requires traversing the entire list.
  //
  // This is a fundamental limitation of singly linked lists.
  // Doubly linked lists can delete the tail in O(1).
  deleteTail(): T | null {
    if (!this.head) return null;

    // Special case: only one node
    if (!this.head.next) {
      const data = this.head.data;
      this.head = null;
      this.length--;
      return data;
    }

    // Traverse to the second-to-last node
    let current = this.head;
    while (current.next!.next) {
      current = current.next!;
    }
    const data = current.next!.data;
    current.next = null; // Remove the last node
    this.length--;
    return data;
  }

  // ── DELETE BY VALUE — O(n) ─────────────────────────────────
  // Searches for the first node with matching data and removes it.
  // Returns true if found and deleted, false otherwise.
  deleteValue(data: T): boolean {
    if (!this.head) return false;

    // Special case: the value is in the head node
    if (this.head.data === data) {
      this.head = this.head.next;
      this.length--;
      return true;
    }

    // Walk the list, looking one node ahead so we can unlink it
    let current = this.head;
    while (current.next) {
      if (current.next.data === data) {
        // Bypass the target node: current → target.next
        current.next = current.next.next;
        this.length--;
        return true;
      }
      current = current.next;
    }
    return false;
  }

  // ── SEARCH — O(n) ─────────────────────────────────────────
  // Linear scan — no random access in linked lists.
  // Returns the index if found, -1 otherwise.
  search(data: T): number {
    let current = this.head;
    let index = 0;
    while (current) {
      if (current.data === data) return index;
      current = current.next;
      index++;
    }
    return -1;
  }

  // ── REVERSE — O(n) ────────────────────────────────────────
  // Reverses the list IN PLACE by flipping all the .next pointers.
  // This is a VERY common interview question.
  //
  // The trick: maintain three pointers — prev, current, next.
  // At each step: save next, point current back to prev, advance.
  //
  // Before: null ← (prev)  [A] → [B] → [C] → null
  // After:  null ← [A] ← [B] ← [C] (head)
  reverse(): void {
    let prev: ListNode<T> | null = null;
    let current = this.head;

    while (current) {
      const next = current.next;  // Save the next node before we overwrite it
      current.next = prev;        // Flip the pointer: current now points backward
      prev = current;             // Advance prev to current
      current = next;             // Advance current to the saved next
    }
    this.head = prev; // prev is now the last node we visited = new head
  }

  // ── PRINT — O(n) ──────────────────────────────────────────
  // Produces a visual representation: "10 → 20 → 30 → null"
  print(): string {
    const values: T[] = [];
    let current = this.head;
    while (current) {
      values.push(current.data);
      current = current.next;
    }
    return values.join(" → ") + " → null";
  }

  // O(1) — we maintain the length counter on every insert/delete
  size(): number {
    return this.length;
  }

  // O(n) — collect all values into a standard array
  toArray(): T[] {
    const result: T[] = [];
    let current = this.head;
    while (current) {
      result.push(current.data);
      current = current.next;
    }
    return result;
  }
}


// ================================================================
// 🧪 HELPERS: Build & Print from Arrays
// ================================================================
// These utility functions make it easy to create linked lists from
// plain arrays for testing, and to visualize them as strings.
// ================================================================

function buildList(values: number[]): ListNode<number> | null {
  if (values.length === 0) return null;
  const head = new ListNode(values[0]);
  let current = head;
  for (let i = 1; i < values.length; i++) {
    current.next = new ListNode(values[i]);
    current = current.next;
  }
  return head;
}

function printList(head: ListNode<number> | null): string {
  const values: number[] = [];
  let current = head;
  while (current) {
    values.push(current.data);
    current = current.next;
  }
  return values.join(" → ") + " → null";
}


// ================================================================
// 🧪 DEMO 1: Singly Linked List Operations
// ================================================================
// Walks through every operation: insert, search, delete, reverse.
// Watch the list transform step by step.
// ================================================================

function demoSinglyLinkedList(): void {
  console.log("═".repeat(60));
  console.log("🔹 DEMO 1: Singly Linked List Operations");
  console.log("═".repeat(60));

  const list = new SinglyLinkedList<number>();

  // ── Insertion ──
  console.log("\n📌 Inserting at tail: 10, 20, 30");
  list.insertTail(10);
  list.insertTail(20);
  list.insertTail(30);
  console.log(`   List: ${list.print()}`);
  console.log(`   Size: ${list.size()}`);

  console.log("\n📌 Inserting 5 at head");
  list.insertHead(5);
  console.log(`   List: ${list.print()}`);

  console.log("\n📌 Inserting 15 at index 2");
  list.insertAt(2, 15);
  console.log(`   List: ${list.print()}`);

  // ── Search ──
  console.log("\n📌 Searching for 15");
  const idx = list.search(15);
  console.log(`   Found at index: ${idx}`);

  console.log("\n📌 Searching for 99 (not in list)");
  console.log(`   Found at index: ${list.search(99)}`);

  // ── Deletion ──
  console.log("\n📌 Deleting value 15");
  list.deleteValue(15);
  console.log(`   List: ${list.print()}`);

  console.log("\n📌 Deleting head");
  const deletedHead = list.deleteHead();
  console.log(`   Deleted: ${deletedHead}`);
  console.log(`   List: ${list.print()}`);

  console.log("\n📌 Deleting tail");
  const deletedTail = list.deleteTail();
  console.log(`   Deleted: ${deletedTail}`);
  console.log(`   List: ${list.print()}`);

  // ── Reversal ──
  console.log("\n📌 Reversing the list");
  list.insertTail(30);
  list.insertTail(40);
  console.log(`   Before: ${list.print()}`);
  list.reverse();
  console.log(`   After:  ${list.print()}`);

  console.log(`\n   Final size: ${list.size()}`);
}


// ================================================================
// 🧪 DEMO 2: Reverse Linked List (Iterative + Recursive)
// ================================================================
// Two fundamental approaches to reversing a linked list.
//
// ITERATIVE (preferred in interviews):
//   - Walk through the list, flipping each pointer as we go
//   - Uses 3 pointers: prev, current, next
//   - O(n) time, O(1) space
//
// RECURSIVE:
//   - Recurse to the end, then rewire on the way back up
//   - Elegant but uses O(n) stack space (risk of stack overflow)
//   - O(n) time, O(n) space
// ================================================================

function reverseIterative(head: ListNode<number> | null): ListNode<number> | null {
  let prev: ListNode<number> | null = null;
  let current = head;
  let step = 0;

  console.log(`\n   Initial: ${printList(head)}`);

  while (current) {
    const next = current.next;  // Save next before overwriting
    current.next = prev;        // Flip the pointer
    prev = current;             // Advance prev
    current = next;             // Advance current
    step++;
    console.log(`   Step ${step}: prev=${prev?.data}, current=${current?.data ?? "null"} → reversed so far: ${printList(prev)}`);
  }

  return prev; // New head is the last node we visited
}

function reverseRecursive(head: ListNode<number> | null): ListNode<number> | null {
  // Base case: empty list or single node — already "reversed"
  if (!head?.next) return head;

  // Recurse to the end of the list
  // newHead will be the LAST node (it bubbles up through all returns)
  const newHead = reverseRecursive(head.next);

  // head.next is the node AFTER head. We make it point BACK to head.
  // Before: head → nextNode → ...
  // After:  head ← nextNode
  head.next.next = head;
  head.next = null; // head is now the tail, so it points to null

  return newHead;
}

function demoReverse(): void {
  console.log("\n" + "═".repeat(60));
  console.log("🔄 DEMO 2: Reverse Linked List");
  console.log("═".repeat(60));

  console.log("\n── Iterative Reversal ──");
  const list1 = buildList([1, 2, 3, 4, 5]);
  const reversed1 = reverseIterative(list1);
  console.log(`   Result: ${printList(reversed1)}`);

  console.log("\n── Recursive Reversal ──");
  const list2 = buildList([1, 2, 3, 4, 5]);
  console.log(`   Before: ${printList(list2)}`);
  const reversed2 = reverseRecursive(list2);
  console.log(`   After:  ${printList(reversed2)}`);
}


// ================================================================
// 🧪 DEMO 3: Cycle Detection — Floyd's Tortoise and Hare
// ================================================================
// Problem: Given a linked list, determine if it has a cycle.
// A cycle means some node's .next points back to an earlier node,
// creating an infinite loop.
//
// FLOYD'S ALGORITHM uses two pointers:
//   🐢 Slow: moves 1 step at a time
//   🐇 Fast: moves 2 steps at a time
//
// If there's a cycle, fast will "lap" slow and they'll meet.
// If there's no cycle, fast will reach null.
//
// WHY DOES IT WORK?
// Once both pointers are inside the cycle, the gap between them
// shrinks by 1 each step (fast gains 1 step on slow). So they
// MUST eventually meet — it's like a faster runner on a track.
//
// FINDING THE CYCLE START (Phase 2):
// After they meet, reset one pointer to head. Move both at speed 1.
// They'll meet again at the cycle's entry point. (This is a
// mathematical proof involving modular arithmetic.)
//
// Time: O(n) | Space: O(1)
// ================================================================

function hasCycle(head: ListNode<number> | null): { hasCycle: boolean; meetNode: number | null } {
  let slow = head;
  let fast = head;
  let step = 0;

  while (fast?.next) {
    slow = slow!.next;          // 🐢 one step
    fast = fast.next.next;      // 🐇 two steps
    step++;
    console.log(`   Step ${step}: 🐢 slow=${slow?.data}, 🐇 fast=${fast?.data ?? "null"}`);

    if (slow === fast) {
      // Pointers collided — a cycle exists!
      return { hasCycle: true, meetNode: slow!.data };
    }
  }

  // Fast reached the end → no cycle
  return { hasCycle: false, meetNode: null };
}

function findCycleStart(head: ListNode<number> | null): number | null {
  // Phase 1: Detect if a cycle exists (same as hasCycle)
  let slow = head;
  let fast = head;

  while (fast?.next) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) break; // They met inside the cycle
  }

  if (!fast?.next) return null; // No cycle

  // Phase 2: Find the entry point of the cycle
  // Reset slow to head. Move both at speed 1.
  // Mathematical proof: they meet at the cycle start.
  slow = head;
  while (slow !== fast) {
    slow = slow!.next;
    fast = fast!.next;
  }
  return slow!.data;
}

function demoCycleDetection(): void {
  console.log("\n" + "═".repeat(60));
  console.log("🔄 DEMO 3: Cycle Detection (Floyd's Algorithm)");
  console.log("═".repeat(60));

  // ── List WITH a cycle ──
  // Structure: 1 → 2 → 3 → 4 → 5 → back to 3
  console.log("\n── List with cycle: 1 → 2 → 3 → 4 → 5 → back to 3 ──");
  const n1 = new ListNode(1);
  const n2 = new ListNode(2);
  const n3 = new ListNode(3);
  const n4 = new ListNode(4);
  const n5 = new ListNode(5);
  n1.next = n2;
  n2.next = n3;
  n3.next = n4;
  n4.next = n5;
  n5.next = n3; // 🔄 Creates the cycle!

  const result1 = hasCycle(n1);
  console.log(`   🔍 Has cycle? ${result1.hasCycle} (met at node ${result1.meetNode})`);

  const cycleStart = findCycleStart(n1);
  console.log(`   🎯 Cycle starts at node: ${cycleStart}`);

  // ── List WITHOUT a cycle ──
  console.log("\n── List without cycle: 1 → 2 → 3 → 4 → 5 → null ──");
  const list2 = buildList([1, 2, 3, 4, 5]);
  const result2 = hasCycle(list2);
  console.log(`   🔍 Has cycle? ${result2.hasCycle}`);
}


// ================================================================
// 🧪 DEMO 4: Find Middle of Linked List
// ================================================================
// Problem: Find the middle node of a linked list in one pass.
//
// NAIVE: Count all nodes (pass 1), then walk to n/2 (pass 2) → 2 passes
// OPTIMAL: Fast/slow pointer technique → 1 pass!
//
// The slow pointer moves 1 step, fast moves 2 steps.
// When fast reaches the end, slow is at the middle.
//
// WHY? Fast covers distance at 2× speed. When fast finishes
// the full length, slow has covered exactly half.
//
// For even-length lists, this returns the second of the two
// middle nodes (consistent with LeetCode's definition).
//
// Time: O(n) | Space: O(1)
// ================================================================

function findMiddle(head: ListNode<number> | null): ListNode<number> | null {
  let slow = head;
  let fast = head;
  let step = 0;

  while (fast?.next) {
    slow = slow!.next;          // 🐢 one step
    fast = fast.next.next;      // 🐇 two steps
    step++;
    console.log(`   Step ${step}: 🐢 slow=${slow?.data}, 🐇 fast=${fast?.data ?? "end"}`);
  }

  // When fast can't advance, slow is at the middle
  return slow;
}

function demoFindMiddle(): void {
  console.log("\n" + "═".repeat(60));
  console.log("🎯 DEMO 4: Find Middle of Linked List");
  console.log("═".repeat(60));

  console.log("\n── Odd-length list: [1, 2, 3, 4, 5] ──");
  const list1 = buildList([1, 2, 3, 4, 5]);
  console.log(`   List: ${printList(list1)}`);
  const mid1 = findMiddle(list1);
  console.log(`   ✅ Middle: ${mid1?.data}`);

  console.log("\n── Even-length list: [1, 2, 3, 4, 5, 6] ──");
  const list2 = buildList([1, 2, 3, 4, 5, 6]);
  console.log(`   List: ${printList(list2)}`);
  const mid2 = findMiddle(list2);
  console.log(`   ✅ Middle (2nd of two): ${mid2?.data}`);

  console.log("\n── Single element: [42] ──");
  const list3 = buildList([42]);
  const mid3 = findMiddle(list3);
  console.log(`   ✅ Middle: ${mid3?.data}`);
}


// ================================================================
// 🧪 DEMO 5: Merge Two Sorted Lists
// ================================================================
// Problem: Given two sorted linked lists, merge them into one
// sorted list. (LeetCode #21 — a very common interview question.)
//
// ALGORITHM (the "zipper" merge):
//   1. Create a dummy node as the starting point
//   2. Compare the front elements of both lists
//   3. Attach the smaller one to the result, advance that list
//   4. Repeat until one list is exhausted
//   5. Attach whatever remains from the other list
//
// The "dummy node" trick avoids special-casing the first element.
// We return dummy.next to skip the dummy and get the real head.
//
// This is the same merge step used in Merge Sort (see Chapter 00).
//
// Time: O(n + m) where n, m are the list lengths | Space: O(1)
// ================================================================

function mergeTwoSortedLists(
  l1: ListNode<number> | null,
  l2: ListNode<number> | null
): ListNode<number> | null {
  // Dummy node simplifies edge cases — we never have to check
  // "is the result list empty?" because dummy is always there.
  const dummy = new ListNode(0);
  let tail = dummy;
  let step = 0;

  // Compare front elements of both lists, pick the smaller
  while (l1 && l2) {
    step++;
    if (l1.data <= l2.data) {
      console.log(`   Step ${step}: Pick ${l1.data} from L1 (${l1.data} <= ${l2.data})`);
      tail.next = l1;
      l1 = l1.next;
    } else {
      console.log(`   Step ${step}: Pick ${l2.data} from L2 (${l2.data} < ${l1.data})`);
      tail.next = l2;
      l2 = l2.next;
    }
    tail = tail.next;
  }

  // One list is exhausted — attach the remainder of the other.
  // No need to iterate: just link the remaining chain directly.
  if (l1) {
    console.log(`   Attach remaining L1: ${printList(l1)}`);
    tail.next = l1;
  }
  if (l2) {
    console.log(`   Attach remaining L2: ${printList(l2)}`);
    tail.next = l2;
  }

  // Skip the dummy node — it was just a placeholder
  return dummy.next;
}

function demoMergeSortedLists(): void {
  console.log("\n" + "═".repeat(60));
  console.log("🔀 DEMO 5: Merge Two Sorted Lists");
  console.log("═".repeat(60));

  const l1 = buildList([1, 3, 5, 7]);
  const l2 = buildList([2, 4, 6, 8]);

  console.log(`\n   L1: ${printList(l1)}`);
  console.log(`   L2: ${printList(l2)}`);
  console.log();

  const merged = mergeTwoSortedLists(l1, l2);
  console.log(`\n   ✅ Merged: ${printList(merged)}`);

  // Edge case: one list is empty
  console.log("\n── Edge case: one empty list ──");
  const l3 = buildList([1, 2, 3]);
  const l4: ListNode<number> | null = null;
  console.log(`   L3: ${printList(l3)}`);
  console.log(`   L4: ${printList(l4)}`);
  const merged2 = mergeTwoSortedLists(l3, l4);
  console.log(`   ✅ Merged: ${printList(merged2)}`);

  // Different-sized lists
  console.log("\n── Interleaved sizes ──");
  const l5 = buildList([1, 5, 10]);
  const l6 = buildList([2, 3, 4, 6, 7, 8, 9]);
  console.log(`   L5: ${printList(l5)}`);
  console.log(`   L6: ${printList(l6)}`);
  const merged3 = mergeTwoSortedLists(l5, l6);
  console.log(`\n   ✅ Merged: ${printList(merged3)}`);
}


// ================================================================
// 🚀 RUN ALL DEMOS
// ================================================================

console.log("🔗 LINKED LISTS — Interactive Examples");
console.log("=".repeat(60));

demoSinglyLinkedList();
demoReverse();
demoCycleDetection();
demoFindMiddle();
demoMergeSortedLists();

console.log("\n" + "═".repeat(60));
console.log("✅ All demos complete!");
console.log("═".repeat(60));
