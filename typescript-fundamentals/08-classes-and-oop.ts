// ================================================================
// 🏗️ Section 8: Classes & OOP — For Data Structures
// Run standalone:  bun run 08-classes-and-oop.ts
// ================================================================

import { title, sub, explain, code, codeRaw, tip, log, color } from "./_helpers";
import { ListNode, Stack, TreeNode } from "./_shared";

export function run() {
  title("🏗️", "Section 8: Classes & OOP — For Data Structures");
  explain("Classes let you build custom data structures:");
  explain("linked lists, trees, graphs, stacks, queues, heaps.");

  sub("ListNode — the foundation of linked list problems");
  explain("Every linked list problem on LeetCode uses a node like this:");
  log();
  codeRaw(`class ListNode {`, "");
  codeRaw(`  val: number`, "The data stored in this node");
  codeRaw(`  next: ListNode | null`, "Pointer to the next node (or null = end)");
  codeRaw(`}`, "");

  log();
  explain("Building a linked list: 1 → 2 → 3 → null");
  const node3 = new ListNode(3);
  const node2 = new ListNode(2, node3);
  const node1 = new ListNode(1, node2);

  let current: ListNode | null = node1;
  const llValues: number[] = [];
  while (current !== null) {
    llValues.push(current.val);
    current = current.next;
  }
  log(color.green(`     ${llValues.join(" → ")} → null`));
  tip("Traversal: while (current !== null) { /* use current.val */ current = current.next }");

  sub("Stack — Last In, First Out (LIFO)");
  explain("Think of a stack of plates — you can only add/remove from the top:");
  log();
  const stack = new Stack<number>();
  stack.push(10); stack.push(20); stack.push(30);
  codeRaw(`stack.push(10), push(20), push(30)`, "Stack: [10, 20, 30] ← top");
  code(`stack.peek()`, stack.peek());
  explain("  ↳ Look at the top without removing it");
  code(`stack.pop()`, stack.pop());
  explain("  ↳ Remove and return the top element");
  code(`stack.peek() after pop`, stack.peek());
  explain("  ↳ Now 20 is on top");

  sub("TreeNode — for binary tree problems");
  explain("Trees use this shorthand constructor syntax:");
  log();
  codeRaw(`class TreeNode {`, "");
  codeRaw(`  constructor(`, "");
  codeRaw(`    public val: number,`, "'public' auto-creates the property");
  codeRaw(`    public left: TreeNode | null,`, "Left child");
  codeRaw(`    public right: TreeNode | null`, "Right child");
  codeRaw(`  ) {}`, "");
  codeRaw(`}`, "");

  log();
  explain("Building this tree:");
  log(color.green("         1"));
  log(color.green("        / \\"));
  log(color.green("       2   3"));
  log(color.green("      /"));
  log(color.green("     4"));
  log();
  const tree = new TreeNode(1, new TreeNode(2, new TreeNode(4)), new TreeNode(3));
  code(`tree.val`, tree.val);
  code(`tree.left?.val`, tree.left?.val);
  code(`tree.right?.val`, tree.right?.val);
  code(`tree.left?.left?.val`, tree.left?.left?.val);
  explain("  ↳ The ?. safely accesses properties — returns undefined if null");
}

if (import.meta.main) run();
